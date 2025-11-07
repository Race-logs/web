import type { GenericEntity } from "./generic-entity";
import type { Race } from "./race";

export type Gender = "M" | "F";

export type Athlete = GenericEntity & {
  firstName: string;
  lastName: string;
  gender: Gender;
  year: number;
  category: string;
  bibNumber: number;
  sportsClub: string;
  position: number;
};

export type AthleteRaceResult = GenericEntity & {
  athlete: Athlete;
  race: Race;
  timeSeconds: number;
  gapSeconds: number;
  paceMinKm: number;
};
