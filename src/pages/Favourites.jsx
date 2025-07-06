import React from "react";
import "../css/Favorites.css";
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/MovieCard"; // Importing the MovieCard component

function Favourites() {
  const { favourites } = useMovieContext();
  if (favourites.length === 0) {
    return <EmptyFavourites />;
  }

  if (favourites) {
    return (
      <div className="favorites">
        <h3>Your Favorites</h3>
        <div className="movies-grid">
          {favourites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    );
  }
}

function EmptyFavourites() {
  return (
    <div className="favorites-empty">
      <h2>No Favourites Added</h2>
      <p>
        You haven't added any movies to your favourites yet. Start exploring and
        add your favorite movies!
      </p>
    </div>
  );
}

export default Favourites;
