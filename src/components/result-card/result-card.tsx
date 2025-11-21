import { useState } from "react";
import type { AthleteRaceResult } from "../../entities/athlete-race-result";
import { RedirectButton } from "../redirect-button/redirect-button";
import { formatTime } from "../results-table/format-time";
import { ToggleIcon } from "../results-cards/toggle-icon";
import "./styles.css";

type ResultCardProps = {
  result: AthleteRaceResult;
  onRedirect: (id: string) => void;
};

export const ResultCard = ({ result, onRedirect }: ResultCardProps) => {
  const {
    id,
    position,
    bibNumber,
    paceMinKm,
    timeSeconds,
    gapSeconds,
    category,
    sportsClub,
    athlete: { firstName, lastName, gender, yearOfBirth, id: athleteId },
  } = result;

  const [isExpanded, setIsExpanded] = useState(false);
  const detailsId = `${id}-details`;

  const toggleCardDetails = () => {
    setIsExpanded((previous) => !previous);
  };

  return (
    <article className="results-card" data-card-id={id}>
      <header className="results-card__header">
        <div className="results-card__placement">
          <span className="results-card__position">#{position}</span>
        </div>
        <span className="results-card__time">{formatTime(timeSeconds)}</span>
      </header>
      <div className="results-card__athlete">
        <p className="results-card__name">
          <span className="results-card__bib">N° {bibNumber}</span>
          <span>{`${lastName} ${firstName}`}</span>
          <RedirectButton
            label={`Vai ai dettagli di ${lastName} ${firstName}`}
            onClick={() => onRedirect(`athlete id is ${athleteId}`)}
          />
        </p>
        <p className="results-card__club">{sportsClub}</p>
      </div>
      <button
        className={`results-card__toggle${isExpanded ? " expanded" : ""}`}
        onClick={toggleCardDetails}
        type="button"
        aria-expanded={isExpanded}
        aria-label={isExpanded ? "Nascondi dettagli" : "Mostra dettagli"}
        aria-controls={detailsId}
      >
        <ToggleIcon />
      </button>
      {isExpanded ? (
        <dl className="results-card__meta" id={detailsId}>
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
      ) : null}
    </article>
  );
};
