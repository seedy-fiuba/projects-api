const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

let Schema = mongoose.Schema;

const pointSchema = new mongoose.Schema({
	type: {
		type: String,
		enum: ['Point'],
		required: true
	},
	coordinates: {
		type: [Number],
		required: true
	}
}, {_id: false  });

let projectSchema = new Schema({
	_id: Number,
	title: { type: String, required: true},
	description: { type: String, required: true},
	category: {type: String, required: true},
	status: {type: String, required: true},
	currentStageId: {type: Number, required: true},
	mediaUrls: {type: [String], required: true},
	stages: {type: [{
		id: {type: Number, required: true},
		track: {type: String, required: true},
		targetAmount: {type: Number, required: true},
	}], required: true},
	fundedAmount: {type: Number, required: true},
	location: {
		type: pointSchema,
		index: '2dsphere' // Create a special 2dsphere index this is required for $near and $geoNear operator
	},
	ownerId: {type: Number, required: true},
	reviewerId: {type: Number, default: null},
	finishDate: {type: Date, required: true},
	hashtags: {type: [String], required: false},
	walletId : {type: Number, required: false},
	totalTargetAmount : {type: Number, required: false},
	isBlocked: {type: Boolean, default: false, required: false}
}, {
	timestamps: true,
	_id: false,
	toJSON: {
		transform: function (doc, ret) {
			ret.id = ret._id;
			delete ret.__v;
			delete ret._id;
		}
	}}); // timestamps adds "createdAt" and "updatedAt" fields

if (process.env.NODE_ENV !== 'test') {
	projectSchema.plugin(AutoIncrement);
}

module.exports = mongoose.model('Project', projectSchema);