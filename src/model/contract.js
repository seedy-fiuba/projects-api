const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let contractSchema = new Schema({
	funderId: {type: Number, required: true},
	currentFundedAmount: {type: Number, required: true},
	txHash: { type: String, required: true}
});

module.exports = mongoose.model('Contract', contractSchema);