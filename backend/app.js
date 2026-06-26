const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const projectRoutes = require('./src/routes/projectRoutes');
const authMiddleware = require('./src/middlewares/authMiddleware');
const userRoutes = require('./src/routes/userRoutes');
const PORT = process.env.PORT;
connectDB();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))

app.use('/api/auth', authRoutes);
app.use('/api/projects', authMiddleware, projectRoutes);
app.use('/api/users', authMiddleware, userRoutes);

app.listen(PORT, () => {
	console.log(`server is running on port ${PORT}`);
})