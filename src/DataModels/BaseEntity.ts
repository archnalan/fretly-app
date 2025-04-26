import { z } from "zod";

export const BaseEntitySchema = z.object({
	dateCreated: z.string().nullable().optional(),
	dateModified: z.string().nullable().optional(),
	isDeleted: z.boolean().nullable().optional(),
	modifiedBy: z.string().nullable().optional(),
	tenantId: z.string().nullable().optional(),
});

export type BaseEntity = z.infer<typeof BaseEntitySchema>;
