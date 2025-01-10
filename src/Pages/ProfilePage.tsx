import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.tsx';
import { getAuth, signOut } from 'firebase/auth';
import { db, storage } from '../firebase.ts';
import { doc, setDoc, deleteDoc, getDoc, collection, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import ReviewList from '../components/ReviewList.tsx';
import axios from 'axios';

const genreToId = {
    'Action': 28,
    'Comedy': 35,
    'Drama': 18,
    'Fantasy': 14,
    'Horror': 27,
    'Mystery': 9648,
    'Romance': 10749,
    'Science Fiction': 878,
    'Thriller': 53,
    'Western': 37,
};

const BASE_POSTER_URL = 'https://image.tmdb.org/t/p/original/';
const TMDB_API_KEY = '859afbb4b98e3b467da9c99ac390e950';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const ProfilePage = () => {
    const { user } = useContext(AuthContext);
    const [username, setUsername] = useState(user?.username || '');
    const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
    const [selectedGenres, setSelectedGenres] = useState<string[]>(user?.preferences?.split(',') || []);
    const [ratedMovies, setRatedMovies] = useState<{ id: string; title: string; posterPath: string; rating: number }[]>([]);
    const navigate = useNavigate();
    const [isFileTooLarge, setIsFileTooLarge] = useState(false);
    const [watchlist, setWatchlist] = useState<{ id: string; title: string; posterPath: string }[]>([]);
    const [recommendations, setRecommendations] = useState<{ id: string; title: string; posterPath: string }[]>([]);
    const [showRecommendations, setShowRecommendations] = useState(false);
    const [displayedRecommendationsCount, setDisplayedRecommendationsCount] = useState(6);
    const [allRecommendations, setAllRecommendations] = useState<{ id: string; title: string; posterPath: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);


    const fetchRecommendations = async (genres: string[]) => {
        const genreIds = genres
            .filter(genre => genre)
            .map(genre => genreToId[genre])
            .join(',');

        console.log("Genre IDs being sent to API:", genreIds);

        try {
            const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
                params: {
                    api_key: TMDB_API_KEY,
                    with_genres: genreIds,
                    page: 1,
                },
            });

            const movies = response.data.results.map((movie: any) => ({
                id: movie.id.toString(),
                title: movie.title,
                posterPath: BASE_POSTER_URL + movie.poster_path,
            }));

            console.log("Fetched Movies:", movies);
            return movies;
        } catch (error) {
            console.error('Error fetching movie recommendations:', error);
            return [];
        }
    };

    const handleRemoveFromWatchlist = async (movieId: string) => {
        const movieRef = doc(db, `users/${user.uid}/watchlist`, movieId);
        await deleteDoc(movieRef);
    };

    useEffect(() => {
        if (user?.uid) {
            const fetchUserData = async () => {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setUsername(userData.username);
                    setProfilePicture(userData.profilePicture);
                    setSelectedGenres(userData.preferences.split(','));
                }
            };

            const watchlistRef = collection(db, `users/${user.uid}/watchlist`);
            const unsubscribeWatchlist = onSnapshot(watchlistRef, (snapshot) => {
                const updatedWatchlist = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    posterPath: `${BASE_POSTER_URL}${doc.data().posterPath}`,
                }));
                setWatchlist(updatedWatchlist);
            });

            const ratingsRef = collection(db, `users/${user.uid}/ratings`);
            const unsubscribeRatings = onSnapshot(ratingsRef, (snapshot) => {
                const moviesMap = new Map();
                snapshot.docs.forEach((doc) => {
                    const data = doc.data();
                    if (!moviesMap.has(data.title)) {
                        moviesMap.set(data.title, {
                            id: doc.id,
                            title: data.title,
                            posterPath: `${BASE_POSTER_URL}${data.posterPath}`,
                            rating: data.rating,
                        });
                    }
                });
                setRatedMovies(Array.from(moviesMap.values()));
            });

            fetchUserData();
            return () => {
                unsubscribeRatings();
            };
        }
    }, [user?.uid]);

    useEffect(() => {
        const fetchAndSetRecommendations = async () => {
            console.log("Fetching recommendations for genres:", selectedGenres);
            const fetchedRecommendations = await fetchRecommendations(selectedGenres);
            setRecommendations(fetchedRecommendations.slice(0, 6));
            setAllRecommendations(fetchedRecommendations);
        };

        fetchAndSetRecommendations();
    }, [selectedGenres]);

    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            console.log("Selected file:", file);  // Add a console log
            if (!file.type.startsWith("image/")) {
                setIsFileTooLarge(true);
                return;
            }
            if (file.size > 1048576) {
                setIsFileTooLarge(true);
                return;
            }
            setIsFileTooLarge(false);
            setProfilePicture(file);
        }
    };
    


    const handleSave = async () => {
        setIsLoading(true); // Set loading to true when save starts
    
        try {
            const userRef = doc(db, 'users', user.uid);
            let imageUrl = profilePicture;
    
            // If the profile picture is a file, upload it to storage
            if (typeof profilePicture === 'object' && profilePicture instanceof File) {
                // Change the storage reference to /users/{user.uid}/profilePicture
                const storageRef = ref(storage, `users/${user.uid}/profilePicture`);
                const snapshot = await uploadBytes(storageRef, profilePicture);
                imageUrl = await getDownloadURL(snapshot.ref); // Get the download URL of the uploaded image
            }
    
            // Update the user document with the new profile data
            await setDoc(
                userRef,
                {
                    username,
                    profilePicture: imageUrl, // Use the URL if it's an image
                    preferences: selectedGenres.join(','),
                },
                { merge: true }
            );
    
            // Set the updated profile information in state
            setProfilePicture(imageUrl);
            setUsername(username);
    
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Error updating profile, please try again.');
        } finally {
            setIsLoading(false); // Stop loading when the operation finishes
        }
    };
    
    


    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePreferencesChange = (genre: string) => {
        setSelectedGenres((prev) =>
            prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
        );
    };


    const handleLogout = () => {
        const auth = getAuth();
        signOut(auth)
            .then(() => {
                navigate('/login');
            })
            .catch((error) => {
                console.error('Error logging out:', error);
            });
    };
    const handleRecommendationClick = (movieId: string) => {
        navigate(`/movie/${movieId}`);
    };
    function handleMovieClick(id: string): void {
        throw new Error('Function not implemented.');
    }

    return (
        <div className="profile-page bg-gray-900 text-white min-h-screen p-6 flex">
            {isFileTooLarge && (
                <div className="error-message text-red-500">The file size exceeds the limit of 1MB. Please upload a smaller image.</div>
            )}
            <div className="left-section w-2/3 pr-6">
                <h1 className="text-4xl font-bold mb-8 text-yellow-500">Profile Page</h1>

                <div className="profile-header flex items-center gap-6 mb-8">
                    <img
                        src={`${profilePicture}?${new Date().getTime()}`}
                        alt="Profile"
                        className="w-36 h-36 rounded-full border-4 border-yellow-500 object-cover"
                    />


                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Edit Username"
                            className="bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-yellow-500"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePictureChange}
                            className="text-gray-300 text-sm"
                        />
                    </div>
                </div>

                <div className="preferences mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Preferences</h2>
                    <div className="flex flex-wrap gap-4">
                        {Object.keys(genreToId).map((genre, index) => (
                            <button
                                key={index}
                                className={`px-5 py-2 rounded-lg ${selectedGenres.includes(genre) ? 'bg-yellow-500' : 'bg-gray-700'} hover:bg-yellow-600`}
                                onClick={() =>
                                    setSelectedGenres((prev) =>
                                        prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
                                    )
                                }
                            >
                                {genre}
                            </button>
                        ))}
                    </div>
                    <div className='align-center justify-center'>
                    <button 
                        onClick={handleSave}
                        className={`mt-4 px-8 py-3 rounded-lg  ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-cyan-600'}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="spinner">
                                <div className="spin"></div> {/* Spinner */}
                            </div>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                    </div>

                </div>

                <div className="reviews-section mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Your Reviews</h2>
                    <ReviewList userId={user?.uid} />
                </div>

                <button
                    onClick={handleLogout}
                    className="mt-4 bg-red-500 px-8 py-3 rounded-lg hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
            <div className="watchlist-section w-1/3">
                <h2 className="text-2xl font-semibold mb-4">Your Watchlist</h2>
                <div className="flex flex-wrap gap-4">
                    {watchlist.length === 0 ? (
                        <p className="text-gray-500">No movies in watchlist yet</p>
                    ) : (
                        watchlist.map((movie) => (
                            <div key={movie.id} className="text-center">
                                <img src={movie.posterPath} alt={movie.title} className="w-24 h-32" />
                                <p>{movie.title}</p>
                                <button
                                    onClick={() => handleRemoveFromWatchlist(movie.id)}
                                    className="text-red-500 mt-2"
                                >
                                    Remove
                                </button>
                            </div>
                        ))
                    )}
                    <div>
                        {showRecommendations && recommendations.length > 0 && (
                            <div className="mt-6">
                                <h2 className="text-2xl font-semibold mb-4">Recommendations</h2>
                                <div className="grid grid-cols-3 gap-6">
                                    {recommendations.map((movie) => (
                                        <div
                                            key={movie.id}
                                            onClick={() => handleRecommendationClick(movie.id)}
                                            className="cursor-pointer bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                                        >
                                            <img
                                                src={movie.posterPath}
                                                alt={movie.title}
                                                className="w-full h-48 object-cover rounded-lg mb-4"
                                            />
                                            <p className="text-center text-lg font-medium text-white">{movie.title}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <button
                        onClick={() => setShowRecommendations(!showRecommendations)}
                        className="mt-4 bg-yellow-500 px-8 py-3 rounded-lg hover:bg-yellow-600"
                    >
                        {showRecommendations ? 'Hide Recommendations' : 'See Recommendations'}
                    </button>
                </div>
            </div>
            <div className="right-section w-1/3">
                <h2 className="text-2xl font-semibold mb-6">Your Rated Movies</h2>
                <ul className="space-y-4">
                    {ratedMovies.map((movie) => (
                        <li
                            key={movie.id}
                            className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer"
                            onClick={() => handleMovieClick(movie.id)}
                        >
                            <div>
                                <h3 className="text-lg font-semibold">{movie.title}</h3>
                                <p className="text-yellow-400">Rating: {movie.rating}/10</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProfilePage;