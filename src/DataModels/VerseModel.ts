import { z } from "zod";

export const VerseSchema = z.object({
    hymnId: z.number(),     
    number: z.number(),
})

type verse = z.infer<typeof VerseSchema>;

export interface VerseModel extends verse{
    lyrics: string,  
}