const APIKey = "you_api_key";
const APIBaseURL = "https://api.themoviedb.org/3";

export const getPopularMovies = async () => {
  const response = await fetch(
    `${APIBaseURL}/movie/popular?api_key=${APIKey}`
  );

  const data = await response.json();
  return data.results;

};

export const searchMovies = async (query) => {
  const response = await fetch(
    `${APIBaseURL}/search/movie?api_key=${APIKey}&query=${encodeURIComponent(query)}`
  );

  const data = await response.json();
  return data.results;

}
