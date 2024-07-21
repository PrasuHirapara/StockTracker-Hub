import { useEffect, useState } from "react";
import AddWatchList from "./AddWatchList";

export default function WatchLists({ func }) {
    const [watchlists, setWatchlists] = useState({
        "default": ["nifty 50", "sensex", "bank nifty"],
        "default2": ["nifty", "sensex", "bank nifty"]
    });

    const [selectedWatchlist, setSelectedWatchlist] = useState("default");
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);

    useEffect(() => {
        func({ name: selectedWatchlist, items: watchlists[selectedWatchlist] });
    }, [selectedWatchlist, watchlists, func]);

    const handleClick = (watchlistName) => {
        setSelectedWatchlist(watchlistName);
        func({ name: watchlistName, items: watchlists[watchlistName] });
    };

    const handleImageClick = () => {
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