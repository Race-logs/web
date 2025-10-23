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
  if (status === "disabled") {
    return <DisabledSearchButton />;
  }

  if (status === "loading") {
    return <LoadingSearchButton />;
  }

  if (status === "retry") {
    return <RetrySearchButton onClick={onClick} />;
  }

  return <ReadySearchButton onClick={onClick} />;
};
