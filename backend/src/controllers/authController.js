const bcrypt = require('bcrypt');
const User = require('../models/user');
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
			return res.status(400).json({
				message: "User with this email or username already registered"
			});
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = await User.create({
			username, 
			email,
			password: hashedPassword
		});

		return res.status(201).json({
			message: "User registered successfully",
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









module.exports ={
	register
}