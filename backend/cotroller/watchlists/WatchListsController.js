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
    const value = req.body;

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

const deleteItemFromWatchlist = async (req, res) => {
  try {
    const { email, listName, item } = req.body;

    if (!email || !listName || !item) {
      return res.status(400).json({ message: "Email, list name, and item are required", success: false });
    }

    const watchlists = await Watchlists.findOne({ email });

    if (!watchlists) {
      return res.status(404).json({ message: "Watchlist not found", success: false });
    }

    if (!watchlists.lists.has(listName)) {
      return res.status(404).json({ message: "List not found", success: false });
    }

    const list = watchlists.lists.get(listName);
    const itemIndex = list.items.indexOf(item);

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in list", success: false });
    }

    list.items.splice(itemIndex, 1);

    if (list.items.length === 0) {
      watchlists.lists.delete(listName);
    } else {
      watchlists.lists.set(listName, list);
    }

    const updatedWatchlists = await watchlists.save();

    res.status(200).json(updatedWatchlists.lists);
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

module.exports = {
  getWatchlists,
  createOrUpdateWatchlist,
  deleteItemFromWatchlist
};