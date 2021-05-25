const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

let Schema = mongoose.Schema;

let projectSchema = new Schema({
	_id: Number,
	title: { type: String, required: true},
	description: { type: String, required: true},
	category: {type: String, required: true},
	status: {type: String, required: true},
	mediaUrls: {type: [String], required: true},
	targetAmount: {type: Number, required: true},
	fundedAmount: {type: Number, required: true},
	location: {
		type: {
			type: String,
			enum: ['Point'], // 'location.type' must be 'Point'
			required: true
		},
		coordinates: {
			type: [Number],
			required: true
		},
		index: '2dsphere' // Create a special 2dsphere index this is required for $near and $geoNear operator
	},
	hashtags: {type: [String], required: false},

}, { timestamps: true, _id: false  }); // timestamps adds "createdAt" and "updatedAt" fields

if (process.env.SCOPE === 'PROD') {
	projectSchema.plugin(AutoIncrement);
}

module.exports = mongoose.model('Project', projectSchema);