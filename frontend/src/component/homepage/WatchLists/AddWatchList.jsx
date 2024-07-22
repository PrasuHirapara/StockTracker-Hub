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

            if (!response.success) {
                alert('Network response was not ok');
            }

            const data = await response.json();
            setWatchlistName("");
        } catch (error) {
            alert("error occured")
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
                    onChange={(e) => setWatchlistName(e.target.value)}
                    required
                />
                <button className="addwatchlist--btn" type="submit">Create</button>
            </form>
        </div>
    );
}