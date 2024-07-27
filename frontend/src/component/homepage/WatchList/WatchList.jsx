import { useEffect, useState } from "react";
import AddStock from './AddStock.jsx';
import ApexCharts from 'react-apexcharts';
import Constant from '../../../util/Constant.js';

export default function WatchList({ name, items, callback }) {

    const [isOverlay, setIsOverlay] = useState(false);
    const [timeframe, setTimeframe] = useState("1y");
    const [stockData, setStockData] = useState({});
    const [error, setError] = useState('');
    const [symbol, setSymbol] = useState(items[0]);
    const [selected, setSelected] = useState(items[0]);
    const [stockAdded, setStockAdded] = useState(false);

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const response = await fetch(`${Constant.BASE_URL}/stock`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        symbol,
                        timeframe
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                setStockData(data);
            } catch (error) {
                setError(error.message || 'Failed to fetch data');
            }
        };

        fetchStockData();
    }, [symbol, timeframe, stockAdded]);

    const handleCallback = (val) => {
        setStockAdded(val);
        callback(stockAdded);
    }

    const handleStockClick = (stock) => {
        setSymbol(stock);
        setSelected(stock);
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

    const chartOptions = {
        chart: {
            type: 'candlestick',
            height: 350
        },
        title: {
            text: 'CandleStick Chart',
            align: 'left'
        },
        xaxis: {
            type: 'datetime'
        },
        yaxis: {
            tooltip: {
                enabled: true
            }
        }
    };

    const chartSeries = [{
        name: 'Candlestick',
        data: stockData && stockData["Time Series (Daily)"]
            ? Object.keys(stockData["Time Series (Daily)"]).map(date => {
                const { "1. open": open, "2. high": high, "3. low": low, "4. close": close } = stockData["Time Series (Daily)"][date];
                return {
                    x: new Date(date).getTime(),
                    y: [parseFloat(open), parseFloat(high), parseFloat(low), parseFloat(close)]
                };
            })
            : []
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
                            <li
                                onClick={() => handleStockClick(stock)}
                                key={index}
                                className={`watchlist--stock ${selected === stock ? 'selected' : ''}`}
                            >
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
                        <ApexCharts
                            options={chartOptions}
                            series={chartSeries}
                            type="candlestick"
                            height={300}
                        />
                    ) : (
                        <p>{error}</p>
                    )}
                </div>
                <div className="watchlist--graph--timeframe">
                    {["1d", "1w", "1m", "6m", "1y", "all"].map((time) => (
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
                        <AddStock name={name} items={items} callback={handleCallback} />
                    </div>
                </div>
            )}
        </div>
    );
}
