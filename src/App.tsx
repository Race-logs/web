import { ResultsTable } from "./components/results-table/results-table";
import { SearchBar } from "./components/search-bar/search-bar";
import { useAthleteRaceResults } from "./hooks/use-athlete-race-results";
import "./styles.css";
import { useState } from "react";
import { initialResults } from "./initial-results";

export const App = () => {
  const [searchString, setSearchString] = useState("");
  const { data, error, loading } = useAthleteRaceResults(searchString);

  const results = searchString && data ? data : initialResults;

  return (
    <div className="main-container">
      <SearchBar
        onSearch={(query) => {
          setSearchString(query);
        }}
        loading={loading}
        error={error}
      />
      <ResultsTable results={results} />
    </div>
  );
};
