import NavBar from './NavBar.jsx';
import WatchLists from './WatchLists.jsx';
import WatchList from './WatchList.jsx';

export default function Home() {
    return (
        <>
            <div id="homepage" className="homepage--container">
                <NavBar />
                <WatchLists />
                <WatchList />
            </div>
        </>
    );
}