export default function AddWatchList() {

    const handleSubmit = async (e) => {
        e.preventDefault();

    }

    return (
        <>
            <div className="addwatchlist--container">
                <form onSubmit={handleSubmit} className="addwatchlist--form">
                    <label className="addwatchlist--label">Watch list name</label>
                    <input className="addwatchlist--input" type="string" required />
                    <button className="addwatchlist--btn">Create</button>
                </form>
            </div>
        </>
    );
}