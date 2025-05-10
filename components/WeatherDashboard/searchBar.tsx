"use client";
import { useState } from 'react';

export default function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (!query.trim()) return;
    onSearch(query);
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        placeholder="Enter city or ZIP code"
        className="p-2 border rounded-lg dark:bg-gray-800 dark:text-white"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Search</button>
    </div>
  );
}
