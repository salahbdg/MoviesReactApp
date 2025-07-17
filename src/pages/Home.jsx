import React from "react";
import MovieCard from "../components/MovieCard";
import { useState, useEffect, useCallback, useMemo } from "react";
import "../css/Home.css"; // Assuming you have a CSS file for styling
import { getPopularMovies, searchMovies, getMoreMovies } from "../services/api"; // Importing the API service if needed

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false); // Track if user has searched

  // [] This effect runs only once when the component mounts
  useEffect(() => {
    const loadPopularMovies = async () => {
      try {
        const popularMovies = await getPopularMovies(); // Fetching popular movies
        setMovies(popularMovies); // Setting the fetched movies to state
      } catch (error) {
        console.error("Error fetching popular movies:", error);
      } finally {
        setLoading(false); // Setting loading to false after fetching
      }
    };
    loadPopularMovies(); // Call the function to load popular movies
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();

    const query = searchQuery.trim();
    if (!query) {
      return;
    } // If the search query is empty, do nothing
    if (loading) return; // Prevent search if already loading
    setLoading(true); // Set loading to true while fetching
    setHasSearched(true); // Mark that user has searched

    try {
      const searchResults = await searchMovies(query); // Call the search function with the query
      setMovies(searchResults); // Set the search results to movies state

      setError(null); // Clear any previous errors
    } catch (error) {
      setError(error); // Set error if there's an issue with the search
      console.error("Error searching movies:", error);
      return;
    } finally {
      setLoading(false);
    }

    setSearchQuery("");
    // Here you would typically make an API call to fetch movies based on the query
  };


  // Debounced scroll handler to prevent excessive API calls
  const handleScroll = useCallback(() => {
    // Only allow infinite scroll for popular movies, not search results
    if (loading || hasSearched) return;
    
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100) { // Increased threshold
      setLoading(true);
      getMoreMovies(movies.length)
        .then((moreMovies) => {
          if (moreMovies && moreMovies.length > 0) {
            setMovies((prevMovies) => [...prevMovies, ...moreMovies]);
          }
        })
        .catch((error) => {
          setError(error);
          console.error("Error fetching more movies:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [loading, hasSearched, movies.length]);

  // Debounce scroll events
  const debouncedHandleScroll = useCallback(() => {
    clearTimeout(window.scrollTimeout);
    window.scrollTimeout = setTimeout(handleScroll, 100);
  }, [handleScroll]);

  // Add window scroll listener with debouncing
  useEffect(() => {
    window.addEventListener('scroll', debouncedHandleScroll);
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
      clearTimeout(window.scrollTimeout);
    };
  }, [debouncedHandleScroll]);

  // Memoize filtered movies to prevent unnecessary recalculations
  const filteredMovies = useMemo(() => {
    return movies.filter(
      (movie) =>
        !searchQuery ||
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [movies, searchQuery]);

  return (
    <div className="home">
      <form onSubmit={handleSearch} className="search-form">
        <input
          autoFocus
          type="text"
          placeholder="Search for a movie..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {loading && movies.length === 0 ? (
        <div className="loading">Loading movies...</div>
      ) : (
        <>
          <div className="movies-grid">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          {loading && movies.length > 0 && (
            <div className="loading">Loading more movies...</div>
          )}
        </>
      )}

      {error && <div className="error">Error: {error.message}</div>}

      <button
        className="scroll-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
      >
        ↑
      </button>
    </div>
  );
}

export default Home;
