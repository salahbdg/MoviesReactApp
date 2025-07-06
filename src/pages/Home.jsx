import React from "react";
import MovieCard from "../components/MovieCard";
import { useState, useEffect } from "react";
import "../css/Home.css"; // Assuming you have a CSS file for styling
import { getPopularMovies, searchMovies } from "../services/api"; // Importing the API service if needed

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // console.log("ok", movies);

  const handleSearch = async (event) => {
    event.preventDefault();

    const query = searchQuery.trim();
    if (!query) {
      return;
    } // If the search query is empty, do nothing
    if (loading) return; // Prevent search if already loading
    setLoading(true); // Set loading to true while fetching

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

      {loading ? (
        <div className="loading">Loading movies...</div>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) =>
            searchQuery &&
            !movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ? (
              ""
            ) : (
              <MovieCard key={movie.id} movie={movie} />
            )
          )}
        </div>
      )}

      {error && <div className="error">Error: {error.message}</div>}
    </div>
  );
}

export default Home;
