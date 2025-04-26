import { z } from "zod";

export enum PlayLevel {
	Easy = 1,
	Medium = 2,
	Advanced = 3,
}

export const PlayLevelEnum = z.nativeEnum(PlayLevel).nullable().optional();
