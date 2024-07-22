import { useState } from "react";
import AddStock from './AddStock.jsx';

export default function WatchList({ name, items }) {

    const [isOverlay, setIsOverlay] = useState(false);

    // overlay open
    const handleOverlayOpen = () => {
        setIsOverlay(true);
    }

    // overlay closed
    const handleOverlayClose = () => {
        setIsOverlay(false);
    }

    if (!items || !Array.isArray(items)) {
        return <div>No items available</div>;
    }

    return (
        <div className="watchlist--container">
            <div className="watchlist--details">
                <div className="watchlist--name">
                    {name}
                </div>
                <hr className="watchlist--separator" />
                <div className="watchlist--list">
                    <ol>
                        {items.map((stock, index) => (
                            <li key={index} className="watchlist--stock">
                                {stock}
                            </li>
                        ))}
                    </ol>
                </div>
                <div className="watchlist--add">
                    <button onClick={handleOverlayOpen} className="watchlist--add-btn auth-btn">Add a stock</button>
                </div>
            </div>
            <div className="watchlist--line"></div>
            <div className="watchlist--graph"></div>
            {isOverlay ? <div className="overlay">
                <div className="overlay--content">
                    <button onClick={handleOverlayClose} className="overlay--close">Close</button>
                    <AddStock />
                </div>
            </div> : null}
        </div>
    );
}