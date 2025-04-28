"use server";
import { adminClient } from "@/sanity/adminClient";
import { Post } from "@/sanity.types";
import { getSubredditBySlug } from "@/sanity/lib/subreddit/getSubredditBySlug";
import { getUser } from "@/sanity/lib/user/getUser";
import { systemPrompt } from "@/prompt";
import { createClerkToolkit } from "@clerk/agent-toolkit/ai-sdk";
import { CoreMessage, generateText, tool } from "ai";
import { auth } from "@clerk/nextjs/server";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export type PostImageData = {
  base64: string;
  filename: string;
  contentType: string;
} | null;

const reportUser = tool({
  description: "Report a user for violating community guidelines",
  parameters: z.object({
    userId: z.string().describe("The ID of the user to report"),
  }),
  execute: async ({ userId }) => {
    console.log(`>>>>>> Reporting user ${userId}`);
    const patch = adminClient.patch(userId);
    patch.set({ isReported: true });
    await patch.commit();

    console.log("User reported successfully");

    return {
      success: true,
      message: `User ${userId} reported successfully`,
    };
  },
});

const censorPost = tool({
  description: "Censor inappropriate content in post title and body",
  parameters: z.object({
    postId: z.string().describe("The ID of the post to censor"),
    title: z.string().optional().describe("Censored version of the title"),
    body: z.string().optional().describe("Censored version of the body"),
    isToBeReported: z
      .boolean()
      .optional()
      .describe(
        "If the post contains prohibited content, return true, otherwise return false"
      ),
  }),
  execute: async ({ postId, title, body, isToBeReported }) => {
    if (!isToBeReported) {
      console.log(`>>>>>> Post ${postId} is not reported`);
      return {
        success: true,
        message: `Post ${postId} is not reported`,
      };
    }

    console.log(`>>>>>> Censoring content in post ${postId}`);

    const patch = adminClient.patch(postId);

    if (title) {
      console.log(`>>>>>> Censoring title: ${title}`);
      patch.set({ title });
    }

    if (body) {
      console.log(`>>>>>> Censoring body: ${body}`);
      // Convert body to Portable Text format
      const portableTextBody = [
        {
          _type: "block",
          _key: Date.now().toString(),
          children: [
            {
              _type: "span",
              _key: Date.now().toString() + "1",
              text: body,
            },
          ],
        },
      ];
      patch.set({ body: portableTextBody });
    }

    if (isToBeReported) {
      console.log(`>>>>>> Reporting post ${postId}`);
      patch.set({ isReported: true });
    }

    await patch.commit();

    return {
      postId,
      censored: true,
      message: "Content has been censored",
    };
  },
});

export async function createPost({
  title,
  subredditSlug,
  body,
  imageBase64,
  imageFilename,
  imageContentType,
}: {
  title: string;
  subredditSlug: string;
  body?: string;
  imageBase64?: string | null;
  imageFilename?: string | null;
  imageContentType?: string | null;
}) {
  try {
    console.log("Starting post creation process");
    if (!title || !subredditSlug) {
      console.log("Missing required fields: title or subredditSlug");
      return { error: "Title and subreddit are required" };
    }

    console.log(
      `Creating post with title: "${title}" in subreddit: "${subredditSlug}"`
    );
    const user = await getUser();

    if ("error" in user) {
      console.log("User authentication error:", user.error);
      return { error: user.error };
    }
    console.log("User authenticated:", user._id);

    // Find the subreddit document by name
    console.log(`Looking up subreddit with slug: "${subredditSlug}"`);
    const subreddit = await getSubredditBySlug(subredditSlug);

    if (!subreddit?._id) {
      console.log(`Subreddit "${subredditSlug}" not found`);
      return { error: `Subreddit "${subredditSlug}" not found` };
    }
    console.log(`Found subreddit: ${subreddit._id}`);

    // Prepare image data if provided
    let imageAsset;
    if (imageBase64 && imageFilename && imageContentType) {
      console.log(`Image provided: ${imageFilename} (${imageContentType})`);
      console.log(`Image base64 length: ${imageBase64.length} characters`);
      try {
        console.log("Processing image data...");
        // Extract base64 data (remove data:image/jpeg;base64, part)
        const base64Data = imageBase64.split(",")[1];
        console.log(`Extracted base64 data (${base64Data.length} characters)`);

        // Convert base64 to buffer
        const buffer = Buffer.from(base64Data, "base64");
        console.log(`Converted to buffer (size: ${buffer.length} bytes)`);

        // Upload to Sanity
        console.log(`Uploading image to Sanity: ${imageFilename}`);
        imageAsset = await adminClient.assets.upload("image", buffer, {
          filename: imageFilename,
          contentType: imageContentType,
        });
        console.log(`Image uploaded successfully with ID: ${imageAsset._id}`);
      } catch (error) {
        console.error("Error uploading image:", error);
        console.log("Will continue post creation without image");
        // Continue without image if upload fails
      }
    } else {
      console.log("No image provided with post");
    }

    // Create the post
    console.log("Preparing post document");
    const postDoc: Partial<Post> = {
      _type: "post",
      title,
      body: body
        ? [
            {
              _type: "block",
              _key: Date.now().toString(),
              children: [
                {
                  _type: "span",
                  _key: Date.now().toString() + "1",
                  text: body,
                },
              ],
            },
          ]
        : undefined,
      author: {
        _type: "reference",
        _ref: user._id,
      },
      subreddit: {
        _type: "reference",
        _ref: subreddit._id,
      },
      publishedAt: new Date().toISOString(),
    };

    // Add image if available
    if (imageAsset) {
      console.log(`Adding image reference to post: ${imageAsset._id}`);
      postDoc.image = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: imageAsset._id,
        },
      };
    }

    console.log("Creating post in Sanity database");
    const post = await adminClient.create(postDoc as Post);
    console.log(`Post created successfully with ID: ${post._id}`);

    // Call the content moderation API
    // ----- MOD STEP ----
    console.log("Starting content moderation process");

    const messages = [
      {
        role: "user",
        content: `I posted this post -> Post ID: ${post._id}\nTitle: ${title}\nBody: ${body}`,
      },
    ];

    console.log("Prepared messages for moderation:", JSON.stringify(messages));

    try {
      console.log("Authenticating user for moderation");
      const authContext = await auth.protect();
      console.log("User authenticated for moderation:", authContext.userId);

      console.log("Initializing Clerk toolkit");
      const toolkit = await createClerkToolkit({ authContext });
      console.log("Clerk toolkit initialized successfully");

      console.log("Generating AI moderation response");
      const result = await generateText({
        model: google("gemini-2.0-flash-001"),
        messages: messages as CoreMessage[],
        // Conditionally inject session claims if we have auth context
        system: toolkit.injectSessionClaims(systemPrompt),
        tools: {
          ...toolkit.users(),
          censorPost,
          reportUser,
        },
      });

      console.log("AI moderation completed successfully", result.text);
    } catch (error) {
      console.error("Error in content moderation:", error);
      // Don't fail the whole post creation if moderation fails
      console.log("Continuing without content moderation");
    }

    //   ---- END MOD STEP ----

    console.log("Post creation process completed successfully", post);

    return { post };
  } catch (error) {
    console.error("Error creating post:", error);
    return { error: "Failed to create post" };
  }
}
