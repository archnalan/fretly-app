import { z } from "zod";
import { CategorySchema } from "./CategoryModel";

export const SongBookSchema = z.object({
  id: z.number(),
  title: z.string().min(1, {message: "title is required!"}).max(50),
  slug: z.string().max(50).optional(),
  subTitle: z.string().max(255).optional(),
  description: z.string(),
  publisher: z.string().max(255),
  publicationDate: z.string().min(1, {message: "Date is required"}),
  isbn: z.string().refine(value => value.length >= 10 && value.length <= 13 && parseInt(value, 10), {
    message: "ISBN must be 10 to 13 long number",
  }),
  author: z.string().max(255).optional(),
  edition: z.string().max(50).optional(),
  language: z.string().max(50),
  addedBy: z.string().optional(),
  addedTime: z.string()/* .transform((str) => new Date(str)) */,
});

export type SongBookModel = z.infer<typeof SongBookSchema>;

export const BookWithCategorySchema = SongBookSchema.extend({
    categories: z.array(CategorySchema),
})

export type BookWithCategory = z.infer<typeof BookWithCategorySchema>;

export const BookCreateSchema = SongBookSchema.omit({id: true});

export type SongBookCreateModel = z.infer<typeof BookCreateSchema>;