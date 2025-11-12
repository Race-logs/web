import { ArrowIcon } from "./arrow-icon";
import "./styles.css";

type RedirectButtonProps = {
  onClick: () => void;
};

export const RedirectButton = ({ onClick }: RedirectButtonProps) => (
  <button className="redirect-button" onClick={onClick} type="button">
    <ArrowIcon />
  </button>
);
