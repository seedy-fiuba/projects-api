const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const mongoosePaginate = require('mongoose-paginate-v2');

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

if (process.env.NODE_ENV !== 'test') {
	autoIncrement.initialize(mongoose.connection);
	contractSchema.plugin(autoIncrement.plugin, 'User');
	contractSchema.plugin(mongoosePaginate);
}

module.exports = mongoose.model('Contract', contractSchema);