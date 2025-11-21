import { ArrowIcon } from "./arrow-icon";
import "./styles.css";

type RedirectButtonProps = {
  onClick: () => void;
  label: string;
};

export const RedirectButton = ({ onClick, label }: RedirectButtonProps) => (
  <button
    className="redirect-button"
    onClick={onClick}
    type="button"
    aria-label={label}
  >
    <ArrowIcon />
  </button>
);
