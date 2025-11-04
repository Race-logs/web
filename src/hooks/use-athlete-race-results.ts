import { useFetchData } from "./use-fetch-data";
import type { AthleteRaceResult } from "../entities/athlete-race-result";
import type { UseFetchResultType } from "./use-fetch-data";

const baseUrl = import.meta.env.VITE_API_URL;

export const useAthleteRaceResults = (
  searchString: string,
  initialData: AthleteRaceResult[],
): UseFetchResultType<AthleteRaceResult[]> =>
  useFetchData<AthleteRaceResult[]>(
    `${baseUrl}/race-results`,
    searchString,
    initialData,
  );
