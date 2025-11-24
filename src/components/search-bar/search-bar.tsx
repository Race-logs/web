import "./styles.css";
import { SearchInput } from "../search-input/search-input";
import { SearchButton } from "../search-button/search-button";

type SearchBarProps = {
  searchString: string;
  onChange: (value: string) => void;
  onSearch: (s: string) => void;
  status: "loading" | "error" | "idle";
};

export const SearchBar = ({
  searchString,
  onChange,
  onSearch,
  status,
}: SearchBarProps) => {
  const trimmedSearchString = searchString.trim();

  const handleSearch = () => {
    if (!trimmedSearchString || status === "loading") return;
    onSearch(trimmedSearchString);
  };

  const buttonStatus =
    trimmedSearchString === ""
      ? "disabled"
      : status === "loading"
        ? "loading"
        : status === "error"
          ? "retry"
          : "ready";

  return (
    <div className="search-bar">
      <div className="search-bar__textbox">
        <SearchInput
          placeholder="Cerca il tuo nome o il nome di una gara"
          value={searchString}
          onChange={onChange}
          onSubmit={handleSearch}
        />
      </div>
      <div className="search-bar__button">
        <SearchButton onClick={handleSearch} status={buttonStatus} />
      </div>
    </div>
  );
};
