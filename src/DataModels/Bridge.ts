import { z } from "zod";
import { LineSchema } from "./LineModel";
import { BaseEntitySchema } from "./BaseEntity";

export const BridgeSchema = z
	.object({
		id: z.string().nullable().optional(),
		songId: z.string(),
		bridgeNumber: z.number().int().nullable().optional(),
		bridgeTitle: z.string().nullable().optional(),
		repeatCount: z.number().int().nullable().optional(),
		lyricLines: z.array(LineSchema).nullable().optional(),
	})
	.merge(BaseEntitySchema);

export type Bridge = z.infer<typeof BridgeSchema>;
