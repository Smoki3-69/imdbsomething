import React from "react";
import { Play, Star, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const featuredMovies = [
  {
    id: 693134,
    title: "Dune: Part Two",
    rating: 8.8,
    releaseDate: "March 1, 2024",
    description:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he must prevent a terrible future only he can foresee.",
    image:
      "https://d32qys9a6wm9no.cloudfront.net/images/movies/backdrop/7f/952eeaab1ddc8ffcf7b1983b13665d10_1280x720.jpg?t=1688073308",
  },
  {
    id: 872585,
    title: "Oppenheimer",
    rating: 8.9,
    releaseDate: "July 21, 2023",
    description:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb. A gripping tale of genius, conscience, and the price of scientific progress.",
    image:
      "https://images5.alphacoders.com/125/1257951.jpeg",
  },
  {
    id: 49026,
    title: "The Dark Knight Rises",
    rating: 7.8,
    releaseDate: "July 20, 2012",
    description:
      "Following the death of District Attorney Harvey Dent, Batman assumes responsibility for Dent's crimes to protect the late attorney's reputation and is subsequently hunted by the Gotham City Police Department. Eight years later, Batman encounters the mysterious Selina Kyle and the villainous Bane, a new terrorist leader who overwhelms Gotham's finest. The Dark Knight resurfaces to protect a city that has branded him an enemy.",
    image: 
      "https://m.media-amazon.com/images/M/MV5BZDdkYjIyNTEtYjlkZC00NDdlLTgxYmUtMzI3NjM5YzQ0NjY5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"
  }
];

const Hero = () => {
  const [currentMovie, setCurrentMovie] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMovie((prev) => (prev + 1) % featuredMovies.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const movie = featuredMovies[currentMovie];

  return (
    <div className="relative h-[90vh] bg-gradient-to-b from-transparent to-black">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 gradient-mask"
        style={{
          backgroundImage: `url('${movie.image}')`,
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-[1px]" />
      </div>

      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="text-yellow-500 font-semibold">
                {movie.rating} Rating
              </span>
            </div>
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
              <Calendar className="w-5 h-5 text-zinc-400" />
              <span className="text-zinc-300">{movie.releaseDate}</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-glow">
            {movie.title}
          </h1>
          <p className="text-zinc-300 text-lg mb-8 line-clamp-3 max-w-xl">
            {movie.description}
          </p>
          <div className="flex items-center gap-4">
            <Link
              to={`/movie/${movie.id}`}
              className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-yellow-400 transition-all hover:scale-105 duration-300"
            >
              <Play className="w-5 h-5" />
              Watch Trailer
            </Link>
            <Link
              to={`/movie/${movie.id}`}
              className="bg-zinc-900/80 backdrop-blur-md text-white px-8 py-3 rounded-xl font-semibold hover:bg-zinc-800 transition-all hover:scale-105 duration-300"
            >
              More Info
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 right-4 flex gap-2">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentMovie(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${currentMovie === index
                  ? "bg-yellow-500 w-8"
                  : "bg-zinc-600 w-4 hover:bg-zinc-500"
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;