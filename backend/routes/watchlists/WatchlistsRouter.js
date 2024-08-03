const router = require('express').Router();
const { getWatchlists, createOrUpdateWatchlist, deleteItemFromWatchlist } = require('../../cotroller/watchlists/WatchListsController.js');

router.get('/', getWatchlists);
router.post('/', createOrUpdateWatchlist);
router.delete('/', deleteItemFromWatchlist);

module.exports = router;