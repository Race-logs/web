import type { Athlete } from "./athlete";
import type { GenericEntity } from "./generic-entity";
import type { Race } from "./race";

export type Result = GenericEntity & {
	athlete: Athlete;
	race: Race;
	category: string;
	timeSeconds: number;
};
