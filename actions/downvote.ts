"use server";

import { downvotePost } from "@/sanity/lib/vote/downvote";
import { downvoteComment } from "@/sanity/lib/vote/downvoteComment";
import { getUser } from "@/sanity/lib/user/getUser";

export async function downvote(
  contentId: string,
  contentType: "post" | "comment" = "post"
) {
  const user = await getUser();

  if ("error" in user) {
    return { error: user.error };
  }

  if (contentType === "comment") {
    const vote = await downvoteComment(contentId, user._id);
    return { vote };
  } else {
    const vote = await downvotePost(contentId, user._id);
    return { vote };
  }
}
