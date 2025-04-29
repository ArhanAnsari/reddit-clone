import { sanityFetch } from "../live";
import { defineQuery } from "groq";

type SortOption = 'popular' | 'hot' | 'new' | 'top' | 'rising';

export async function getPosts(sort: SortOption = 'new') {
  const sortQuery = {
    new: 'publishedAt desc',
    hot: 'upvotes desc, publishedAt desc',
    popular: 'upvotes desc, publishedAt desc',
    top: 'upvotes desc',
    rising: 'upvotes asc, publishedAt desc'
  }[sort];

  const getAllPostsQuery =
    defineQuery(`*[_type == "post" && isDeleted != false] {
    _id,
    title,
    "slug": slug.current,
    body,
    publishedAt,
    upvotes,
    "author": author->
    ,
    "subreddit": subreddit->,
    image,
    isDeleted
  } | order(${sortQuery})`);

  const posts = await sanityFetch({ query: getAllPostsQuery });
  return posts.data;
}
