import { TrendingUp, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MovieDetails from "../Pages/MovieDetails.tsx";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.ts";

const MovieCarousel = () => {
  const [startIndexTrending, setStartIndexTrending] = useState(0);
  const [startIndexUpcoming, setStartIndexUpcoming] = useState(0);
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null);
  const visibleMovies = 4;
  const [firebaseRatings, setFirebaseRatings] = useState<Record<number, number>>({});
  const fetchMovieRating = async (movieId: number) => {
  try {
    // Reference the specific movie document in the 'movies' collection
    const movieRef = doc(db, "movies", movieId.toString());
    const movieDoc = await getDoc(movieRef);

    // Check if the document exists and return the rating field
    if (movieDoc.exists()) {
      const movieData = movieDoc.data();
      return movieData?.rating || "N/A"; // Default to "N/A" if no rating exists
    } else {
      console.warn(`No movie found with ID: ${movieId}`);
      return "N/A"; // Default to "N/A" if the document does not exist
    }
  } catch (error) {
    console.error("Error fetching movie rating:", error);
    return "N/A"; // Return "N/A" in case of any error
  }
};

  useEffect(() => {
    const loadRatings = async () => {
      const ratings: Record<number, number> = {};
      for (const movie of [...trendingMovies, ...upcomingMovies]) {
        const rating = await fetchMovieRating(movie.id);
        if (rating !== null) {
          ratings[movie.id] = rating;
        }
      }
      setFirebaseRatings(ratings);
    };
  
    loadRatings();
  }, []);
  
  const trendingMovies = [
    {
      id: 693134,
      title: "Dune Part 2",
      rating: 8.3,
      image: "https://d32qys9a6wm9no.cloudfront.net/images/movies/backdrop/7f/952eeaab1ddc8ffcf7b1983b13665d10_1280x720.jpg?t=1688073308",
      year: 2023,
      genre: ["Sci-Fi", "Adventure"],
      videoUrl: "https://www.youtube.com/embed/Way9Dexny3w",
    },
    {
      id: 872585,
      title: "Oppenheimer",
      rating: 8.9,
      image: "https://images5.alphacoders.com/125/1257951.jpeg",
      year: 2023,
      genre: ["Drama", "History"],
      videoUrl: "https://www.youtube.com/embed/uYPbbksJxIg",
    },
    {
      id: 414906,
      title: "The Batman",
      rating: 7.9,
      image: "https://m.media-amazon.com/images/S/pv-target-images/81ef275effa427553a847bc220bebe1dc314b2e79d00333f94a6bcadd7cce851.jpg",
      year: 2022,
      genre: ["Action", "Crime"],
      videoUrl: "https://www.youtube.com/embed/mqqft2x_Aa4",
    },
    {
      id: 238,
      title: "The Godfather",
      rating: 9.2,
      image: "https://m.media-amazon.com/images/M/MV5BYTJkNGQyZDgtZDQ0NC00MDM0LWEzZWQtYzUzZDEwMDljZWNjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
      year: 1972,
      genre: ["Crime", "Drama"],
      videoUrl: "https://www.youtube.com/embed/sY1S34973zA",
    },
    {
      id: 480414,
      title: "The Curse of La Llorona",
      image: "https://m.media-amazon.com/images/S/pv-target-images/1c29dd5691af4001c1b93a18df689e4b769701ab3e509abcdb349330be6f49a9.jpg",
      year: 2019,
      genre: ["Horror", "Drama"],
      videoUrl: "https://www.youtube.com/embed/uOV-xMYQ7sk"
    }
  ];


  const upcomingMovies = [
    {
      id: 76600,
      title: "Avatar: The Way of Water",
      rating: 7.8,
      image: "https://ntvb.tmsimg.com/assets/p12460960_v_h8_an.jpg?w=1280&h=720",
      year: 2022,
      genre: ["Action", "Adventure"],
      videoUrl: "https://www.youtube.com/embed/1f65r8BUZ5I",
    },
    {
      id: 634649,
      title: "Spider-Man: No Way Home",
      rating: 8.3,
      image: "https://phantom-marca.unidadeditorial.es/f435fc72c127d864fc8d33dc9b2afe8d/resize/828/f/jpg/assets/multimedia/imagenes/2021/11/15/16370114482906.jpg",
      year: 2021,
      genre: ["Action", "Sci-Fi"],
      videoUrl: "https://www.youtube.com/embed/JfVOs4VSpmA",
    },
    {
      id: 118340,
      title: "Guardians of the Galaxy Vol. 3",
      rating: 8.0,
      image: "https://imageio.forbes.com/specials-images/imageserve/644ee54b3373bc1158ad4712/GoG-3/960x0.jpg?format=jpg&width=960",
      year: 2023,
      genre: ["Action", "Comedy"],
      videoUrl: "https://www.youtube.com/embed/u3V5KDHRQvk",
    },
    {
      id: 575265,
      title: "Mission: Impossible Final Reckoning",
      rating: 7.5,
      image: "https://i.ytimg.com/vi/wlt6LAKzDWI/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDJ5n3eYFnRQbMwNunojEyZQYpRWA",
      year: 2023,
      genre: ["Action", "Thriller"],
      videoUrl: "https://www.youtube.com/embed/NOhDyUmT9z0",
    },
    {
      id: 1003596,
      title: "Avengers: Doomsday",
      rating: 6,
      image: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/eO6OdA4RDRWeCVlDMcsoxWYFySD.jpg",
      genre: ["Action", "Sci-Fi"],
      videoUrl: "https://www.youtube.com/embed/hA6hldpSTF8"
    }
  ];

  const nextSlideTrending = () => {
    setStartIndexTrending((prev) =>
      prev + visibleMovies >= trendingMovies.length ? 0 : prev + 1
    );
  };

  const nextSlideUpcoming = () => {
    setStartIndexUpcoming((prev) =>
      prev + visibleMovies >= upcomingMovies.length ? 0 : prev + 1
    );
  };

  const prevSlideTrending = () => {
    setStartIndexTrending((prev) =>
      prev === 0 ? Math.max(0, trendingMovies.length - visibleMovies) : prev - 1
    );
  };

  const prevSlideUpcoming = () => {
    setStartIndexUpcoming((prev) =>
      prev === 0 ? Math.max(0, upcomingMovies.length - visibleMovies) : prev - 1
    );
  };

  const MovieCard = ({ movie }: { movie: any }) => (
    <div className="bg-zinc-900/50 rounded-xl overflow-hidden movie-card-hover backdrop-blur-sm">
      <div className="relative aspect-[12/9]">
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full h-full object-cover hover-glow"
        />
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex flex-col items-center gap-1">
          <span className="text-yellow-500 font-medium">{movie.rating}</span>
          <span className="text-zinc-400 text-xs">
            User Rating: {firebaseRatings[movie.id] || "N/A"}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg truncate text-glow">{movie.title}</h3>
          <span className="text-zinc-400 text-sm">{movie.year}</span>
        </div>
        {movie.genre && (
          <div className="flex flex-wrap gap-2">
            {movie.genre.slice(0, 2).map((g) => (
              <span key={g} className="text-xs px-2 py-1 bg-zinc-800 rounded-full text-zinc-300">
                {g}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
  

  return (
    <div>
      {/* Trending Movies Section */}
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-yellow-500" />
        Trending Now
      </h2>
      <div className="relative group mb-8">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${startIndexTrending * (100 / visibleMovies)}%)`,
            }}
          >
            {trendingMovies.map((movie) => (
              <div
                key={movie.id}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 p-2"
                onMouseEnter={() => setHoveredMovie(movie.id)}
                onMouseLeave={() => setHoveredMovie(null)}
              >
                <Link to={`/movie/${movie.id}`}>
                  <MovieCard movie={movie} />
                </Link>
              </div>
            ))}
          </div>
        </div>
        {trendingMovies.length > visibleMovies && (
          <>
            <button
              onClick={prevSlideTrending}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlideTrending}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Upcoming Movies Section */}
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Clock className="w-6 h-6 text-yellow-500" />
        Coming Soon
      </h2>
      <div className="relative group">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${startIndexUpcoming * (100 / visibleMovies)}%)`,
            }}
          >
            {upcomingMovies.map((movie) => (
              <div
                key={movie.id}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 p-2"
                onMouseEnter={() => setHoveredMovie(movie.id)}
                onMouseLeave={() => setHoveredMovie(null)}
              >
                <Link to={`/movie/${movie.id}`}>
                  <MovieCard movie={movie} />
                </Link>
              </div>
            ))}
          </div>
        </div>
        {upcomingMovies.length > visibleMovies && (
          <>
            <button
              onClick={prevSlideUpcoming}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlideUpcoming}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MovieCarousel;