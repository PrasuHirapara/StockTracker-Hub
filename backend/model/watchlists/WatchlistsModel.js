const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WatchlistsSchema = new Schema({
  lists: {
    type: Map,
    of: [String],
    default: {}
  }
});

const Watchlists = mongoose.model('Watchlists', WatchlistsSchema);
module.exports = Watchlists;