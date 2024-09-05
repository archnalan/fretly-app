import { z } from "zod";

export const ChartSchema = z.object({
    id: z.number(),
    filePath: z.string({ message: "File path is required" }),
    chordId: z.number({message:"please choose a valid chord!"}).nullable(),
    fretPosition: z.number({message: "Fret Position must be an integer"})
        .int("Fret Position must be an integer")
        .min(1, {message:"Fret Position must be at least 1"})
        .max(24, "Fret Position must be at most 24"),
    chartAudioFilePath: z.string().nullable().optional(),
    positionDescription: z.string().max(100).nullable().optional(),
})

export type ChartModel = z.infer<typeof ChartSchema>;


export const ChartEditSchema = ChartSchema.extend({
    chartUpload: z.instanceof(File).nullable().optional(), 
    chartAudioUpload: z.instanceof(File).nullable().optional(),
    filePath: z.string().nullable().optional(),  
});

export type ChartEditModel = z.infer<typeof ChartEditSchema>;

export const ChartCreateSchema = ChartEditSchema.extend({ 
    chartUpload: z.instanceof(File, {        
        message:"Chord chart file is required"
    }).nullable(),// null temporarilly
    filePath: z.string({ message: "File path is required" }),
}).omit({id:true});

export type ChartCreateModel = z.infer<typeof ChartCreateSchema>;

export const ChartsSchema = z.object({
  $id: z.string(),
  $values: z.array(ChartSchema),
});

export type ChartsModel = z.infer<typeof ChartsSchema>;

