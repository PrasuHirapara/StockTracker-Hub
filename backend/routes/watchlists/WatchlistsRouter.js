const router = require('express').Router();
const { getWatchlists, createOrUpdateWatchlist } = require('../../cotroller/watchlists/WatchListsController');
const validateMiddleware = require('../../middleware/watchlists/WatchlistsValidation.js');
const Joi = require('joi');

const listSchema = Joi.object().pattern(Joi.string(), Joi.array().items(Joi.string()));

router.get('/', getWatchlists);
router.post('/', validateMiddleware(listSchema), createOrUpdateWatchlist);

module.exports = router;