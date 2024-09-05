import { z } from "zod";
import { ChartSchema } from "./ChartModel";


export const ChordSchema = z.object({
  id: z.number().int({ message: "ID must be an integer" }),
  chordName: z.string().min(1, { message: "Chord name is required" }),  
  difficulty: z.number({ message: "please choose a valid chord!" }).nullable(),
  chartAudioFilePath: z.string().nullable().optional(),
});

export type ChordModel = z.infer<typeof ChordSchema>;

export const ChordEditSchema = ChordSchema.extend({
  chartAudioUpload: z
  .instanceof(File, {
    message: "Choose correct audio file type",
  })
  .nullable()
  .optional(),
});

export type ChordEditModel = z.infer<typeof ChordEditSchema>;

const chordNameRegex =
      /^([A-G])(#|b|##|bb)?(m|maj|min|dim|aug|M7|maj7|m7|7|sus2|sus4|add\d+|6|9|11|13|dim7|m6|m9|m11|m13|maj9|maj11|maj13)?(\/[A-G](#|b)?)?$/;
      

export const ChordCreateSchema = ChordEditSchema.extend({
  chordDifficulty: z.number({ message: "please choose a valid chord!" }).nullable(),
  chordName: z.string()
  .min(1, { message: "Chord name is required" })
  .regex(chordNameRegex, {message:"Invalid Chord!"}),
}).omit({ id: true });

export type ChordCreateModel = z.infer<typeof ChordCreateSchema>;

export const ChordWithChartsSchema = ChordSchema.extend({
  /* charts: z.array(ChartSchema).nullable().optional(), */
  charts: z.any(),
});


export type ChordWithChartsModel = z.infer<typeof ChordWithChartsSchema>;