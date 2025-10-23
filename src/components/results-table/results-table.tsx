import {
  PTable,
  PTableBody,
  PTableCell,
  PTableHead,
  PTableHeadCell,
  PTableHeadRow,
  PTableRow,
} from "@porsche-design-system/components-react";
import type { AthleteRaceResult } from "../../entities/athlete-race-result";

type ResultsListProps = {
  results: AthleteRaceResult[];
};

export const ResultsTable = ({ results }: ResultsListProps) => {
  return (
    <PTable caption="Some caption">
      <PTableHead>
        <PTableHeadRow>
          <PTableHeadCell>Pos</PTableHeadCell>
          <PTableHeadCell>N°</PTableHeadCell>
          <PTableHeadCell>Cognome, nome</PTableHeadCell>
          <PTableHeadCell>Società</PTableHeadCell>
          <PTableHeadCell>Cat</PTableHeadCell>
          <PTableHeadCell>S</PTableHeadCell>
          <PTableHeadCell>Anno</PTableHeadCell>
          <PTableHeadCell>Tempo</PTableHeadCell>
          <PTableHeadCell>Dist</PTableHeadCell>
          <PTableHeadCell>Ritmo</PTableHeadCell>
        </PTableHeadRow>
      </PTableHead>
      <PTableBody>
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
            <PTableRow key={id}>
              <PTableCell>{position}</PTableCell>
              <PTableCell>{bibNumber}</PTableCell>
              <PTableCell>{`${lastName} ${firstName}`}</PTableCell>
              <PTableCell>{sportsClub}</PTableCell>
              <PTableCell>{category}</PTableCell>
              <PTableCell>{gender}</PTableCell>
              <PTableCell>{year}</PTableCell>
              <PTableCell>{timeSeconds}</PTableCell>
              <PTableCell>{gapSeconds}</PTableCell>
              <PTableCell>{paceMinKm}</PTableCell>
            </PTableRow>
          ),
        )}
      </PTableBody>
    </PTable>
  );
};
