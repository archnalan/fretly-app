import { z } from "zod";

// Common wrapper for API responses with $id/$values structure
export const ApiResponseWrapper = <T extends z.ZodTypeAny>(schema: T) =>
	z.object({
		$id: z.string().optional(),
		$values: z.array(schema),
	});
