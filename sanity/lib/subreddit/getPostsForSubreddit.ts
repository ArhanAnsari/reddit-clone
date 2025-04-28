import { sanityFetch } from "../live";
import { defineQuery } from "groq";

/**
 * Fetches posts for a specific subreddit by its slug
 * Returns posts with vote counts, author details, and comment counts
 */
export async function getPostsForSubreddit(id: string) {
  const getPostsForSubredditQuery = defineQuery(`
    *[_type == "post" && subreddit._ref == $id] {
      ...,
      "slug": slug.current,
      "author": author->,
      "subreddit": subreddit->,
      "category": category->,
      "upvotes": count(*[_type == "vote" && post._ref == ^._id && voteType == "upvote"]),
      "downvotes": count(*[_type == "vote" && post._ref == ^._id && voteType == "downvote"]),
      "netScore": count(*[_type == "vote" && post._ref == ^._id && voteType == "upvote"]) - count(*[_type == "vote" && post._ref == ^._id && voteType == "downvote"]),
      "commentCount": count(*[_type == "comment" && post._ref == ^._id])
    } | order(publishedAt desc) 
  `);

  const result = await sanityFetch({
    query: getPostsForSubredditQuery,
    params: { id },
  });

  return result.data;
}
