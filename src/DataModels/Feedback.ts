import { z } from "zod";
import { BaseEntitySchema } from "./BaseEntity";

export const FeedbackSchema = z
	.object({
		id: z.string(),
		songId: z.string(),
		userId: z.string(),
		comment: z.string(),
		rating: z.number().nullable().optional(),
	})
	.merge(BaseEntitySchema)
	.nullable()
	.optional();

export type Feedback = z.infer<typeof FeedbackSchema>;
