import { SlidersHorizontal, Star } from "lucide-react";
import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const MovieList = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  const Movies = [
    {
      id: 693134,
      title: "Dune: Part Two",
      rating: 8.8,
      image:
        "https://image.tmdb.org/t/p/w500//6izwz7rsy95ARzTR3poZ8H6c5pp.jpg",
      year: 2024,
      genre: ["Action", "Adventure", "Sci-Fi"],
      videoUrl: "https://www.youtube.com/embed/_YUzQa_1RCE"
    },
    {
      id: 792307,
      title: "Poor Things",
      rating: 8.4,
      image:
        "https://image.tmdb.org/t/p/w500//kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg",
      year: 2023,
      genre: ["Comedy", "Drama", "Romance"],
      videoUrl: "https://www.youtube.com/embed/_klfx5sGzFk"
    },
    {
      id: 872585,
      title: "Oppenheimer",
      rating: 8.9,
      image:
        "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      year: 2023,
      genre: ["Biography", "Drama", "History"],
      videoUrl: "https://www.youtube.com/embed/uYPbbksJxIg"
    },
    {
      id: 414906,
      title: "The Batman",
      rating: 8.5,
      image:
        "https://m.media-amazon.com/images/S/pv-target-images/81ef275effa427553a847bc220bebe1dc314b2e79d00333f94a6bcadd7cce851.jpg",
      year: 2024,
      genre: ["Action", "Crime", "Drama"],
      videoUrl: "https://www.youtube.com/embed/mqqft2x_Aa4"
    },
    {
      id: 466420,
      title: "Killers of the Flower Moon",
      rating: 8.7,
      image:
        "https://i.ytimg.com/vi/7cx9nCHsemc/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCOr64ZRE0h5NykaW__1LRQjVOQyg",
      year: 2023,
      genre: ["Crime", "Drama", "History"],
      videoUrl: "https://www.youtube.com/embed/EP34Yoxs3FQ"
    },
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [ratingRange] = useState<number>(10);
  const [minRating, setMinRating] = useState<number>(0);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const filteredMovies = Movies.filter(movie => {
    const genreMatch = selectedGenre === "All" || movie.genre.includes(selectedGenre);
    const yearMatch = selectedYear === "All" || movie.year.toString() === selectedYear;
    const ratingMatch = movie.rating <= ratingRange && movie.rating >= minRating;

    return genreMatch && yearMatch && ratingMatch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-100 mb-4 md:mb-0">
          {search ? `Search Results for "${search}"` : "Popular Movies"}
        </h1>
        <button
          className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          onClick={() => setShowFilters(!showFilters)} // Toggle filter visibility
        >
          <SlidersHorizontal /> Filters
        </button>
      </div>

      {showFilters && ( // Conditional rendering of filter options
        <div className="mb-4">
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg mr-2 mb-2 md:mb-0"
          >
            <option value="All">All Genres</option>
            <option value="Action">Action</option>
            <option value="Comedy">Comedy</option>
            <option value="Drama">Drama</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Romance">Romance</option>
            <option value="Crime">Crime</option>
            <option value="Biography">Biography</option>
            <option value="History">History</option>
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg mr-2 mb-2 md:mb-0"
          >
            <option value="All">All Years</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
          <div className="mt-4">
            <label className="text-white">Rating Range (Minimum): {minRating}</label>
            <input
              type="range"
              min="0"
              max="10"
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredMovies.map((movie, index) => (
          <Link key={movie.id} to={`/movie/${movie.id}`}>
            <div
              className="bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative aspect-video group">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:opacity-80 transition-opacity duration-300"
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-yellow-500 font-medium">{movie.rating}</span>
                </div>
                <iframe
                  className={`absolute top-0 left-0 w-full h-full transition-opacity duration-300 ${hoveredIndex === index ? "opacity-100" : "opacity-0"
                    }`}
                  src={hoveredIndex === index ? `${movie.videoUrl}?autoplay=1` : movie.videoUrl}
                  frameBorder="0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  title={movie.title}
                ></iframe>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-white mb-2">{movie.title}</h2>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">{movie.year}</span>
                  <div className="flex gap-2">
                    {movie.genre.slice(0, 2).map((g) => (
                      <span
                        key={g}
                        className="text-xs px-2 py-1 bg-zinc-800 rounded-full text-zinc-300"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieList;
