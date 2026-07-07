import { useState } from "react";
import "./SearchBar.css";

function SearchBar({ onSearch }) {
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    onSearch(value);
  };

  return (
    <div className="search-bar">
      <h2>Search Medicine</h2>

      <input
        type="text"
        placeholder="Search by SKU..."
        value={search}
        onChange={handleSearch}
      />
    </div>
  );
}

export default SearchBar;