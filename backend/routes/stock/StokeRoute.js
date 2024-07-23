const router = require("express").Router();
const StockController = require('../../cotroller/stock/StockController.js')

router.post("/", StockController);

module.exports = router;