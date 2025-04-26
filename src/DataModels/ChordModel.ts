import { z } from "zod";
import { ChartSchema } from "./ChartModel";
import { ChordType } from "./ChordType";
import { ChordDifficulty } from "./ChordDifficulty";
import { BaseEntitySchema } from "./BaseEntity";
import { ApiResponseWrapper } from "./SchemaUtils";

// Helper to handle string or enum names for ChordDifficulty
const difficultyTransformer = z
	.union([
		z.string().transform((val) => {
			if (val === "easy" || val === "Easy") return ChordDifficulty.Easy;
			if (val === "medium" || val === "Medium") return ChordDifficulty.Medium;
			if (val === "advanced" || val === "Advanced")
				return ChordDifficulty.Advanced;
			return val;
		}),
		z.nativeEnum(ChordDifficulty),
	])
	.nullable()
	.optional();

// Helper to handle string or enum names for ChordType
const chordTypeTransformer = z
	.union([
		z.string().transform((val) => {
			const lowercaseVal = typeof val === "string" ? val.toLowerCase() : val;

			// Map common string representations to enum values
			if (lowercaseVal === "major") return ChordType.Major;
			if (lowercaseVal === "minor") return ChordType.Minor;
			if (lowercaseVal === "suspended") return ChordType.Suspended;
			if (lowercaseVal === "augmented") return ChordType.Augmented;
			if (lowercaseVal === "diminished") return ChordType.Diminished;
			if (lowercaseVal === "seventh") return ChordType.Seventh;
			if (lowercaseVal === "majorseventh") return ChordType.MajorSeventh;
			if (lowercaseVal === "minorseventh") return ChordType.MinorSeventh;
			if (lowercaseVal === "minormajorseventh")
				return ChordType.MinorMajorSeventh;
			if (lowercaseVal === "dominantseventh") return ChordType.DominantSeventh;
			if (lowercaseVal === "augmentedseventh")
				return ChordType.AugmentedSeventh;
			if (lowercaseVal === "diminishedseventh")
				return ChordType.DiminishedSeventh;
			if (lowercaseVal === "halfdiminishedseventh")
				return ChordType.HalfDiminishedSeventh;
			if (lowercaseVal === "minorseventhflatfive")
				return ChordType.MinorSeventhFlatFive;
			if (lowercaseVal === "seventhsuspendedfourth")
				return ChordType.SeventhSuspendedFourth;
			if (lowercaseVal === "seventhsharpnine")
				return ChordType.SeventhSharpNine;
			if (lowercaseVal === "seventhflatnine") return ChordType.SeventhFlatNine;
			if (lowercaseVal === "seventhsharpfive")
				return ChordType.SeventhSharpFive;
			if (lowercaseVal === "seventhflatfive") return ChordType.SeventhFlatFive;
			if (lowercaseVal === "seventhflatthirteen")
				return ChordType.SeventhFlatThirteen;
			if (lowercaseVal === "seventhsharpeleven")
				return ChordType.SeventhSharpEleven;
			if (lowercaseVal === "seventhninth") return ChordType.SeventhNinth;
			if (lowercaseVal === "sevenththirteenth")
				return ChordType.SeventhThirteenth;
			if (lowercaseVal === "thirteenth") return ChordType.Thirteenth;
			if (lowercaseVal === "ninth") return ChordType.Ninth;
			if (lowercaseVal === "sixth") return ChordType.Sixth;
			if (lowercaseVal === "minorsixth") return ChordType.MinorSixth;
			if (lowercaseVal === "augmentedeleventh")
				return ChordType.AugmentedEleventh;
			if (lowercaseVal === "thirteenthflatnine")
				return ChordType.ThirteenthFlatNine;
			if (lowercaseVal === "thirteenthsharpnine")
				return ChordType.ThirteenthSharpNine;
			if (lowercaseVal === "thirteenthflatfive")
				return ChordType.ThirteenthFlatFive;
			if (lowercaseVal === "thirteenthsharpeleven")
				return ChordType.ThirteenthSharpEleven;
			if (lowercaseVal === "thirteenthsharpfifth")
				return ChordType.ThirteenthSharpFifth;
			if (lowercaseVal === "thirteenthflatnineflatfive")
				return ChordType.ThirteenthFlatNineFlatFive;
			if (lowercaseVal === "thirteenthflatninesharpfive")
				return ChordType.ThirteenthFlatNineSharpFive;
			if (lowercaseVal === "thirteenthsharpnineflatfive")
				return ChordType.ThirteenthSharpNineFlatFive;
			if (lowercaseVal === "thirteenthsharpninesharpfive")
				return ChordType.ThirteenthSharpNineSharpFive;
			if (lowercaseVal === "thirteenthflatninesharpeleven")
				return ChordType.ThirteenthFlatNineSharpEleven;
			if (lowercaseVal === "thirteenthsharpninesharpeleven")
				return ChordType.ThirteenthSharpNineSharpEleven;
			if (lowercaseVal === "thirteenthsharpnineflatthirteen")
				return ChordType.ThirteenthSharpNineFlatThirteen;
			if (lowercaseVal === "thirteenthsharpninesharpthirteen")
				return ChordType.ThirteenthSharpNineSharpThirteen;
			if (lowercaseVal === "thirteenthflatninesharpthirteen")
				return ChordType.ThirteenthFlatNineSharpThirteen;
			if (lowercaseVal === "thirteenthflatnineflatthirteen")
				return ChordType.ThirteenthFlatNineFlatThirteen;
			if (lowercaseVal === "thirteenthsharpfivesharpnine")
				return ChordType.ThirteenthSharpFiveSharpNine;
			if (lowercaseVal === "thirteenthsharpfiveflatnine")
				return ChordType.ThirteenthSharpFiveFlatNine;
			if (lowercaseVal === "thirteenthflatfivesharpnine")
				return ChordType.ThirteenthFlatFiveSharpNine;

			// Fallback: try to parse number or return the original value
			return !isNaN(Number(val)) ? Number(val) : val;
		}),
		z.nativeEnum(ChordType),
	])
	.nullable()
	.optional();

export const ChordSchema = z
	.object({
		id: z.string().or(z.number().int({ message: "ID must be an integer" })),
		chordName: z
			.string()
			.min(1, { message: "Chord name is required" })
			.max(15, { message: "Chord name cannot exceed 15 characters" }),
		difficulty: difficultyTransformer,
		chordType: chordTypeTransformer,
		chordAudioFilePath: z.string().max(255).nullable().optional(),
		//references
		chordCharts: z.array(z.any()).nullable().optional(),
		lyricSegments: z.array(z.any()).nullable().optional(),
	})
	.merge(BaseEntitySchema);

// API response specific schema that handles nested chordCharts
export const ChordApiSchema = ChordSchema.extend({
	chordCharts: z
		.union([ApiResponseWrapper(z.any()), z.array(z.any())])
		.nullable()
		.optional(),
});

export type ChordModel = z.infer<typeof ChordSchema>;
export type ChordApiModel = z.infer<typeof ChordApiSchema>;

export const ChordEditSchema = ChordSchema.extend({
	chordAudioUpload: z
		.instanceof(File, {
			message: "Choose correct audio file type",
		})
		.nullable()
		.optional(),
});

export type ChordEditModel = z.infer<typeof ChordEditSchema>;

const chordNameRegex =
	/^([A-G])(#|b|##|bb)?(?:m|min|maj|dim|aug|5|sus2|sus4|6|m6|7|maj7|m7|dim7|m7b5|7sus4|7#9|7b9|7#5|7b5|7b13|7#11|9|m9|maj9|11|m11|maj11|13|m13|maj13|add9|add11|add13|13b9|13#9|13b5|13#11|13#5|13b9b5|13b9#5|13#9b5|13#9#5|13b9#11|13#9#11|13#9b13|13#9#13|13b9#13|13b9b13|13#5#9|13#5b9|13b5#9)?(?:\/[A-G](#|b|##|bb)?)$/;

export const ChordCreateSchema = ChordEditSchema.extend({
	chordDifficulty: z.nativeEnum(ChordDifficulty).nullable().optional(),
	chordName: z
		.string()
		.min(1, { message: "Chord name is required" })
		.max(15, { message: "Chord name cannot exceed 15 characters" })
		.refine((val) => chordNameRegex.test(val), {
			message: "Invalid Chord Format!",
		}),
	id: z
		.string()
		.or(z.number().int({ message: "ID must be an integer" }))
		.optional(),
	chordType: z.nativeEnum(ChordType).nullable().optional(),
});

export type ChordCreateModel = z.infer<typeof ChordCreateSchema>;

export const ChordWithChartsSchema = ChordSchema.extend({
	charts: z.array(ChartSchema).nullable().optional(),
});

export type ChordWithChartsModel = z.infer<typeof ChordWithChartsSchema>;

// For backward compatibility
export { ChordDifficulty as difficultyLevel };
