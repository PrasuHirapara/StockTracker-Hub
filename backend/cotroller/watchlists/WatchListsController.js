const joi = require('joi');
// const { watchlistSchema } = require('../../middleware/watchlists/watchlistsValidation.js');
const { Watchlists } = require('../../model/watchlists/WatchlistsModel.js');

const getWatchlists = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required", success: false });
    }

    const watchlists = await Watchlists.findOne({ email });

    if (!watchlists) {
      return res.status(404).json({ message: "No data", success: false });
    }

    res.status(200).json(watchlists.lists);
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

const createOrUpdateWatchlist = async (req, res) => {
  try {
    // const { error, value } = watchlistSchema.validate(req.body);

    // if (error) {
    //   return res.status(400).json({ message: error.details[0].message, success: false });
    // }

    const { email, value: lists } = value;

    let watchlists = await Watchlists.findOne({ email });

    if (!watchlists) {
      watchlists = new Watchlists({
        email,
        lists: new Map()
      });
    }

    Object.keys(lists).forEach(key => {
      if (Array.isArray(lists[key])) {
        watchlists.lists.set(key, { items: lists[key] });
      }
    });

    const updatedWatchlists = await watchlists.save();
    res.status(201).json(updatedWatchlists.lists);
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

module.exports = {
  getWatchlists,
  createOrUpdateWatchlist
};