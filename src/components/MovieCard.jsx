import React from "react";
import "../css/MovieCard.css"; // Assuming you have a CSS file for styling
import { useMovieContext } from "../contexts/MovieContext"; // Import the context

function MovieCard({ movie }) {
  const { addFavourite, isFavourite, removeFavourite } = useMovieContext();

  const favourite = isFavourite(movie.id);


  const handleClick = (e) => {
    // Handle the click event for the favorite button
    e.preventDefault();
    if (favourite) {
      removeFavourite(movie.id);
    }
    else {
      addFavourite(movie);
    }
  };

  const linkToImage = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img src={linkToImage} alt={`${movie.title} poster`} />
        <div className="movie-overlay">
          <button
            className={`favorite-btn ${favourite ? "active" : ""}`}
            onClick={(e) => {
              handleClick(e);
            }}
          >
            ♥
          </button>
        </div>
      </div>
      <div className="movie-info">
        <h2 className="movie-title">{movie.title}</h2>
        <p className="movie-release">{movie.release_date}</p>
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default React.memo(MovieCard);

