import { z } from "zod";
import { SegmentSchema } from "./SegmentModel";
import { ApiResponseWrapper } from "./SchemaUtils";
import { BaseEntitySchema } from "./BaseEntity";

export const SongSectionEnum = z.enum(["Verse", "Chorus", "Bridge"]);

export const LineSchema = z
	.object({
		id: z.string().nullable().optional(),
		lyricLineOrder: z.number(),
		partName: SongSectionEnum,
		partNumber: z.number().int().nullable().optional(),
		repeatCount: z.number().int().nullable().optional(),
		verseId: z.string().nullable().optional(),
		chorusId: z.string().nullable().optional(),
		bridgeId: z.string().nullable().optional(),
		lyricSegments: z.array(SegmentSchema).nullable().optional(),
	})
	.merge(BaseEntitySchema);

const partNameNumberToString = (val: number | string) => {
	if (val === 1 || val === "1") return "Verse";
	if (val === 2 || val === "2") return "Chorus";
	if (val === 3 || val === "3") return "Bridge";
	return val; // fallback
};

// For API responses with nested structure
export const LineApiSchema = LineSchema.extend({
	partName: z.union([z.number(), z.string()]).transform(partNameNumberToString),
	// Using passthrough for lyricSegments to avoid validation errors
	lyricSegments: ApiResponseWrapper(z.any()).nullable().optional(),
});

export type LineModel = z.infer<typeof LineSchema>;
export type LineApiModel = z.infer<typeof LineApiSchema>;

// For backward compatibility if needed
export interface LegacyLineModel extends z.infer<typeof LineSchema> {
	lineLyrics: string;
}
