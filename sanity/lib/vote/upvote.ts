import { sanityFetch } from "../live";
import { adminClient } from "../../adminClient";
import { defineQuery } from "groq";

// Fetch all posts (for reference)
export async function getPosts() {
  const getAllPostsUpvotesQuery = defineQuery(`*[_type == "post"] {
    _id,
    title,
    "slug": slug.current,
    body,
    publishedAt,
    "author": author->
    ,
    "subreddit": subreddit->,
    "category": category->,
    image
  }`);

  const posts = await sanityFetch({ query: getAllPostsUpvotesQuery });
  return posts.data;
}

// Function to upvote a post
export async function upvotePost(postId: string, userId: string) {
  // Check if user has already voted on this post
  const existingVoteUpvoteQuery = defineQuery(
    `*[_type == "vote" && post._ref == $postId && user._ref == $userId][0]`
  );
  const existingVote = await sanityFetch({
    query: existingVoteUpvoteQuery,
    params: { postId, userId },
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
    post: {
      _type: "reference",
      _ref: postId,
    },
    user: {
      _type: "reference",
      _ref: userId,
    },
    voteType: "upvote",
    createdAt: new Date().toISOString(),
  });
}

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

// Utility function to get vote count for a post
export async function getPostVoteCount(postId: string) {
  const getPostVoteCountQuery = defineQuery(`
    {
      "upvotes": count(*[_type == "vote" && post._ref == $postId && voteType == "upvote"]),
      "downvotes": count(*[_type == "vote" && post._ref == $postId && voteType == "downvote"])
    }
  `);

  const result = await sanityFetch({
    query: getPostVoteCountQuery,
    params: { postId },
  });

  const { upvotes, downvotes } = result.data;
  return upvotes - downvotes; // Net vote count
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

// Function to check if a user has upvoted a specific post
export async function hasUserUpvotedPost(postId: string, userId: string) {
  const hasUserUpvotedPostQuery = defineQuery(
    `count(*[_type == "vote" && post._ref == $postId && user._ref == $userId && voteType == "upvote"]) > 0`
  );

  const result = await sanityFetch({
    query: hasUserUpvotedPostQuery,
    params: { postId, userId },
  });

  return result.data;
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
