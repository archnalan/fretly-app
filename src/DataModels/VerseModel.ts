import { z } from "zod";
import { LineSchema, LineApiSchema } from "./LineModel";
import { ApiResponseWrapper } from "./SchemaUtils";
import { BaseEntitySchema } from "./BaseEntity";

export const VerseSchema = z
	.object({
		id: z.string().nullable().optional(),
		songId: z.string(),
		verseNumber: z
			.number()
			.int()
			.min(0)
			.max(24, { message: "Verse number must be between 0 and 24" }),
		verseTitle: z
			.string()
			.max(100, { message: "Verse title cannot exceed 100 characters" })
			.nullable()
			.optional(),
		repeatCount: z.number().int().nullable().optional(),
		lyricLines: z.array(LineSchema).nullable().optional(),
	})
	.merge(BaseEntitySchema);

// For API responses with nested structure
export const VerseApiSchema = VerseSchema.extend({
	lyricLines: ApiResponseWrapper(LineApiSchema).nullable().optional(),
});

export type VerseModel = z.infer<typeof VerseSchema>;
export type VerseApiModel = z.infer<typeof VerseApiSchema>;

export interface LegacyVerseModel {
	hymnId: number;
	number: number;
	lyrics: string;
}
