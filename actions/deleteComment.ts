"use server";

import { adminClient } from "@/sanity/adminClient";
import { getCommentById } from "@/sanity/lib/comment/getCommentById";
import { currentUser } from "@clerk/nextjs/server";

export const deleteComment = async (commentId: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "User not found" };
  }

  const comment = await getCommentById(commentId);
  if (!comment) {
    return { error: "Comment not found" };
  }

  if (comment.author?._id !== user?.id) {
    return { error: "You are not authorized to delete this comment" };
  }

  const patch = adminClient.patch(commentId);

  // Delete content
  patch.set({ content: "[DELETED]" });

  // Set comment to deleted
  patch.set({ isDeleted: true });

  // Commit changes
  await patch.commit();

  // Return success message
  return { success: "Comment deleted successfully" };
};
