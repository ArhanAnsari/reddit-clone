import { defineField, defineType } from "sanity";
import { TagIcon } from "lucide-react";

export const subredditType = defineType({
  name: "subreddit",
  title: "Subreddit",
  type: "document",
  icon: TagIcon,
  description: "A community where users can post and engage with content",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Name of the subreddit",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "A brief description of what this subreddit is about",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "The unique URL-friendly identifier for this subreddit",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description: "Icon or banner image for the subreddit",
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
          description: "Alternative text for screen readers and SEO",
        },
      ],
    }),
    defineField({
      name: "moderator",
      title: "Moderator",
      type: "reference",
      description:
        "The user who created this subreddit and has admin privileges",
      to: [{ type: "user" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      description: "When this subreddit was created",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
    },
  },
});
