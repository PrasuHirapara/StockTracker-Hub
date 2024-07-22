import { useState } from "react";

export default function AddWatchList() {
    const [watchlistName, setWatchlistName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await fetch('http://localhost:5000/watchlists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [watchlistName]: [] }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error ${errorData}`);

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
                <label className="addwatchlist--label">Watch list name</label>
                <input
                    className="addwatchlist--input"
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