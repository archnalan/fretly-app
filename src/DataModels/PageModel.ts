import { z } from "zod";

export const PageSchema = z.object({
  id: z.number(),
  title: z.string().min(1, {message: "Page title is required!"}),
  slug: z.string().nullable(), 
  content: z.string().min(1, {message: "what is the page about?"}),
  sorting: z.number(),
});

export type PageModel = z.infer<typeof PageSchema>;

export const PageCreateSchema = PageSchema.omit({id:true, slug: true, sorting: true});

export type PageCreateModel = z.infer<typeof PageCreateSchema>;
