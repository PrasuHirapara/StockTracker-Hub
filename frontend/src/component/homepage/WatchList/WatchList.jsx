import { useEffect, useState } from "react";
import AddStock from './AddStock.jsx';
import ApexCharts from 'react-apexcharts';

export default function WatchList({ name, items }) {

    const [isOverlay, setIsOverlay] = useState(false);
    const [symbol, setSymbol] = useState("IBM");
    const [timeframe, setTimeframe] = useState("1d");
    const [stockData, setStockData] = useState();
    const [error, setError] = useState('');

    const fetchStockData = async () => {
        try {
            const response = await fetch('http://localhost:5000/stock', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "symbol": symbol,
                    'timeframe': timeframe
                })
            });

            if (!response.ok) {
                setError('Failed to fetch data');
                return;
            }

            const data = await response.json();
            setStockData(data);
        } catch (error) {
            setError('Failed to fetch data');
        }
    };

    useEffect(() => {
        fetchStockData();
    }, [symbol, timeframe]);

    const handleStockClick = (stock) => {
        setSymbol(stock);
    };

    const handleTimeframeClick = (time) => {
        setTimeframe(time);
    };

    const handleOverlayOpen = () => {
        setIsOverlay(true);
    };

    const handleOverlayClose = () => {
        setIsOverlay(false);
    };

    // Prepare data for ApexCharts
    const chartOptions = {
        chart: {
            type: 'line'
        },
        xaxis: {
            categories: stockData ? Object.keys(stockData["Time Series (Daily)"]) : []
        },
        yaxis: {
            title: {
                text: 'Price'
            }
        }
    };

    const chartSeries = [{
        name: 'Close Price',
        data: stockData ? Object.values(stockData["Time Series (Daily)"]).map(day => parseFloat(day["4. close"])) : []
    }];

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
                            <li onClick={() => handleStockClick(stock)} key={index} className="watchlist--stock">
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
            <div className="watchlist--graph">
                <div className="watchlist--graph--draw">
                    {stockData ? (
                        <ApexCharts className="apexgraph" options={chartOptions} series={chartSeries} type="line" height={350} />
                    ) : (
                        <p>{error}</p>
                    )}
                </div>
                <div className="watchlist--graph--timeframe">
                    {["1d", "1m", "6m", "1y", "all"].map((time) => (
                        <div
                            key={time}
                            onClick={() => handleTimeframeClick(time)}
                            className={`timeframe ${timeframe === time ? 'selected' : ''}`}
                        >
                            {time}
                        </div>
                    ))}
                </div>
            </div>
            {isOverlay && (
                <div className="overlay">
                    <div className="overlay--content">
                        <button onClick={handleOverlayClose} className="overlay--close">Close</button>
                        <AddStock />
                    </div>
                </div>
            )}
        </div>
    );
}