import { useState } from "react";
import "./styles.css";
import { SearchInput } from "../search-input/search-input";
import { SearchButton } from "../search-button/search-button";

type SearchBarState =
  | { loading: true; error: false }
  | { loading: false; error: true }
  | { loading: false; error: false };

export type SearchBarProps = SearchBarState & {
  onSearch: (searchString: string) => void;
};

export const SearchBar = ({ onSearch, loading, error }: SearchBarProps) => {
  const [searchString, setSearchString] = useState("");

  const handleSearch = () => {
    const trimmed = searchString.trim();
    if (!trimmed || loading) return;
    onSearch(trimmed);
  };

  const buttonStatus =
    searchString.trim() === ""
      ? "disabled"
      : loading
        ? "loading"
        : error
          ? "retry"
          : "ready";

  return (
    <div className="search-container">
      <div className="textbox">
        <SearchInput
          placeholder="Cerca..."
          value={searchString}
          onChange={setSearchString}
          onSubmit={handleSearch}
        />
      </div>
      <SearchButton onClick={handleSearch} status={buttonStatus} />
    </div>
  );
};
