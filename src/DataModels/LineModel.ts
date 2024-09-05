import { z } from "zod";

export const LineSchema = z.object({
    lyricLineOrder: z.number(),
    verseId: z.number(),        
})

type Line = z.infer<typeof LineSchema>;

export interface LineModel extends Line{
    lineLyrics: string
}