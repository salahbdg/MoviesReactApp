import { createContext, useState, useContext, useEffect } from "react";

const MovieContext = createContext();

export const useMovieContext = () => {
  return useContext(MovieContext);
};

export const MovieProvider = ({ children }) => {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const storedFavourites = localStorage.getItem("favourites");
    if (storedFavourites) {
      setFavourites(JSON.parse(storedFavourites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);


  const addFavourite = (movie) => {
    setFavourites((prevFavourites) => [...prevFavourites, movie]);
  };
  
  const removeFavourite = (movieId) => {
    setFavourites((prevFavourites) =>
      prevFavourites.filter((movie) => movie.id !== movieId)
    );
  };

  const isFavourite = (movieId) => {
    return favourites.some((movie) => movie.id === movieId);
  };

  const value = {
    favourites,
    setFavourites,
    addFavourite,
    removeFavourite,
    isFavourite,
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
};
