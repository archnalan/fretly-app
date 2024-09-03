import { z } from "zod";

export const CategorySchema = z.object({
  id: z.number().int({ message: "id must be a positive number" }),
  name: z.string().min(1, { message: "category name is required!" }).max(100),
  sorting: z
    .number()
    .int({ message: "Sorting order must be a positive number" })
    .nullable()
    .optional(),
  parentCategoryId: z.number().nullable(),
  categorySlug: z.string().max(255).optional(),
});

export type CategoryModel = z.infer<typeof CategorySchema>;
