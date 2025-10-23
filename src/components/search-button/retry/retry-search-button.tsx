import "./styles.css";

type RetrySearchButtonProps = {
  onClick: () => void;
};

export const RetrySearchButton = ({ onClick }: RetrySearchButtonProps) => (
  <button
    type="button"
    className="search-button retry-search-button"
    onClick={onClick}
  >
    {"Riprova"}
  </button>
);
