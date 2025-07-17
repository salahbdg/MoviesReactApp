import { createContext, useState, useContext, useEffect } from "react";

const MovieContext = createContext();

export const useMovieContext = () => {
  return useContext(MovieContext);
};

export const MovieProvider = ({ children }) => {
  const [favourites, setFavourites] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false); // Track if data has been loaded from localStorage

  // Load favorites from localStorage on component mount
  useEffect(() => {
    try {
      const storedFavourites = localStorage.getItem("favourites");
      if (storedFavourites) {
        const parsedFavourites = JSON.parse(storedFavourites);
        // Ensure it's an array
        if (Array.isArray(parsedFavourites)) {
          setFavourites(parsedFavourites);
        }
      }
    } catch (error) {
      console.error("Error loading favorites from localStorage:", error);
      // Reset to empty array if there's an error
      localStorage.removeItem("favourites");
    } finally {
      setIsLoaded(true); // Mark as loaded regardless of success or failure
    }
  }, []);

  // Save favorites to localStorage whenever favorites change (but only after initial load)
  useEffect(() => {
    if (!isLoaded) return; // Don't save until we've loaded from localStorage first
    
    try {
      localStorage.setItem("favourites", JSON.stringify(favourites));
    } catch (error) {
      console.error("Error saving favorites to localStorage:", error);
    }
  }, [favourites, isLoaded]);


  const addFavourite = (movie) => {
    setFavourites((prevFavourites) => {
      // Check if movie is already in favorites to prevent duplicates
      if (prevFavourites.some(fav => fav.id === movie.id)) {
        return prevFavourites;
      }
      return [...prevFavourites, movie];
    });
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
