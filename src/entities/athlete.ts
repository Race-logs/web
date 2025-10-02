import type { GenericEntity } from "./generic-entity";

export type Sex = "M" | "F";

export type Athlete = GenericEntity & {
	name: string;
	sex: Sex;
	year: number;
};
