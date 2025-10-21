import { SearchIcon } from "./search-icon";
import "./styles.css";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
};

export const SearchInput = ({
  value,
  onChange,
  onSubmit,
  placeholder,
}: SearchInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSubmit) {
      const trimmed = value.trim();
      if (trimmed) {
        onSubmit();
      }
    }
  };

  return (
    <div className="search-input-container">
      <SearchIcon />
      <input
        type="search"
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
    </div>
  );
};
