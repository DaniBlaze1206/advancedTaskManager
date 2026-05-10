const jwt = require('jsonwebtoken');
const User = require('../models/user');


const authorization = async (req, res, next) =>{
	try {
		const authHeader = req.headers.authorization;

		if(!authHeader || !authHeader.startsWith('Bearer ')){
			return res.status(401).json({
				message: "Access denied. No token provided."
			});
		}
		const token = authHeader.split(' ')[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.id).select('-password');
		if(!user){
			return res.status(401).json({
				message: "invalid token. User not found."
			});
		}
		req.user = user;
		next();
	} catch (error) {
		return res.status(500).json({
			message: "Server error",
			error: error.message
		});
	}


	
}

module.exports = authorization;