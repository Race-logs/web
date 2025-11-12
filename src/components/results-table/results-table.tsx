import type { AthleteRaceResult } from "../../entities/athlete-race-result";
import React from "react";
import "./styles.css";
import { formatTime } from "./format-time";
import { RedirectButton } from "../redirect-button/redirect-button";

type ResultsListProps = {
  results: AthleteRaceResult[];
  onRedirect: (s: string) => void;
};

export const ResultsTable = ({ results, onRedirect }: ResultsListProps) => {
  let lastRace = "";

  const handleRaceDetailRedirect = (raceId: string) => {
    onRedirect(raceId);
  };

  const handleAthleteDetailRedirect = (athleteId: string) => {
    onRedirect(athleteId);
  };

  return (
    <table className="results-table">
      <thead>
        <tr>
          <th>Pos</th>
          <th>N°</th>
          <th>Atleta</th>
          <th>Tempo</th>
          <th>Cat</th>
          <th>Dist</th>
          <th>min/km</th>
        </tr>
      </thead>
      <tbody>
        {results.map((result) => {
          const {
            athlete: {
              id: athleteId,
              firstName,
              lastName,
              gender,
              year,
              category,
              bibNumber,
              sportsClub,
              position,
            },
            timeSeconds,
            gapSeconds,
            paceMinKm,
            id,
            race: { name: raceName, id: raceId },
          } = result;

          const showRaceHeader = raceName !== lastRace;
          lastRace = raceName;

          return (
            <React.Fragment key={id}>
              {showRaceHeader && (
                <tr className="race-header">
                  <td colSpan={10}>
                    <div className="race-name">
                      {raceName}
                      <RedirectButton
                        onClick={() =>
                          handleRaceDetailRedirect(`race id is ${raceId}`)
                        }
                      />
                    </div>
                  </td>
                </tr>
              )}
              <tr>
                <td>{position}</td>
                <td>{bibNumber}</td>
                <td className="stacked-rows">
                  <span className="athlete-name">
                    {`${lastName} ${firstName}`}
                    <RedirectButton
                      onClick={() =>
                        handleAthleteDetailRedirect(
                          `athlete id is ${athleteId}`,
                        )
                      }
                    />
                  </span>

                  <span>{sportsClub}</span>
                </td>
                <td className="race-time">{formatTime(timeSeconds)}</td>
                <td className="stacked-rows">
                  <span>{`${category}${category ? "-" : ""}${gender}`}</span>
                  <span>{year}</span>
                </td>
                <td>{formatTime(gapSeconds)}</td>
                <td>{`+${paceMinKm}`}</td>
              </tr>
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
};
