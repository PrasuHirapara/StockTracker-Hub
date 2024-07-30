import { useState } from "react";
import Constant from '../../../util/Constant.js';

export default function AddWatchList() {

    const [watchlistName, setWatchlistName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const email = localStorage.getItem('email');

            if (!email) {
                alert("Email not found in local storage");
                return;
            }

            if (!watchlistName.trim()) {
                alert("Watchlist name cannot be empty");
                return;
            }
            const response = await fetch(`${Constant.BASE_URL}/watchlists`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    value: {
                        [watchlistName.trim()]: []
                    }
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
                return;
            }

            setWatchlistName("");
            alert("Watchlist created successfully");
        } catch (error) {
            console.error("Error occurred:", error);
            alert("An error occurred");
        }
    };

    return (
        <div className="addwatchlist--container">
            <form onSubmit={handleSubmit} className="addwatchlist--form">
                <label className="addwatchlist--label" htmlFor="watchlistName">Watchlist name</label>
                <input
                    className="addwatchlist--input"
                    id="watchlistName"
                    type="text"
                    value={watchlistName}
                    autoFocus
                    onChange={(e) => setWatchlistName(e.target.value)}
                    required
                />
                <button className="addwatchlist--btn" type="submit">Create</button>
            </form>
        </div>
    );
}