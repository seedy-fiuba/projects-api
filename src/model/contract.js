const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let contractSchema = new Schema({
	projectId: {type: Number, required: true},
	funderId: {type: Number, required: true},
	currentFundedAmount: {type: Number, required: true},
	txHash: { type: String, required: true}
}, {
	timestamps: true,
	toJSON: {
		transform: function (doc, ret) {
			delete ret.__v;
			delete ret._id;
		}
	}});

module.exports = mongoose.model('Contract', contractSchema);