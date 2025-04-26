import { z } from "zod";
import { LineSchema } from "./LineModel";
import { BaseEntitySchema } from "./BaseEntity";

export const ChorusSchema = z
	.object({
		id: z.string().nullable().optional(),
		songId: z.string(),
		chorusNumber: z.number().int().nullable().optional(),
		chorusTitle: z.string().nullable().optional(),
		repeatCount: z.number().int().nullable().optional(),
		lyricLines: z.array(LineSchema).nullable().optional(),
	})
	.merge(BaseEntitySchema);

export type Chorus = z.infer<typeof ChorusSchema>;
