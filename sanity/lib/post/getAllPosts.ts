import { sanityFetch } from "../live";
import { defineQuery } from "groq";

export async function getPosts() {
  const getAllPostsQuery =
    defineQuery(`*[_type == "post" && isDeleted != false] {
    _id,
    title,
    "slug": slug.current,
    body,
    publishedAt,
    "author": author->
    ,
    "subreddit": subreddit->,
    image,
    isDeleted
  } | order(publishedAt desc)`);

  const posts = await sanityFetch({ query: getAllPostsQuery });
  return posts.data;
}
