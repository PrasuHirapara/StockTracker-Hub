const router = require('express').Router();
const { getWatchlists, createOrUpdateWatchlist } = require('../../cotroller/watchlists/WatchListsController.js');

router.get('/', getWatchlists);
router.post('/', createOrUpdateWatchlist);

module.exports = router;