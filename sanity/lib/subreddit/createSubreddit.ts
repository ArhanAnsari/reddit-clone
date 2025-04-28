import { adminClient } from "../../adminClient";
import { defineQuery } from "groq";
import { sanityFetch } from "../live";
import { Subreddit } from "@/sanity.types";

// Define the image data type
interface ImageData {
  base64: string;
  filename: string;
  contentType: string;
}

export async function createSubreddit(
  name: string,
  moderatorId: string,
  imageData: ImageData | null,
  customSlug?: string,
  customDescription?: string
) {
  console.log(`Creating subreddit: ${name} with moderator: ${moderatorId}`);

  try {
    // Check if subreddit with this name already exists
    const checkExistingQuery = defineQuery(`
      *[_type == "subreddit" && title == $name][0] {
        _id
      }
    `);

    const existingSubreddit = await sanityFetch({
      query: checkExistingQuery,
      params: { name },
    });

    if (existingSubreddit.data) {
      console.log(`Subreddit "${name}" already exists`);
      return { error: "A subreddit with this name already exists" };
    }

    // Check if slug already exists if custom slug is provided
    if (customSlug) {
      const checkSlugQuery = defineQuery(`
        *[_type == "subreddit" && slug.current == $slug][0] {
          _id
        }
      `);

      const existingSlug = await sanityFetch({
        query: checkSlugQuery,
        params: { slug: customSlug },
      });

      if (existingSlug.data) {
        console.log(`Subreddit with slug "${customSlug}" already exists`);
        return { error: "A subreddit with this URL already exists" };
      }
    }

    // Create slug from name or use custom slug
    const slug = customSlug || name.toLowerCase().replace(/\s+/g, "-");

    // Upload image if provided
    let imageAsset;
    if (imageData) {
      try {
        // Extract base64 data (remove data:image/jpeg;base64, part)
        const base64Data = imageData.base64.split(",")[1];

        // Convert base64 to buffer
        const buffer = Buffer.from(base64Data, "base64");

        // Upload to Sanity
        imageAsset = await adminClient.assets.upload("image", buffer, {
          filename: imageData.filename,
          contentType: imageData.contentType,
        });

        console.log("Image asset:", imageAsset);
      } catch (error) {
        console.error("Error uploading image:", error);
        // Continue without image if upload fails
      }
    }

    // Create the subreddit
    const subredditDoc: Partial<Subreddit> = {
      _type: "subreddit",
      title: name,
      description: customDescription || `Welcome to r/${name}!`,
      slug: {
        current: slug,
        _type: "slug",
      },
      moderator: {
        _type: "reference",
        _ref: moderatorId,
      },
      createdAt: new Date().toISOString(),
    };

    // Add image if available
    if (imageAsset) {
      subredditDoc.image = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: imageAsset._id,
        },
      };
    }

    const subreddit = await adminClient.create(subredditDoc as Subreddit);
    console.log(`Subreddit created successfully with ID: ${subreddit._id}`);

    return { subreddit };
  } catch (error) {
    console.error("Error creating subreddit:", error);
    return { error: "Failed to create subreddit" };
  }
}
