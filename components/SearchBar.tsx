import { useState, useCallback, useRef, useEffect } from "react";
import { debounce } from "lodash";
import { OpenStreetMapProvider } from "leaflet-geosearch";

// Define consistent interfaces
interface SearchResult {
  x: number;
  y: number;
  label: string; // Changed from 'labels' to 'label' to match usage
}

interface SearchBarProps {
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    label: string;
  }) => void;
}

export default function SearchBar({ onLocationSelect }: SearchBarProps) {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isResultsOpen, setIsResultsOpen] = useState<boolean>(false);

  // Create a ref for the provider to avoid recreating it on each render
  const providerRef = useRef<OpenStreetMapProvider>(
    new OpenStreetMapProvider()
  );

  // Create the debounced search function outside useCallback
  // and keep a reference to it that doesn't change between renders
  const debouncedSearchRef = useRef<((query: string) => void) | null>(null);

  useEffect(() => {
    debouncedSearchRef.current = debounce(async (searchQuery: string) => {
      if (searchQuery.length < 3) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      try {
        const searchResults = await providerRef.current.search({
          query: searchQuery,
        });
        // Ensure we're using the correct property names
        setResults(
          searchResults.map((result) => ({
            x: result.x,
            y: result.y,
            label: result.label || "", // Make sure we're using 'label'
          }))
        );
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => {
      // Clean up the debounced function
      if (debouncedSearchRef.current) {
        (
          debouncedSearchRef.current as unknown as { cancel: () => void }
        ).cancel();
      }
    };
  }, []);

  // Wrapper function to call the debounced search
  const searchLocation = useCallback((searchQuery: string) => {
    if (debouncedSearchRef.current) {
      debouncedSearchRef.current(searchQuery);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length >= 3) {
      setIsSearching(true);
      setIsResultsOpen(true);
      searchLocation(value);
    } else {
      setResults([]);
      setIsResultsOpen(false);
    }
  };

  const handleSelectLocation = (result: SearchResult) => {
    onLocationSelect({
      lat: result.y,
      lng: result.x,
      label: result.label, // Now using 'label' consistently
    });
    setQuery(result.label);
    setIsResultsOpen(false);
  };

  return (
    <div className="absolute top-4 left-0 right-0 z-[1000] px-4 md:px-8 lg:max-w-lg lg:mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="Search location (e.g., Lagos, Nigeria)"
          value={query}
          onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-full shadow-lg bg-white/90 backdrop-blur-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
          onFocus={() => results.length > 0 && setIsResultsOpen(true)}
        />

        {isSearching && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        {isResultsOpen && results.length > 0 && (
          <div className="absolute left-0 right-0 mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
            <ul>
              {results.map((result, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-0"
                  onClick={() => handleSelectLocation(result)}
                >
                  {result.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
