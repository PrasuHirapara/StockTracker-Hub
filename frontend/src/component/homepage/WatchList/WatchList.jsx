export default function WatchList({ name, items }) {

    if (!items || !Array.isArray(items)) {
        return <div>No items available</div>;
    }

    return (
        <div className="watchlist--container">
            <div className="watchlists--details">
                <div className="watchlist--name">
                    {name}
                </div>
                <div className="watchlist--list">
                    <ul>
                        {items.map((stock, index) => (
                            <li key={index} className="watchlist--stock">
                                {stock}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="watchlist--add">
                    <button className="watchlist--add-btn">Add a stock</button>
                </div>
            </div>
            <div className="watchlist--line">
                
            </div>
            <div className="watchlist--graph"></div>
        </div>
    );
}
