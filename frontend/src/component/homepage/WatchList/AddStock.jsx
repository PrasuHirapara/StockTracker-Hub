import { useState } from "react";
import Constant from '../../../util/Constant.js';

export default function AddStock({ name, items, callback }) {
    const email = localStorage.getItem('email');
    const [stockName, setStockName] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [updateParent, setUpdateParent] = useState(1);

    const handleFetchSuggestions = async () => {
        if (stockName.trim() === '') {
            setSuggestions([]);
            return;
        }

        try {
            const response = await fetch(`${Constant.BASE_URL}/stock/suggestion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ symbol: stockName })
            });

            if (!response.ok) {
                console.error("Something went wrong");
                return;
            }

            const data = await response.json();
            setSuggestions(data.bestMatches || []);
            console.log(data);

        } catch (error) {
            console.error(error.message);
        }
    };

    const handleAddStock = async (e) => {
        e.preventDefault();

        if (!stockName.trim()) {
            alert("Enter stock name");
            return;
        }

        if (!email) {
            alert("Email not found. Please login again.");
            return;
        }

        try {
            const response = await fetch(`${Constant.BASE_URL}/watchlists`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    value: {
                        [name]: [...items, stockName.trim()]
                    }
                })
            });

            const responseData = await response.json();

            if (!responseData.success) {
                alert(`Error: ${responseData.message}`);
                return;
            }

            setStockName('');
            setSuggestions([]);
            let newUpdateParent = updateParent + 1;
            setUpdateParent(newUpdateParent);
            callback(newUpdateParent);
            alert("Stock added successfully");

        } catch (e) {
            console.error("Error occurred:", e);
            alert(e.message);
        }
    };

    return (
        <div className="addstock--container">
            <form className="addstock--form" onSubmit={handleAddStock}>
                <label className="addstock--label">Search the stock</label>
                <br />
                <input
                    className="addstock--input"
                    type="text"
                    value={stockName}
                    onChange={(e) => setStockName(e.target.value)}
                    placeholder="Ex: NIFTY 50"
                    autoFocus
                    required
                />
                <div className="addstock--btn">
                    <button type="button" className="auth-btn" onClick={handleFetchSuggestions}>
                        Search
                    </button>
                    <button className="auth-btn" type="submit">Add</button>
                </div>
                
            </form>
            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.slice(0, 5).map((suggestion, index) => (
                        <li key={index} onClick={() => setStockName(suggestion.symbol)}>
                            {suggestion.name} ({suggestion.symbol})
                        </li>
                    ))}
                    {suggestions.length > 5 && (
                        <div className="suggestions-scrollable">
                            {suggestions.slice(5).map((suggestion, index) => (
                                <li key={index + 5} onClick={() => setStockName(suggestion.symbol)}>
                                    {suggestion.name} ({suggestion.symbol})
                                </li>
                            ))}
                        </div>
                    )}
                </ul>
            )}
        </div>
    );
}
