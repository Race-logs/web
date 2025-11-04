import { ResultsTable } from "./components/results-table/results-table";
import { SearchBar } from "./components/search-bar/search-bar";
import { useAthleteRaceResults } from "./hooks/use-athlete-race-results";
import "./styles.css";
import { useState } from "react";
import { initialData } from "./initial-data";

export const App = () => {
  const [searchString, setSearchString] = useState("");
  const { data, error, loading } = useAthleteRaceResults(
    searchString,
    initialData,
  );

  return (
    <div className="main-container">
      <SearchBar
        onSearch={setSearchString}
        status={loading ? "loading" : error ? "error" : "idle"}
      />
      <ResultsTable results={data} />
    </div>
  );
};
