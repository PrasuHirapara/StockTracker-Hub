// /controllers/watchlistsController.js
const Watchlists = require('../../model/watchlists/WatchlistsModel.js');
const Joi = require('joi');

const listSchema = Joi.object().pattern(Joi.string(), Joi.array().items(Joi.string()));

const getWatchlists = async (req, res) => {
  try {
    const watchlists = await Watchlists.findOne();
    if (!watchlists) return res.json({});
    res.json(watchlists.lists);
  } catch (err) {
    res.status(500).json({ message: err, success: false });
  }
};

const createOrUpdateWatchlist = async (req, res) => {
  const { error, value } = listSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message, success:false});

  try {
    let watchlists = await Watchlists.findOne();
    if (!watchlists) {
      watchlists = new Watchlists({ lists: value });
    } else {
      watchlists.lists = { ...watchlists.lists.toObject(), ...value };
    }
    const updatedWatchlists = await watchlists.save();
    res.status(201).json(updatedWatchlists.lists);
  } catch (err) {
    res.status(400).json({ message: err.message, success: false});
  }
};

module.exports = {
    getWatchlists,
    createOrUpdateWatchlist
}