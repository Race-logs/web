import { ResultsTable } from "./components/results-table/results-table";
import { SearchBar } from "./components/search-bar/search-bar";
import { useAthleteRaceResults } from "./hooks/use-athlete-race-results";
import { ResultsCards } from "./components/results-cards/results-cards";
import { useState } from "react";
import { initialData } from "./initial-data";
import { useMediaQuery } from "./hooks/use-media-query";
import "./styles.css";

export const App = () => {
  const [searchString, setSearchString] = useState("");
  const { data, error, loading } = useAthleteRaceResults(
    searchString,
    initialData,
  );

  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div className="main-container">
      <SearchBar
        onSearch={setSearchString}
        status={loading ? "loading" : error ? "error" : "idle"}
      />
      {isMobile ? (
        <ResultsCards results={data} onRedirect={setSearchString} />
      ) : (
        <ResultsTable results={data} onRedirect={setSearchString} />
      )}
    </div>
  );
};
