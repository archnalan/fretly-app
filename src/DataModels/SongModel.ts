import { z } from "zod";

export  const SongSchema = z.object ({
    id: z.number(),
    number: z.number({message:"Please enter a number!"}).positive({message:"A positive number is required!"}),
    title: z.string().min(1, {message: "Please enter a title."}),
    slug: z.string().optional(),
    writtenDateRange: z.string({message:"Invalid Date Range!"}).nullable().optional(),
    writtenBy: z.string().optional(),
    history: z.string().optional(),
    addedBy: z.string().optional(),
    categoryId: z.number({message: "Invalid category!"}),  
})

export type SongModel = z.infer<typeof SongSchema>;

export const SongWithCategorySchema = SongSchema.extend({
    categoryName: z.string().optional(),
})

export type SongWithCategory = z.infer<typeof SongWithCategorySchema>;


export const SongCreateSchema = SongWithCategorySchema.omit({id: true});

export type SongCreateModel = z.infer<typeof SongCreateSchema>;

