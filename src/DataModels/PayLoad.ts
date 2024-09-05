import { z } from "zod";
import { ChordSchema } from "./ChordModel";
import { VerseSchema } from "./VerseModel";
import { LineSchema } from "./LineModel";
import { SegmentSchema } from "./SegmentModel";

export const PayLoadSchema = z.object({
    verseCreate: VerseSchema,
    linesCreate: z.array(LineSchema),
    segmentsCreate: z.array(SegmentSchema),
    chordsCreate: z.array(ChordSchema),
})