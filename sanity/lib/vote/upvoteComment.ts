import { sanityFetch } from "../live";
import { adminClient } from "../../adminClient";
import { defineQuery } from "groq";

// Function to upvote a comment
export async function upvoteComment(commentId: string, userId: string) {
  // Check if user has already voted on this comment
  const existingVoteUpvoteCommentQuery = defineQuery(
    `*[_type == "vote" && comment._ref == $commentId && user._ref == $userId][0]`
  );
  const existingVote = await sanityFetch({
    query: existingVoteUpvoteCommentQuery,
    params: { commentId, userId },
  });

  if (existingVote.data) {
    const vote = existingVote.data;

    // If there's already an upvote, remove it (toggle off)
    if (vote.voteType === "upvote") {
      return await adminClient.delete(vote._id);
    }

    // If there's a downvote, change it to an upvote
    if (vote.voteType === "downvote") {
      return await adminClient
        .patch(vote._id)
        .set({ voteType: "upvote" })
        .commit();
    }
  }

  // Create a new upvote
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
    voteType: "upvote",
    createdAt: new Date().toISOString(),
  });
}

// Function to check if a user has upvoted a specific comment
export async function hasUserUpvotedComment(commentId: string, userId: string) {
  const hasUserUpvotedCommentQuery = defineQuery(
    `count(*[_type == "vote" && comment._ref == $commentId && user._ref == $userId && voteType == "upvote"]) > 0`
  );

  const result = await sanityFetch({
    query: hasUserUpvotedCommentQuery,
    params: { commentId, userId },
  });

  return result.data;
}

// Utility function to get vote count for a comment
export async function getCommentVoteCount(commentId: string) {
  const getCommentVoteCountQuery = defineQuery(`
    {
      "upvotes": count(*[_type == "vote" && comment._ref == $commentId && voteType == "upvote"]),
      "downvotes": count(*[_type == "vote" && comment._ref == $commentId && voteType == "downvote"])
    }
  `);

  const result = await sanityFetch({
    query: getCommentVoteCountQuery,
    params: { commentId },
  });

  const { upvotes, downvotes } = result.data;
  return upvotes - downvotes; // Net vote count
}
