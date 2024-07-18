require("dotenv").config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db')
const app = express();

connectDB();

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes


// start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is listening to port : ${port}`);
});