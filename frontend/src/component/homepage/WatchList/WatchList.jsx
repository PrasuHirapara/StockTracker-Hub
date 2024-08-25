import { useEffect, useState } from "react";
import AddStock from './AddStock.jsx';
import ApexCharts from 'react-apexcharts';
import Constant from '../../../util/Constant.js';

export default function WatchList({ name, items, callback }) {
    const validTimeframe = ['1m', '6m', '1y','all'];

    const [isOverlay, setIsOverlay] = useState(false);
    const [timeframe, setTimeframe] = useState("1y");
    const [stockData, setStockData] = useState({});
    const [error, setError] = useState('');
    const [symbol, setSymbol] = useState(null);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);
    const [stockAdded, setStockAdded] = useState(false);

    useEffect(() => {
        if (items && items.length > 0) {
            setSymbol(items[0]);
            setSelected(items[0]);
        }
    }, [items]);

    useEffect(() => {
        if (symbol && timeframe) {
            const fetchStockData = async () => {
                setLoading(true);
                setError('');
                try {
                    // Check local storage for the stock data
                    const storedStockData = JSON.parse(localStorage.getItem('stockData')) || {};
                    const stockDataForSymbol = storedStockData[symbol]?.[timeframe];
    
                    if (stockDataForSymbol) {
                        setStockData(stockDataForSymbol);
                    } else {
                        // Fetch data from the server if not found in local storage
                        const response = await fetch(`${Constant.BASE_URL}/stock`, {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ symbol, timeframe })
                        });
    
                        const data = await response.json();
    
                        if (!response.ok) {
                            throw new Error(data.message || 'Failed to fetch data');
                        }
    
                        // Store fetched data in local storage
                        const updatedStockData = {
                            ...storedStockData,
                            [symbol]: {
                                ...storedStockData[symbol],
                                [timeframe]: data.data
                            }
                        };
                        localStorage.setItem('stockData', JSON.stringify(updatedStockData));
    
                        setStockData(data.data);
                    }
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };
    
            fetchStockData();
        }
    }, [symbol, timeframe, stockAdded]);
    

    const handleCallback = (val) => {
        setStockAdded(val);
        callback(val);
    };

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

    const handleDeleteStock = async (stock) => {
        const email = localStorage.getItem("email");
        const listName = name;
        const item = stock
        try {
            const response = await fetch(`${Constant.BASE_URL}/watchlists`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, listName, item })
            });

            if (!response.ok) {
                throw new Error('Failed to delete stock');
            }

            const updatedItems = items.filter(item => item !== stock);
            callback(updatedItems);
        } catch (error) {
            setError(error.message);
        }
    };

    const chartOptions = {
        chart: {
            type: 'candlestick',
            height: 350,
            background: 'var(--secondary)',
            foreColor: 'var(--tertiary)'
        },
        title: {
            text: `${symbol}`,
            align: 'left',
            style: {
                color: 'var(--tertiary)'
            }
        },
        xaxis: {
            type: 'datetime',
            style: {
                color: 'var(--tertiary)'
            }
        },
        yaxis: {
            tooltip: {
                enabled: true
            },
            style: {
                color: 'var(--tertiary)'
            }
        },
        tooltip: {
            theme: 'dark'
        },
    };

    const chartSeries = [{
        name: 'Candlestick',
        data: stockData && stockData["Time Series (Daily)"]
            ? Object.keys(stockData["Time Series (Daily)"]).map(date => {
                const { "1. open": open, "2. high": high, "3. low": low, "4. close": close } = stockData["Time Series (Daily)"][date];

                const openNum = parseFloat(open);
                const highNum = parseFloat(high);
                const lowNum = parseFloat(low);
                const closeNum = parseFloat(close);

                if (isNaN(openNum) || isNaN(highNum) || isNaN(lowNum) || isNaN(closeNum)) {
                    console.warn(`Invalid data for date ${date}:`, { open, high, low, close });
                    return null;
                }

                return {
                    x: new Date(date).getTime(),
                    y: [openNum, highNum, lowNum, closeNum]
                };
            }).filter(dataPoint => dataPoint !== null)
            : []
    }];

    if (!items || !Array.isArray(items)) {
        return <div>No items available</div>;
    }

    return (
        <div className="watchlist--container">
            <div className="watchlist--details">
                <div className="watchlist--name">{name}</div>
                <hr className="watchlist--separator" />
                <div className="watchlist--list">
                    <ol>
                        {items.map((stock, index) => (
                            <div
                                key={index}
                                onClick={() => handleStockClick(stock)}
                                className={`watchlist--list--container ${selected === stock ? 'selected' : ''}`}>
                                <li
                                    className={`watchlist--stock`}
                                >
                                    {stock}
                                </li>
                                <img
                                    onClick={() => handleDeleteStock(stock)}
                                    src="./photos/minus_icon.png" 
                                    alt="remove watchlist" />
                            </div>
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
                    {loading ? (
                        <p>Loading data...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : (
                        <ApexCharts
                            options={chartOptions}
                            series={chartSeries}
                            type="candlestick"
                            height={300}
                        />
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
