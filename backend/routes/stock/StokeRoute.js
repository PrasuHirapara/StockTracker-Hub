const router = require("express").Router();
const StockController = require('../../cotroller/stock/StockController.js');
const StockSuggetionController = require('../../cotroller/stock/StockSuggetionController.js');

router.post("/", StockController);
router.post("/suggestion", StockSuggetionController);

module.exports = router;