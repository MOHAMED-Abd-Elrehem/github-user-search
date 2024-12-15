import { useState } from "react";
import  fetchUserData  from "../services/githubService";

const Search = () => {
    const [searchParams, setSearchParams] = useState({
        username: "",
        location: "",
        minRepos: "",
    });
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prev) => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResults([]);
        setPage(1);

        try {
            const data = await fetchUserData({ ...searchParams, page: 1 });
            setResults(data.items || []);
            setHasMore(data.total_count > data.items.length);
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = async () => {
        setLoading(true);
        try {
            const nextPage = page + 1;
            const data = await fetchUserData({ ...searchParams, page: nextPage });
            setResults((prev) => [...prev, ...data.items]);
            setPage(nextPage);
            setHasMore(data.total_count > results.length + data.items.length);
        } catch {
            setError("Unable to load more users. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <form className="bg-white p-6 rounded shadow-md" onSubmit={handleFormSubmit}>
                <h2 className="text-xl font-bold mb-4">Search GitHub Users</h2>
                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <label className="block font-medium mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={searchParams.username}
                            onChange={handleInputChange}
                            className="w-full border p-2 rounded"
                            placeholder="Enter username"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={searchParams.location}
                            onChange={handleInputChange}
                            className="w-full border p-2 rounded"
                            placeholder="Enter location"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Min Repos</label>
                        <input
                            type="number"
                            name="minRepos"
                            value={searchParams.minRepos}
                            onChange={handleInputChange}
                            className="w-full border p-2 rounded"
                            placeholder="Minimum repositories"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Search
                </button>
            </form>
            {loading && <p className="text-center mt-4">Loading...</p>}
            {error && <p className="text-center mt-4 text-red-500">{error}</p>}
            {results.length > 0 && (
                <div className="mt-6 grid gap-4 grid-cols-1 md:grid-cols-2">
                    {results.map((user) => (
                        <div key={user.id} className="bg-gray-100 p-4 rounded shadow">
                            <img
                                src={user.avatar_url}
                                alt={`${user.login} avatar`}
                                className="w-16 h-16 rounded-full"
                            />
                            <h3 className="mt-2 font-bold">{user.login}</h3>
                            {user.location && <p>Location: {user.location}</p>}
                            <p>Repositories: {user.public_repos || "N/A"}</p>
                            <a
                                href={user.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                View Profile
                            </a>
                        </div>
                    ))}
                </div>
            )}
            {hasMore && !loading && (
                <button
                    onClick={handleLoadMore}
                    className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                    Load More
                </button>
            )}
        </div>
    );
};

export default Search;