import type { AthleteRaceResult } from "../../entities/athlete-race-result";
import { useState } from "react";
import { RedirectButton } from "../redirect-button/redirect-button";
import { formatTime } from "../results-table/format-time";
import "./styles.css";

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
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>(
    {},
  );
  const raceGroups = groupResultsByRace(results);

  if (raceGroups.length === 0) {
    return null;
  }

  const toggleCardDetails = (key: string) => {
    setExpandedCards((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  return (
    <div className="results-cards">
      {raceGroups.map(
        ({ id: raceId, name: raceName, results: raceResults }) => (
          <section className="results-cards__race" key={raceId}>
            <header className="results-cards__race-header">
              <div className="results-cards__race-title">
                <h2>{raceName}</h2>
                <RedirectButton
                  onClick={() => onRedirect(`race id is ${raceId}`)}
                />
              </div>
            </header>
            <div className="results-cards__race-grid">
              {raceResults.map((result) => {
                const {
                  id,
                  position,
                  bibNumber,
                  paceMinKm,
                  timeSeconds,
                  gapSeconds,
                  category,
                  sportsClub,
                  athlete: {
                    firstName,
                    lastName,
                    gender,
                    yearOfBirth,
                    id: athleteId,
                  },
                } = result;
                const resultKey = `${id}-${position}-${bibNumber}`;
                const isExpanded = Boolean(expandedCards[resultKey]);

                return (
                  <article className="results-card" key={resultKey}>
                    <header className="results-card__header">
                      <div className="results-card__placement">
                        <span className="results-card__position">
                          #{position}
                        </span>
                      </div>
                      <span className="results-card__time">
                        {formatTime(timeSeconds)}
                      </span>
                    </header>
                    <div className="results-card__athlete">
                      <p className="results-card__name">
                        <span className="results-card__bib">
                          N° {bibNumber}
                        </span>
                        <span>{`${lastName} ${firstName}`}</span>
                        <RedirectButton
                          onClick={() =>
                            onRedirect(`athlete id is ${athleteId}`)
                          }
                        />
                      </p>
                      <p className="results-card__club">{sportsClub}</p>
                    </div>
                    <button
                      className="results-card__toggle"
                      onClick={() => toggleCardDetails(resultKey)}
                      type="button"
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? "Nascondi dettagli" : "Mostra dettagli"}
                    </button>
                    {isExpanded && (
                      <dl className="results-card__meta">
                        <div>
                          <dt>Categoria</dt>
                          <dd>{`${category}${category ? "-" : ""}${gender}`}</dd>
                        </div>
                        <div>
                          <dt>Anno</dt>
                          <dd>{yearOfBirth}</dd>
                        </div>
                        <div>
                          <dt>Gap</dt>
                          <dd>
                            {gapSeconds === 0
                              ? formatTime(gapSeconds)
                              : `+${formatTime(gapSeconds)}`}
                          </dd>
                        </div>
                        <div>
                          <dt>min/km</dt>
                          <dd>{paceMinKm}</dd>
                        </div>
                      </dl>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        ),
      )}
    </div>
  );
};
