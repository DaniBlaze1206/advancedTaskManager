const Validator = require('fastest-validator');

const v = new Validator();



const registerSchema = {
	username: {
		type: 'string',
		min: '3',
		trim: true,
		lowercase: true,
		empty: false
	},
	email: {
		type: 'email',
		trim: true,
		lowercase: true,
		empty: true
	},
	password: {
		type: 'string',
		min: '8',
		trim: true,
		empty: false
	},
	confirmPassword: {
		type: 'equal',
		field: 'password',
		empty: false
	}
};


const validateRegister = v.compile(registerSchema);

module.exports = {
	validateRegister
}