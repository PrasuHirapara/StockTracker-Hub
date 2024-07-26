const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListSchema = new Schema({
  items: [String]
}, { _id: false });

const WatchlistsSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  lists: {
    type: Map,
    of: ListSchema,
    default: {}
  }
});

const Watchlists = mongoose.model('Watchlists', WatchlistsSchema);
module.exports = {Watchlists};