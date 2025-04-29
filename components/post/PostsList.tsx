import { getPosts } from "@/sanity/lib/post/getAllPosts";
import Post from "./Post";
import { currentUser } from "@clerk/nextjs/server";

interface PostsListProps {
  sort?: 'popular' | 'hot' | 'new' | 'top' | 'rising';
}

async function PostsList({ sort = 'new' }: PostsListProps) {
  const posts = await getPosts(sort);
  const user = await currentUser();

  return (
    <div className="space-y-4">
      {posts.map((post: any) => (
        <Post key={post._id} post={post} userId={user?.id ?? null} />
      ))}
    </div>
  );
}

export default PostsList;
