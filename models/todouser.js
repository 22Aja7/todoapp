const mongoose = require('mongoose');
const {Schema} = mongoose;

const todouserSchema = new Schema({
	name : String,
	username : {type:String,required:true},
	pwd : {type:String,required:true},
	todos : [
	{
		task:String,
		targetDate:Date
	}
	]
});
const Todouser = mongoose.model('Todouser',todouserSchema);

module.exports = Todouser;