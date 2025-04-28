"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createComment } from "@/actions/createComment";
import { useUser } from "@clerk/nextjs";

function CommentInput({
  postId,
  parentCommentId,
}: {
  postId: string;
  parentCommentId?: string;
}) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!content.trim()) return;

    startTransition(async () => {
      try {
        const result = await createComment(postId, content, parentCommentId);

        if (result.error) {
          console.error("Error adding comment:", result.error);
        } else {
          // Clear input after successful submission
          setContent("");
          // Refresh the page to show the new comment
          router.refresh();
        }
      } catch (error) {
        console.error("Failed to add comment:", error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        type="text"
        placeholder={user ? "Add a comment..." : "Sign in to comment"}
        disabled={isPending || !user}
      />
      <Button type="submit" variant="outline" disabled={isPending || !user}>
        {isPending ? "Commenting..." : "Comment"}
      </Button>
    </form>
  );
}

export default CommentInput;
