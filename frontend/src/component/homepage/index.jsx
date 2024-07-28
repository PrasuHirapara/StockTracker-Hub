import React, { useCallback, useState } from 'react';
import NavBar from './NavBar.jsx';
import WatchLists from './WatchLists/WatchLists.jsx';
import WatchList from './WatchList/WatchList.jsx';

export default function Home() {
    const [watchlist, setWatchlist] = useState({ name: '', items: [] });
    const [stockAdded, setStockAdded] = useState(false);

    const handleWatchlistChange = useCallback((data) => {
        setWatchlist(data);
    });

    const callbackFunction = (val) => {
        setStockAdded(val);
        console.log(setStockAdded);
    }

    return (
        <div id="homepage" className="homepage--container">
            <NavBar />
            <WatchLists func={handleWatchlistChange} reload={stockAdded}/>
            <WatchList name={watchlist.name} items={watchlist.items} callback={callbackFunction}/>
        </div>
    );
}
