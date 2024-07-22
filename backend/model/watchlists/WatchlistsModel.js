const mongoose = require('mongoose');

const watchlistsSchema = mongoose.Schema({
    lists: {
        type: Map,
        of: [String],
        default: [],
    }
});

const Watchlists = mongoose.model('watchlists', watchlistsSchema);

module.exports = Watchlists;