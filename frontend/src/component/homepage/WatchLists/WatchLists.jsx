import { useEffect, useState } from "react";
import AddWatchList from "./AddWatchList";

export default function WatchLists({ func }) {
    const [watchlists, setWatchlists] = useState({});
    const [selectedWatchlist, setSelectedWatchlist] = useState();
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);

    // Fetch watchlists from the server when the component mounts
    useEffect(() => {
        const fetchWatchlists = async () => {
            try {

                const response = await fetch('http://localhost:5000/watchlists');
                const data = await response.json();

                setWatchlists(data);

                const firstWatchlistName = Object.keys(data)[0];

                if (firstWatchlistName) {
                    setSelectedWatchlist(firstWatchlistName);
                    func({ name: firstWatchlistName, items: data[firstWatchlistName] });
                }
                
            } catch (error) {
                console.error("Error fetching watchlists", error);
            }
        };

        fetchWatchlists();
    }, [isOverlayVisible]);

    // Update parent component when selected Watchlist changes
    useEffect(() => {
        if (selectedWatchlist) {
            func({ name: selectedWatchlist, items: watchlists[selectedWatchlist] });
        }
    }, [selectedWatchlist]);

    const handleClick = (watchlistName) => {
        setSelectedWatchlist(watchlistName);
        func({ name: watchlistName, items: watchlists[watchlistName] });
    };

    const handleImageClick = async () => {

        setIsOverlayVisible(true);
    };

    const handleOverlayClose = () => {
        setIsOverlayVisible(false);
    };

    return (
        <div className="watchlists--container">
            <div className="watchlists--add">
                <img onClick={handleImageClick} src="./photos/add_icon.png" alt="Add Watchlist" />
            </div>
            <div className="watchlists--watchlist">
                {Object.keys(watchlists).map((watchlistName, index) => (
                    <div
                        className={`watchlists--watchlist--container ${selectedWatchlist === watchlistName ? 'selected' : ''}`}
                        key={index}
                        onClick={() => handleClick(watchlistName)}
                    >
                        {watchlistName}
                    </div>
                ))}
            </div>
            {isOverlayVisible && (
                <div className="overlay">
                    <div className="overlay-content">
                        <button className="overlay-close" onClick={handleOverlayClose}>Close</button>
                        <AddWatchList />
                    </div>
                </div>
            )}
        </div>
    );
}
