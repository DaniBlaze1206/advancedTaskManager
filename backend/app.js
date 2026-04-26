const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const PORT = process.env.PORT;
connectDB();
app.use(express.json());
app.use(express.urlencoded());



app.listen(PORT, () => {
	console.log(`server is running on port ${PORT}`);
})