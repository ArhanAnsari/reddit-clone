import { sanityFetch } from "../live";
import { defineQuery } from "groq";

export async function getSubreddits() {
  const getSubredditsQuery = defineQuery(`*[_type == "subreddit"] {
    _id,
    title,
    "slug": slug.current,
    description,
    image,
    "moderator": moderator->,
    createdAt
  } | order(createdAt desc)`);

  const subreddits = await sanityFetch({ query: getSubredditsQuery });
  return subreddits.data;
}

export async function getSubredditBySlug(slug: string) {
  const getSubredditBySlugQuery =
    defineQuery(`*[_type == "subreddit" && slug.current == $slug][0] {
    ...,
    "slug": slug.current,
    "moderator": moderator->,
  }`);

  const subreddit = await sanityFetch({
    query: getSubredditBySlugQuery,
    params: { slug },
  });

  return subreddit.data;
}
