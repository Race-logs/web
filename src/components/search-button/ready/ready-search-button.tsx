import "./styles.css";

type ReadySearchButtonProps = {
  onClick: () => void;
};

export const ReadySearchButton = ({ onClick }: ReadySearchButtonProps) => (
  <button
    type="button"
    className="search-button search-button__ready"
    onClick={onClick}
  >
    {"Cerca"}
  </button>
);
