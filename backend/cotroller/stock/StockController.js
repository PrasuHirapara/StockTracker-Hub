const https = require('https');

const fetchStockData = (symbol, interval, outputsize, datatype, apiKeys, callback, retryIndex = 0) => {
  if (retryIndex >= apiKeys.length) {
    console.error('All API keys failed to fetch data');
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
          console.error('API limit reached or invalid API key:', jsonData);
          throw new Error('API limit reached or invalid API key');
        }

        callback(null, jsonData);
      } catch (e) {
        console.error('Error parsing JSON data or other issue:', e);
        fetchStockData(symbol, interval, outputsize, datatype, apiKeys, callback, retryIndex + 1);
      }
    });

  }).on("error", (err) => {
    console.error('HTTP request error:', err);
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
    throw new Error(`Time series data not found. ${JSON.stringify(data)}`);
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

  if(!symbol || !timeframe){
    res.status(500).send({message: `invalid symbol or timeframe ${symbol, timeframe}`, success: false })
  }

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
        console.error('Error fetching data:', err);
        return res.status(500).json({ error: err.message, success: false });
      }

      try {
        const filteredData = filterData(data, timeframe, 'TIME_SERIES_DAILY');
        res.status(200).json({data: filteredData, success:true});
      } catch (error) {
        console.error('Error filtering data:', error);
        res.status(500).json({ error: error.message, success: false });
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
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: err.message, success: false });
    }

    try {
      const filteredData = filterData(data, timeframe, interval);
      res.status(200).json({data:filteredData, success: true});
    } catch (error) {
      console.error('Error filtering data:', error);
      res.status(500).json({ error: error.message, success: false });
    }
  });
};

module.exports = StockController;