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
    <article className="result-card" data-card-id={id}>
      <header className="result-card__header">
        <div className="result-card__placement">
          <span className="result-card__position">#{position}</span>
        </div>
        <span className="result-card__time">{formatTime(timeSeconds)}</span>
      </header>
      <div className="result-card__athlete">
        <p className="result-card__name">
          <span className="result-card__bib">N° {bibNumber}</span>
          <span>{`${lastName} ${firstName}`}</span>
          <RedirectButton
            label={`Vai ai dettagli di ${lastName} ${firstName}`}
            onClick={() => onRedirect(`athlete id is ${athleteId}`)}
          />
        </p>
        <p className="result-card__club">{sportsClub}</p>
      </div>
      <button
        className={`result-card__toggle${
          isExpanded ? " result-card__toggle--expanded" : ""
        }`}
        onClick={toggleCardDetails}
        type="button"
        aria-expanded={isExpanded}
        aria-label={isExpanded ? "Nascondi dettagli" : "Mostra dettagli"}
        aria-controls={detailsId}
      >
        <ToggleIcon />
      </button>
      {isExpanded ? (
        <dl className="result-card__meta" id={detailsId}>
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
