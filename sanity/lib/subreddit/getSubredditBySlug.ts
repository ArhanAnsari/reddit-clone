import { sanityFetch } from "../live";
import { defineQuery } from "groq";

export async function getSubredditBySlug(slug: string) {
  const getSubredditBySlugQuery =
    defineQuery(`*[_type == "subreddit" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    image,
    "moderator": moderator->,
    createdAt
  }`);

  const subreddit = await sanityFetch({
    query: getSubredditBySlugQuery,
    params: { slug: slug.toLowerCase() },
  });

  return subreddit.data;
}
