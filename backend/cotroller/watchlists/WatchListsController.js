const Watchlists = require('../../model/watchlists/WatchlistsModel.js');

const getWatchlists = async (req, res) => {
  try {
    const watchlists = await Watchlists.findOne();

    if (!watchlists) {
      return res.status(500).json({ message: "No data", success: false });
    }

    res.status(200).json(watchlists.lists);
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

const createOrUpdateWatchlist = async (req, res) => {

  try {
    const value = req.body;

    if (!value || typeof value !== 'object') {
      return res.status(400).json({ message: 'Valid value is required', success: false });
    }

    let watchlists = await Watchlists.findOne();

    if (!watchlists) {
      watchlists = new Watchlists({ lists: value });
    } else {
      Object.keys(value).forEach(key => {
        watchlists.lists.set(key, value[key]);
      });
    }

    const updatedWatchlists = await watchlists.save();

    res.status(201).json(updatedWatchlists.lists);
    
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
};


module.exports = {
  getWatchlists,
  createOrUpdateWatchlist
};