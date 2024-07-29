const https = require('https');

const fetchStockData = (symbol, interval, outputsize, datatype, apiKeys, callback, retryIndex = 0) => {
  if (retryIndex >= apiKeys.length) {
    return callback(new Error('All API keys failed to fetch data'));
  }

  const apiKey = apiKeys[retryIndex];
  if (!apiKey) {
    return fetchStockData(symbol, interval, outputsize, datatype, apiKeys, callback, retryIndex + 1);
  }

  const url = `https://www.alphavantage.co/query?function=${interval}&symbol=${symbol}&apikey=${apiKey}&outputsize=${outputsize}&datatype=${datatype}`;

  https.get(url, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      try {
        const jsonData = JSON.parse(data);

        if (jsonData["Error Message"] || jsonData["Note"]) {
          throw new Error('API limit reached or invalid API key');
        }

        callback(null, jsonData);
      } catch (e) {
        fetchStockData(symbol, interval, outputsize, datatype, apiKeys, callback, retryIndex + 1);
      }
    });

  }).on("error", () => {
    fetchStockData(symbol, interval, outputsize, datatype, apiKeys, callback, retryIndex + 1);
  });
};

const filterData = (data, timeframe, interval) => {
  let timeSeriesKey;

  if (interval.includes('TIME_SERIES_INTRADAY')) {
    timeSeriesKey = Object.keys(data).find(key => key.startsWith('Time Series'));
  } else if (interval === 'TIME_SERIES_WEEKLY') {
    timeSeriesKey = 'Weekly Time Series';
  } else if (interval === 'TIME_SERIES_MONTHLY') {
    timeSeriesKey = 'Monthly Time Series';
  } else {
    timeSeriesKey = 'Time Series (Daily)';
  }

  const timeSeries = data[timeSeriesKey];

  if (!timeSeries) {
    throw new Error('Time series data not found');
  }

  const dates = Object.keys(timeSeries);

  let filteredDates;
  const daysMap = {
    '1d': 1,
    '1w': 7,
    '1m': 30,
    '6m': 180,
    '1y': 365,
    '5y': 1825,
    'all': dates.length
  };

  const numberOfDays = daysMap[timeframe] || daysMap['all'];
  filteredDates = dates.slice(0, numberOfDays);

  const filteredData = {};
  filteredDates.forEach(date => {
    filteredData[date] = timeSeries[date];
  });

  return { [timeSeriesKey]: filteredData };
};

const StockController = (req, res) => {
  const { symbol, timeframe } = req.body;
  const apiKeys = [
    process.env.ALPHA_VANTAGE_API_KEY_1,
    process.env.ALPHA_VANTAGE_API_KEY_2,
    process.env.ALPHA_VANTAGE_API_KEY_3
  ];

  let interval = '';
  let outputsize = 'full';

  const validTimeframes = ['1w', '1m', '1y', 'all'];

  if (!validTimeframes.includes(timeframe)) {
    fetchStockData(symbol, 'TIME_SERIES_DAILY', 'full', 'json', apiKeys, (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch data' });
      }

      try {
        const filteredData = filterData(data, timeframe, 'TIME_SERIES_DAILY');
        res.json(filteredData);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    return;
  }

  switch (timeframe) {
    case '1d':
      interval = 'TIME_SERIES_INTRADAY&interval=15min';
      outputsize = 'compact';
      break;
    case '1w':
    case '1m':
    case '1y':
    case 'all':
      interval = 'TIME_SERIES_DAILY';
      break;
  }

  fetchStockData(symbol, interval, outputsize, 'json', apiKeys, (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    try {
      const filteredData = filterData(data, timeframe, interval);
      res.json(filteredData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

module.exports = StockController;