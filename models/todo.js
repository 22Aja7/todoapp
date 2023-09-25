const mongoose = require('mongoose')
const {Schema} = mongoose;

const todoSchema = new Schema({
	task : String,
	targetDate : Date
});
const Todo = mongoose.model('Todo',todoSchema);

module.exports = Todo;