"use server";

import { getUser } from "@/sanity/lib/user/getUser";
import { upvotePost } from "@/sanity/lib/vote/upvote";
import { upvoteComment } from "@/sanity/lib/vote/upvoteComment";

export async function upvote(
  contentId: string,
  contentType: "post" | "comment" = "post"
) {
  const user = await getUser();

  if ("error" in user) {
    return { error: user.error };
  }

  if (contentType === "comment") {
    const vote = await upvoteComment(contentId, user._id);
    return { vote };
  } else {
    const vote = await upvotePost(contentId, user._id);
    return { vote };
  }
}
