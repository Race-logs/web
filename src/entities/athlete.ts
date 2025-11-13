import type { GenericEntity } from "./generic-entity";

export type Gender = "M" | "F";

export type Athlete = GenericEntity & {
  firstName: string;
  lastName: string;
  gender: Gender;
  yearOfBirth: number;
};
