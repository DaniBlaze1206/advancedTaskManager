const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const PORT = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded());



app.listen(PORT, () => {
	console.log(`server is running on port ${PORT}`);
})