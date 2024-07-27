import { useState } from "react";
import Constant from '../../../util/Constant.js';

export default function AddStock({ name, items, callback }) {
    const [stockName, setStockName] = useState('');
    const email = localStorage.getItem('email');

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

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
                return;
            }

            setStockName('');
            callback(true);
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
                <button className="addstock--btn auth-btn" type="submit">Add</button>
            </form>
        </div>
    );
}
