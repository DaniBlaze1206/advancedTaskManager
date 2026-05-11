const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	project: {
		type: mongoose.Schema.types.ObjectId,
		required: true
	},
	position: {
		type: Number,
		requried: true
	}
}, { timestamps: true});



module.exports = mongoose.model('List', listSchema);