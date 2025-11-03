import type { AthleteRaceResult } from "../../entities/athlete-race-result";
import "./styles.css";

type ResultsListProps = {
  results: AthleteRaceResult[];
};

export const ResultsTable = ({ results }: ResultsListProps) => {
  return (
    <table className="results-table">
      <thead>
        <tr>
          <th>Pos</th>
          <th>N°</th>
          <th>Cognome, nome</th>
          <th>Società</th>
          <th>Cat</th>
          <th>S</th>
          <th>Anno</th>
          <th>Tempo</th>
          <th>Dist</th>
          <th>Ritmo</th>
        </tr>
      </thead>
      <tbody>
        {results.map(
          ({
            athlete: {
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
          }) => (
            <tr key={id}>
              <td>{position}</td>
              <td>{bibNumber}</td>
              <td>{`${lastName} ${firstName}`}</td>
              <td>{sportsClub}</td>
              <td>{category}</td>
              <td>{gender}</td>
              <td>{year}</td>
              <td>{timeSeconds}</td>
              <td>{gapSeconds}</td>
              <td>{paceMinKm}</td>
            </tr>
          ),
        )}
      </tbody>
    </table>
  );
};
