import "./styles.css";

type ReadySearchButtonProps = {
  onClick: () => void;
};

export const ReadySearchButton = ({ onClick }: ReadySearchButtonProps) => (
  <button
    type="button"
    className="search-button ready-search-button"
    onClick={onClick}
  >
    {"Cerca"}
  </button>
);
