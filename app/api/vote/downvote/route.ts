import { NextRequest, NextResponse } from "next/server";
import { downvotePost, downvoteComment } from "@/sanity/lib/vote/downvote";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = user.id;

    // Get form data
    const formData = await request.formData();
    const postId = formData.get("postId") as string;
    const commentId = formData.get("commentId") as string;

    // Make sure we have either postId or commentId
    if (!postId && !commentId) {
      return NextResponse.json(
        { error: "Either postId or commentId is required" },
        { status: 400 }
      );
    }

    // Handle downvoting
    if (postId) {
      await downvotePost(postId, userId);
    } else if (commentId) {
      await downvoteComment(commentId, userId);
    }

    // Get the URL to redirect back to
    const referer = request.headers.get("referer") || "/";

    return NextResponse.redirect(referer, { status: 303 });
  } catch (error) {
    console.error("Error downvoting:", error);
    return NextResponse.json({ error: "Failed to downvote" }, { status: 500 });
  }
}
