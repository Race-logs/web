import { useEffect, useState } from "react";
import { initialData } from "./initial-data";
import { ResultsCards } from "./components/results-cards/results-cards";
import { ResultsTable } from "./components/results-table/results-table";
import { SearchBar } from "./components/search-bar/search-bar";
import { useMediaQuery } from "./hooks/use-media-query";
import { useSearchQuerySync } from "./hooks/use-search-query-sync";
import { useAthleteRaceResults } from "./hooks/use-athlete-race-results";
import "./styles.css";

export const App = () => {
  const { searchQuery, writeSearchQuery } = useSearchQuerySync();
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [searchString, setSearchString] = useState(searchQuery);
  const { data, error, loading } = useAthleteRaceResults(
    searchString,
    initialData,
  );
  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    setSearchInput(searchQuery);
    setSearchString(searchQuery);
  }, [searchQuery]);

  const handleApplySearch = (value: string) => {
    setSearchInput(value);
    setSearchString(value);
    writeSearchQuery(value);
  };

  return (
    <div className="main-container">
      <SearchBar
        searchString={searchInput}
        onChange={setSearchInput}
        onSearch={handleApplySearch}
        status={loading ? "loading" : error ? "error" : "idle"}
      />
      {isMobile ? (
        <ResultsCards results={data} onRedirect={handleApplySearch} />
      ) : (
        <ResultsTable results={data} onRedirect={handleApplySearch} />
      )}
    </div>
  );
};
