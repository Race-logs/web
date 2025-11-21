import { useMemo } from "react";
import type { AthleteRaceResult } from "../../entities/athlete-race-result";
import { RedirectButton } from "../redirect-button/redirect-button";
import { CardsList } from "../cards-list/cards-list";
import type { CardsListSection } from "../cards-list/cards-list";
import { ResultCard } from "../result-card/result-card";

type ResultsCardsProps = {
  results: AthleteRaceResult[];
  onRedirect: (id: string) => void;
};

type RaceGroup = {
  id: string;
  name: string;
  results: AthleteRaceResult[];
};

const groupResultsByRace = (results: AthleteRaceResult[]) => {
  const groups: RaceGroup[] = [];
  const seen = new Map<string, RaceGroup>();

  results.forEach((result) => {
    const {
      race: { id: raceId, name: raceName },
    } = result;

    let group = seen.get(raceId);

    if (!group) {
      group = { id: raceId, name: raceName, results: [] };
      seen.set(raceId, group);
      groups.push(group);
    }

    group.results.push(result);
  });

  return groups;
};

export const ResultsCards = ({ results, onRedirect }: ResultsCardsProps) => {
  const raceGroups = useMemo(
    () =>
      groupResultsByRace(results).filter((group) => group.results.length > 0),
    [results],
  );

  if (raceGroups.length === 0) {
    return null;
  }

  const sections: CardsListSection<AthleteRaceResult>[] = raceGroups.map(
    ({ id: raceId, name: raceName, results: raceResults }) => ({
      id: raceId,
      title: raceName,
      action: (
        <RedirectButton
          label={`Vai ai dettagli della gara ${raceName}`}
          onClick={() => onRedirect(`race id is ${raceId}`)}
        />
      ),
      items: raceResults,
      renderItem: (result) => (
        <ResultCard result={result} onRedirect={onRedirect} />
      ),
      getItemKey: (result) =>
        `${result.id}-${result.position}-${result.bibNumber}`,
    }),
  );

  return <CardsList sections={sections} />;
};
