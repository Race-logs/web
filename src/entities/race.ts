import type { GenericEntity } from "./generic-entity";

export type Race = GenericEntity & {
  id: string;
  name: string;
  date: Date;
};
