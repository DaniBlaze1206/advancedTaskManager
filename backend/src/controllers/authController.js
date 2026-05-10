const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { validateRegister } = require('../validators/authValidator');

const register = async (req, res) => {
	try {
		
		const validation = validateRegister(req.body);

		if(validation !== true) {
			return res.status(400).json({
				errors: validation
			});
		}

		let { username, email, password } = req.body;

		const existingUser = await User.findOne({
			$or: [{ email }, { username }]
		});

		if(existingUser){
			return res.status(409).json({
				message: "User with this email or username already registered"
			});
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = await User.create({
			username: username.toLowerCase(), 
			email: email.toLowerCase(),
			password: hashedPassword
		});
		const token = jwt.sign(
			{ id: user._id},
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		)

		return res.status(201).json({
			message: "User registered successfully",
			token,
			user: {
				id: user._id,
				username: user.username,
				email: user.email
			}
		});

	} catch (error) {
		return res.status(500).json({
			message: "Server error",
			error: error.message
		});
	}
};

const login = async (req, res) => {
	const { identifier, password } = req.body;

	try {
		if(!identifier || !password) {
			return res.status(400).json({
				message: "Identifier and password are required"
			});
		}
		const normalizedIdentifier = identifier.toLowerCase();
		const user = await User.findOne({
			$or: [
				{ email: normalizedIdentifier},
				{ username: normalizedIdentifier}
			]
		});
		if(!user){
			return res.status(401).json({
				message: "Invalid credentials"
			});
		}
		const isMatch = await bcrypt.compare(password, user.password);

		if(!isMatch){
			return res.status(401).json({
				message: "Invalid credentials"
			});
		}
		const token = jwt.sign(
			{ id: user._id},
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		)
		return res.status(200).json({
			message: "Login successful",
			token,
			user: {
				id: user._id,
				username: user.username,
				email: user.email
			}
		});
	} catch (error) {
		return res.status(500).json({
			message: "server error",
			error: error.message
		});
	}
};








module.exports ={
	register,
	login
}