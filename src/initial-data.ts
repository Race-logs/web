import type { AthleteRaceResult } from "./entities/athlete-race-result";

export const initialData: AthleteRaceResult[] = [
  {
    id: "97904f49-3d6d-4ed6-9f6c-c1800e0f63cb",
    athlete: {
      id: "336165cc-66e8-47af-b5f2-6bfcd120b207",
      firstName: "Giovanni",
      lastName: "Panetta",
      gender: "M",
      year: 1971,
      category: "SENIOR",
      bibNumber: 101,
      sportsClub: "CUS Torino",
      position: 1,
    },
    race: {
      id: "5afc7b75-bacb-4d1c-94c8-50d69da39822",
      name: "Gara Storica",
      date: new Date("2025-01-22"),
    },
    timeSeconds: 3607,
    gapSeconds: 0,
    paceMinKm: 6.01,
  },
];
