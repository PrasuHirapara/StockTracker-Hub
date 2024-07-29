const https = require('https');

const API_KEYS = [
    process.env.ALPHA_VANTAGE_API_KEY_1,
    process.env.ALPHA_VANTAGE_API_KEY_2,
    process.env.ALPHA_VANTAGE_API_KEY_3
];

const fetchSuggestions = (symbol, keyIndex = 0, res) => {
    if (keyIndex >= API_KEYS.length) {
        return res.status(500).json({ message: "All API keys failed.", success: false });
    }

    const URL = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symbol}&apikey=${API_KEYS[keyIndex]}`;

    https.get(URL, (apiRes) => {
        let data = '';

        apiRes.on('data', (chunk) => {
            data += chunk;
        });

        apiRes.on('end', () => {
            try {

                const jsonResponse = JSON.parse(data);

                if (!jsonResponse.bestMatches) {
                    throw new Error("No matches found.");
                }

                const bestMatches = jsonResponse.bestMatches.map(match => ({
                    name: match["2. name"],
                    symbol: match["1. symbol"]
                }));

                return res.status(200).json({ bestMatches, success: true });

            } catch (error) {
                console.error(`Error processing response: ${error.message}`);
                fetchSuggestions(symbol, keyIndex + 1, res);
            }
        });
    }).on('error', (error) => {
        console.error(`HTTPS request error: ${error.message}`);
        fetchSuggestions(symbol, keyIndex + 1, res);
    });
};

const StockSuggestionController = (req, res) => {
    const { symbol } = req.body;

    if (!symbol) {
        return res.status(400).json({ message: "Enter a symbol", success: false });
    }

    fetchSuggestions(symbol, 0, res);
};

module.exports = StockSuggestionController;