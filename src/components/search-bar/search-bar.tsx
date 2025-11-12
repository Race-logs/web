import { useState } from "react";
import "./styles.css";
import { SearchInput } from "../search-input/search-input";
import { SearchButton } from "../search-button/search-button";

type SearchBarProps = {
  onSearch: (s: string) => void;
  status: "loading" | "error" | "idle";
};

export const SearchBar = ({ onSearch, status }: SearchBarProps) => {
  const [searchString, setSearchString] = useState("");

  const handleSearch = () => {
    const trimmed = searchString.trim();
    if (!trimmed || status === "loading") return;
    onSearch(trimmed);
  };

  const buttonStatus =
    searchString.trim() === ""
      ? "disabled"
      : status === "loading"
        ? "loading"
        : status === "error"
          ? "retry"
          : "ready";

  return (
    <div className="search-container">
      <div className="textbox">
        <SearchInput
          placeholder="Cerca il tuo nome o il nome di una gara"
          value={searchString}
          onChange={setSearchString}
          onSubmit={handleSearch}
        />
      </div>
      <SearchButton onClick={handleSearch} status={buttonStatus} />
    </div>
  );
};
