import { PButton } from "@porsche-design-system/components-react";
import { useState } from "react";
import "./styles.css";
import { SearchInput } from "../search-input/search-input";
import { SearchButton } from "../search-button/search-button";

export type SearchBarProps = {
  onSearch: (searchString: string) => void;
  loading: boolean;
  error: boolean;
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
