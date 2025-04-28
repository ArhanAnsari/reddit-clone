import { sanityFetch } from "../live";
import { adminClient } from "../../adminClient";
import { defineQuery } from "groq";

// Function to downvote a comment
export async function downvoteComment(commentId: string, userId: string) {
  // Check if user has already voted on this comment
  const existingVoteDownvoteCommentQuery = defineQuery(
    `*[_type == "vote" && comment._ref == $commentId && user._ref == $userId][0]`
  );
  const existingVote = await sanityFetch({
    query: existingVoteDownvoteCommentQuery,
    params: { commentId, userId },
  });

  if (existingVote.data) {
    const vote = existingVote.data;

    // If there's already a downvote, remove it (toggle off)
    if (vote.voteType === "downvote") {
      return await adminClient.delete(vote._id);
    }

    // If there's an upvote, change it to a downvote
    if (vote.voteType === "upvote") {
      return await adminClient
        .patch(vote._id)
        .set({ voteType: "downvote" })
        .commit();
    }
  }

  // Create a new downvote
  return await adminClient.create({
    _type: "vote",
    comment: {
      _type: "reference",
      _ref: commentId,
    },
    user: {
      _type: "reference",
      _ref: userId,
    },
    voteType: "downvote",
    createdAt: new Date().toISOString(),
  });
}

// Function to check if a user has downvoted a specific comment
export async function hasUserDownvotedComment(
  commentId: string,
  userId: string
) {
  const hasUserDownvotedCommentQuery = defineQuery(
    `count(*[_type == "vote" && comment._ref == $commentId && user._ref == $userId && voteType == "downvote"]) > 0`
  );

  const result = await sanityFetch({
    query: hasUserDownvotedCommentQuery,
    params: { commentId, userId },
  });

  return result.data;
}
