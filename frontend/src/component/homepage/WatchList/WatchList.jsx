import { useEffect, useState } from "react";
import AddStock from './AddStock.jsx';
import ApexCharts from 'react-apexcharts';

// Default static data for debugging
const defaultStockData = {
    "Meta Data": {
        "1. Information": "Daily Prices (open, high, low, close) and Volumes",
        "2. Symbol": "RELIANCE.BSE",
        "3. Last Refreshed": "2024-07-22",
        "4. Output Size": "Full size",
        "5. Time Zone": "US/Eastern"
    },
    "Time Series (Daily)": {
        "2024-07-22": {
            "1. open": "3070.1500",
            "2. high": "3070.6000",
            "3. low": "2998.8000",
            "4. close": "3002.0000",
            "5. volume": "190060"
        },
        "2024-07-19": {
            "1. open": "3175.0000",
            "2. high": "3179.0000",
            "3. low": "3104.1500",
            "4. close": "3109.5000",
            "5. volume": "573860"
        },
        "2024-07-18": {
            "1. open": "3152.0000",
            "2. high": "3186.6000",
            "3. low": "3116.1000",
            "4. close": "3170.3500",
            "5. volume": "156250"
        },
        "2024-07-16": {
            "1. open": "3192.4000",
            "2. high": "3200.0000",
            "3. low": "3138.1500",
            "4. close": "3151.4500",
            "5. volume": "59160"
        },
        "2024-07-15": {
            "1. open": "3200.1500",
            "2. high": "3211.4500",
            "3. low": "3171.0000",
            "4. close": "3193.7000",
            "5. volume": "159250"
        },
        "2024-07-12": {
            "1. open": "3172.8000",
            "2. high": "3209.9500",
            "3. low": "3148.6500",
            "4. close": "3193.4500",
            "5. volume": "722290"
        },
        "2024-07-11": {
            "1. open": "3178.0000",
            "2. high": "3207.8500",
            "3. low": "3140.6500",
            "4. close": "3163.5000",
            "5. volume": "103180"
        },
        "2024-07-10": {
            "1. open": "3185.0000",
            "2. high": "3195.0000",
            "3. low": "3126.7500",
            "4. close": "3166.9000",
            "5. volume": "70910"
        },
        "2024-07-09": {
            "1. open": "3199.9500",
            "2. high": "3201.1000",
            "3. low": "3162.0500",
            "4. close": "3180.1500",
            "5. volume": "167560"
        },
        "2024-07-08": {
            "1. open": "3179.9000",
            "2. high": "3217.9000",
            "3. low": "3165.0000",
            "4. close": "3202.1000",
            "5. volume": "191870"
        },
        "2024-07-05": {
            "1. open": "3103.8000",
            "2. high": "3197.6500",
            "3. low": "3096.1000",
            "4. close": "3180.0500",
            "5. volume": "758980"
        },
        "2024-07-04": {
            "1. open": "3116.9500",
            "2. high": "3134.5000",
            "3. low": "3102.3000",
            "4. close": "3107.9000",
            "5. volume": "132480"
        },
        "2024-07-03": {
            "1. open": "3130.3500",
            "2. high": "3149.5000",
            "3. low": "3085.2000",
            "4. close": "3105.3000",
            "5. volume": "171680"
        },
        "2024-07-02": {
            "1. open": "3133.8000",
            "2. high": "3150.0000",
            "3. low": "3113.3500",
            "4. close": "3132.3000",
            "5. volume": "157110"
        },
        "2024-07-01": {
            "1. open": "3129.9500",
            "2. high": "3157.5500",
            "3. low": "3110.4000",
            "4. close": "3120.3500",
            "5. volume": "187610"
        },
        "2024-06-28": {
            "1. open": "3060.9500",
            "2. high": "3161.4500",
            "3. low": "3060.9500",
            "4. close": "3131.8500",
            "5. volume": "1030000"
        }
    }
};

export default function WatchList({ name, items }) {

    const [isOverlay, setIsOverlay] = useState(false);
    const [symbol, setSymbol] = useState("IBM");
    const [timeframe, setTimeframe] = useState("1d");
    const [stockData, setStockData] = useState(defaultStockData);
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