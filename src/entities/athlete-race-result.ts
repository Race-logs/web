import type { Athlete } from "./athlete";
import type { GenericEntity } from "./generic-entity";
import type { Race } from "./race";

export type Gender = "M" | "F";

export type AthleteRaceResult = GenericEntity & {
  athlete: Athlete;
  race: Race;
  timeSeconds: number;
  gapSeconds: number;
  paceMinKm: number;
  category: string;
  bibNumber: number;
  sportsClub: string;
  position: number;
};
