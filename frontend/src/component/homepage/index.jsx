import React, { useState } from 'react';
import NavBar from './NavBar.jsx';
import WatchLists from './WatchLists/WatchLists.jsx';
import WatchList from './WatchList/WatchList.jsx';

export default function Home() {
    const [watchlist, setWatchlist] = useState({ name: '', items: [] });

    const handleWatchlistChange = (data) => {
        setWatchlist(data);
    };

    return (
        <div id="homepage" className="homepage--container">
            <NavBar />
            <WatchLists func={handleWatchlistChange} />
            <WatchList name={watchlist.name} items={watchlist.items} />
        </div>
    );
}
