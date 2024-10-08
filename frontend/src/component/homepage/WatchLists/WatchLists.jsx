import { useEffect, useState } from "react";
import AddWatchList from "./AddWatchList";
import Constant from '../../../util/Constant.js';

export default function WatchLists({ func, reload}) {
    
    const [watchlists, setWatchlists] = useState({});
    const [selectedWatchlist, setSelectedWatchlist] = useState();
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const email = localStorage.getItem('email');

    useEffect(() => {
        const fetchWatchlists = async () => {
            console.log(`${Constant.BASE_URL}/watchlists?email=${email}`);
            try {
                const response = await fetch(`${Constant.BASE_URL}/watchlists?email=${email}`);
                const data = await response.json();

                if (!response.ok) {
                    console.error("Error fetching watchlists:", data.message);
                    return;
                }

                setWatchlists(data);

                const firstWatchlistName = Object.keys(data)[0];
                if (firstWatchlistName) {
                    setSelectedWatchlist(firstWatchlistName);
                    func({ name: firstWatchlistName, items: data[firstWatchlistName].items });
                }
                
            } catch (error) {
                console.error("Error fetching watchlists", error);
            }
        };

        fetchWatchlists();
    }, [isOverlayVisible, reload]);

    // Update parent component when selected watchlist changes
    useEffect(() => {
        if (selectedWatchlist) {
            func({ name: selectedWatchlist, items: watchlists[selectedWatchlist]?.items });
        }
    }, [selectedWatchlist, reload]);

    const handleClick = (watchlistName) => {
        setSelectedWatchlist(watchlistName);
        func({ name: watchlistName, items: watchlists[watchlistName]?.items });
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