import { type SchemaTypeDefinition } from "sanity";
import { postType } from "./postType";
import { subredditType } from "./subredditType";
import { userType } from "./userType";
import { commentType } from "./commentType";
import { voteType } from "./voteType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [postType, subredditType, userType, commentType, voteType],
};
