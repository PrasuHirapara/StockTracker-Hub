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

  const ans = {
        "Time Series (Daily)": {
            "2024-08-01": {
                "1. open": "277.7200",
                "2. high": "279.1700",
                "3. low": "277.7200",
                "4. close": "278.4600",
                "5. volume": "40217"
            },
            "2024-07-31": {
                "1. open": "277.1900",
                "2. high": "278.0000",
                "3. low": "276.8200",
                "4. close": "277.7200",
                "5. volume": "72383"
            },
            "2024-07-30": {
                "1. open": "276.6400",
                "2. high": "277.9900",
                "3. low": "275.8800",
                "4. close": "277.0700",
                "5. volume": "61171"
            },
            "2024-07-29": {
                "1. open": "276.0200",
                "2. high": "278.2400",
                "3. low": "276.0200",
                "4. close": "276.6400",
                "5. volume": "148282"
            },
            "2024-07-26": {
                "1. open": "271.7500",
                "2. high": "276.2700",
                "3. low": "271.7500",
                "4. close": "276.0200",
                "5. volume": "93782"
            },
            "2024-07-25": {
                "1. open": "271.9900",
                "2. high": "272.0500",
                "3. low": "269.0300",
                "4. close": "270.9900",
                "5. volume": "481129"
            },
            "2024-07-24": {
                "1. open": "271.7900",
                "2. high": "273.0600",
                "3. low": "270.7900",
                "4. close": "271.9900",
                "5. volume": "71113"
            }
        },
    "success": true,
    "symbol": symbol,
    "timeframe": timeframe
  }

  res.status(200).send({data: ans, success: true});

  // if (!symbol || !timeframe) {
  //   return res.status(500).send({ message: `Invalid symbol or timeframe ${symbol}, ${timeframe}`, success: false });
  // }

  // const apiKeys = [
  //   process.env.ALPHA_VANTAGE_API_KEY_1,
  //   process.env.ALPHA_VANTAGE_API_KEY_2,
  //   process.env.ALPHA_VANTAGE_API_KEY_3
  // ];

  // let interval = '';
  // let outputsize = 'full';

  // const validTimeframes = ['1w', '1m', '1y', 'all'];

  // if (!validTimeframes.includes(timeframe)) {
  //   fetchStockData(symbol, 'TIME_SERIES_DAILY', 'full', 'json', apiKeys, (err, data) => {
  //     if (err) {
  //       console.error('Error fetching data:', err);
  //       return res.status(500).json({ error: err.message, success: false });
  //     }

  //     try {
  //       const filteredData = filterData(data, timeframe, 'TIME_SERIES_DAILY');
  //       return res.status(200).json({ data: filteredData, success: true });
  //     } catch (error) {
  //       console.error('Error filtering data:', error);
  //       return res.status(500).json({ error: error.message, success: false });
  //     }
  //   });
  //   return;
  // }

  // switch (timeframe) {
  //   case '1d':
  //     interval = 'TIME_SERIES_INTRADAY&interval=15min';
  //     outputsize = 'compact';
  //     break;
  //   case '1w':
  //   case '1m':
  //   case '1y':
  //   case 'all':
  //     interval = 'TIME_SERIES_DAILY';
  //     break;
  // }

  // fetchStockData(symbol, interval, outputsize, 'json', apiKeys, (err, data) => {
  //   if (err) {
  //     console.error('Error fetching data:', err);
  //     return res.status(500).json({ error: err.message, success: false });
  //   }

  //   try {
  //     const filteredData = filterData(data, timeframe, interval);
  //     return res.status(200).json({ data: filteredData, success: true });
  //   } catch (error) {
  //     console.error('Error filtering data:', error);
  //     return res.status(500).json({ error: error.message, success: false });
  //   }
  // });
};

module.exports = StockController;


module.exports = StockController;