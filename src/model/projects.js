const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

let Schema = mongoose.Schema;

let projectSchema = new Schema({
    _id: Number,
    name: { type: String, required: true},
    description: { type: String, required: true}
}, { timestamps: true, _id: false  }); // timestamps adds "createdAt" and "updatedAt" fields

projectSchema.plugin(AutoIncrement);

module.exports = mongoose.model('Project', projectSchema);