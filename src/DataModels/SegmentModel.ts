import { z } from "zod";
import { ChordSchema, ChordApiSchema } from "./ChordModel";
import { BaseEntitySchema } from "./BaseEntity";

export const SegmentSchema = z
	.object({
		id: z.string().optional(),
		lyric: z
			.string()
			.max(200, { message: "Lyric cannot exceed 200 characters" }),
		lyricOrder: z.number().nonnegative(),
		lineNumber: z.number().int(),
		lyricUpload: z.any().optional(), // Corresponds to IFormFile in C#
		lyricFilePath: z
			.string()
			.max(255, { message: "File path cannot exceed 255 characters" })
			.nullable()
			.optional(),
		chordId: z.union([z.string(), z.number()]).nullable().optional(),
		lyricLineId: z.string().nullable().optional(),
		chord: ChordSchema.nullable().optional(),
	})
	.merge(BaseEntitySchema);

// API-specific schema for handling chords from API responses
export const SegmentApiSchema = SegmentSchema.extend({
	chord: ChordApiSchema.nullable().optional(),
});

export type SegmentModel = z.infer<typeof SegmentSchema>;
export type SegmentApiModel = z.infer<typeof SegmentApiSchema>;
