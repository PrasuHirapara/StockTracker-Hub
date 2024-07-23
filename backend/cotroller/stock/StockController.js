const https = require('https');

const fetchStockData = (symbol, interval, outputsize, datatype, callback) => {
  const url = `https://www.alphavantage.co/query?function=${interval}&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}&outputsize=${outputsize}&datatype=${datatype}`;
  
  https.get(url, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      callback(null, JSON.parse(data));
    });

  }).on("error", (err) => {
    callback(err);
  });
};

const StockController = (req, res) => {
  const { symbol, timeframe } = req.body;
  let interval = '';
  let outputsize = 'full';

  switch (timeframe) {
    case '1d':
      interval = 'TIME_SERIES_INTRADAY&interval=1min';
      outputsize = 'compact';
      break;
    case '1w':
      interval = 'TIME_SERIES_WEEKLY';
      break;
    case '1m':
      interval = 'TIME_SERIES_MONTHLY';
      break;
    case '6m':
      interval = 'TIME_SERIES_DAILY';
      outputsize = 'compact';
      break;
    case '1y':
      interval = 'TIME_SERIES_DAILY';
      break;
    case 'all':
      interval = 'TIME_SERIES_DAILY';
      break;
    default:
      return res.status(400).json({ error: 'Invalid timeframe' });
  }

  fetchStockData(symbol, interval, outputsize, 'json', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch data' });
    } else {
      res.json(data);
    }
  });
};

module.exports = StockController;