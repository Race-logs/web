import type { GenericEntity } from "./generic-entity";

export type Race = GenericEntity & {
  name: string;
  date: Date;
  location: string;
};
