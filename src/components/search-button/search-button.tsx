import { DisabledSearchButton } from "./disabled/disabled-search-button";
import { LoadingSearchButton } from "./loading/loading-search-button";
import { ReadySearchButton } from "./ready/ready-search-button";
import { RetrySearchButton } from "./retry/retry-search-button";
import "./styles.css";

type SearchButtonProps = {
  onClick: () => void;
  status: "ready" | "loading" | "disabled" | "retry";
};

export const SearchButton = ({ onClick, status }: SearchButtonProps) => {
  switch (status) {
    case "disabled":
      return <DisabledSearchButton key="disabled" />;
    case "loading":
      return <LoadingSearchButton key="loading" />;
    case "retry":
      return <RetrySearchButton key="retry" onClick={onClick} />;
    default:
      return <ReadySearchButton key="ready" onClick={onClick} />;
  }
};
