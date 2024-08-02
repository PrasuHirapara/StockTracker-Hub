require("dotenv").config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db')
const cors = require('cors');
const AuthRouter = require("./routes/auth/AuthRouter.js");
const WatchlistsRouter = require('./routes/watchlists/WatchlistsRouter.js');
const StokeRouter = require('./routes/stock/StokeRoute.js');
const app = express();

// db connection
connectDB();

// Middleware for parsing request bodies
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use('/auth', AuthRouter);
app.use('/watchlists', WatchlistsRouter);
app.use('/stock', StokeRouter);

// start server
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is listening to port : ${port}`);
});