import { z } from "zod";
import { VerseSchema, VerseApiSchema } from "./VerseModel";
import { PlayLevelEnum } from "./PlayLevelEnum";
import { BridgeSchema } from "./Bridge";
import { ChorusSchema } from "./Chorus";
import { FeedbackSchema } from "./Feedback";
import { BaseEntitySchema } from "./BaseEntity";
import { ApiResponseWrapper } from "./SchemaUtils";

export const SongSchema = z
	.object({
		id: z.string().optional(),
		title: z
			.string()
			.min(1, { message: "Please enter a title." })
			.max(100, { message: "Title cannot exceed 100 characters" }),
		songNumber: z
			.number({ message: "Please enter a number!" })
			.positive({ message: "A positive number is required!" })
			.nullable()
			.optional(),
		slug: z
			.string()
			.max(200, { message: "Slug cannot exceed 200 characters" })
			.nullable()
			.optional(),
		songPlayLevel: PlayLevelEnum,
		textUpload: z.any().nullable().optional(), // Corresponds to IFormFile
		textFilePath: z
			.string()
			.max(255, { message: "File path cannot exceed 255 characters" })
			.nullable()
			.optional(),
		writtenDateRange: z
			.string()
			.max(100, { message: "Date range cannot exceed 100 characters" })
			.nullable()
			.optional(),
		writtenBy: z
			.string()
			.max(100, { message: "Writer name cannot exceed 100 characters" })
			.nullable()
			.optional(),
		history: z
			.string()
			.max(255, { message: "History cannot exceed 255 characters" })
			.nullable()
			.optional(),
		addedBy: z
			.string()
			.max(200, { message: "AddedBy cannot exceed 200 characters" })
			.nullable()
			.optional(),
		categoryId: z.string().nullable().optional(),
		verses: z.array(VerseSchema).nullable().optional(),
		bridges: z.array(BridgeSchema).nullable().optional(),
		choruses: z.array(ChorusSchema).nullable().optional(),
		feedback: z.array(FeedbackSchema).nullable().optional(),
	})
	.merge(BaseEntitySchema);

export type SongModel = z.infer<typeof SongSchema>;

// API response format for verses, bridges, choruses
export const SongApiSchema = SongSchema.extend({
	verses: ApiResponseWrapper(VerseApiSchema).nullable().optional(),
	bridges: ApiResponseWrapper(BridgeSchema).nullable().optional(),
	choruses: ApiResponseWrapper(ChorusSchema).nullable().optional(),
});

export type SongApiModel = z.infer<typeof SongApiSchema>;

// Legacy compatibility schemas for songs with category information
export const SongWithCategorySchema = SongSchema.extend({
	categoryName: z.string().nullable().optional(),
});

export type SongWithCategory = z.infer<typeof SongWithCategorySchema>;

// Schema for creating new songs with optional category information
export const SongCreateSchema = SongWithCategorySchema.extend({
	id: z.string().optional(),
});

export type SongCreateModel = z.infer<typeof SongCreateSchema>;
