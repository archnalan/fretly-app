import { z } from "zod";

export const SegmentSchema = z.object({
    lyric: z.string(),
    lyricOrder: z.number(),
    lyricLineId: z.number(),
    chordId: z.number().nullable(), 
})

export type SegmentModel = z.infer<typeof SegmentSchema>;
