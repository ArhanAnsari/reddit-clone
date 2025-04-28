import { sanityFetch } from "../live";
import { defineQuery } from "groq";

// Get post votes summarized by type
export async function getPostVotes(postId: string) {
  const getPostVotesQuery = defineQuery(`
    {
      "upvotes": count(*[_type == "vote" && post._ref == $postId && voteType == "upvote"]),
      "downvotes": count(*[_type == "vote" && post._ref == $postId && voteType == "downvote"]),
      "netScore": count(*[_type == "vote" && post._ref == $postId && voteType == "upvote"]) - count(*[_type == "vote" && post._ref == $postId && voteType == "downvote"])
    }
  `);

  const result = await sanityFetch({
    query: getPostVotesQuery,
    params: { postId },
  });

  return result.data;
}

// Get comment votes summarized by type
export async function getCommentVotes(commentId: string) {
  const getCommentVotesQuery = defineQuery(`
    {
      "upvotes": count(*[_type == "vote" && comment._ref == $commentId && voteType == "upvote"]),
      "downvotes": count(*[_type == "vote" && comment._ref == $commentId && voteType == "downvote"]),
      "netScore": count(*[_type == "vote" && comment._ref == $commentId && voteType == "upvote"]) - count(*[_type == "vote" && comment._ref == $commentId && voteType == "downvote"])
    }
  `);

  const result = await sanityFetch({
    query: getCommentVotesQuery,
    params: { commentId },
  });

  return result.data;
}

// Get user vote status for a post
export async function getUserPostVoteStatus(
  postId: string,
  userId: string | null
) {
  const getUserPostVoteStatusQuery = defineQuery(
    `*[_type == "vote" && post._ref == $postId && user._ref == $userId][0].voteType`
  );

  const result = await sanityFetch({
    query: getUserPostVoteStatusQuery,
    params: { postId, userId: userId || "" },
  });

  // Returns "upvote", "downvote", or null if no vote
  return result.data;
}

// Get top voted posts within a subreddit
export async function getTopPostsBySubreddit(subredditId: string, limit = 10) {
  const getTopPostsBySubredditQuery = defineQuery(`
    *[_type == "post" && subreddit._ref == $subredditId] {
      _id,
      title,
      "slug": slug.current,
      "author": author->,
      "subreddit": subreddit->,
      publishedAt,
      "upvotes": count(*[_type == "vote" && post._ref == ^._id && voteType == "upvote"]),
      "downvotes": count(*[_type == "vote" && post._ref == ^._id && voteType == "downvote"]),
      "commentCount": count(*[_type == "comment" && post._ref == ^._id])
    } | order((upvotes - downvotes) desc) [0...$limit]
  `);

  const result = await sanityFetch({
    query: getTopPostsBySubredditQuery,
    params: { subredditId, limit },
  });

  return result.data;
}

// Get top voted comments for a post
export async function getTopCommentsByPost(postId: string, limit = 10) {
  const getTopCommentsByPostQuery = defineQuery(`
    *[_type == "comment" && post._ref == $postId] {
      _id,
      content,
      "author": author->,
      createdAt,
      "upvotes": count(*[_type == "vote" && comment._ref == ^._id && voteType == "upvote"]),
      "downvotes": count(*[_type == "vote" && comment._ref == ^._id && voteType == "downvote"]),
      "replyCount": count(*[_type == "comment" && parentComment._ref == ^._id])
    } | order((upvotes - downvotes) desc) [0...$limit]
  `);

  const result = await sanityFetch({
    query: getTopCommentsByPostQuery,
    params: { postId, limit },
  });

  return result.data;
}

// Get controversial posts (highest total vote count but close to zero net score)
export async function getControversialPosts(limit = 10) {
  const getControversialPostsQuery = defineQuery(`
    *[_type == "post"] {
      _id,
      title,
      "slug": slug.current,
      "author": author->,
      "subreddit": subreddit->,
      publishedAt,
      "upvotes": count(*[_type == "vote" && post._ref == ^._id && voteType == "upvote"]),
      "downvotes": count(*[_type == "vote" && post._ref == ^._id && voteType == "downvote"]),
      "totalVotes": count(*[_type == "vote" && post._ref == ^._id]),
      "netScore": count(*[_type == "vote" && post._ref == ^._id && voteType == "upvote"]) - count(*[_type == "vote" && post._ref == ^._id && voteType == "downvote"]),
      "commentCount": count(*[_type == "comment" && post._ref == ^._id])
    }
    // Get posts with high vote count but score close to zero
    | order(totalVotes desc) [0...$limit]
    // // Further sort to prioritize posts where the score is close to zero
    // | order(abs(netScore) asc)
  `);

  const result = await sanityFetch({
    query: getControversialPostsQuery,
    params: { limit },
  });

  return result.data;
}
