const express = require('express');
const todoRoute = express.Router();
const Todouser = require('../models/todouser.js');
const Todo = require('../models/todo.js');
const isLoggedIn = (req,res,next) => {
	if(!req.session.userRegistered)
	{
		return res.redirect('/todo/login');
	}
	else
	{
		next();
	}
}

todoRoute.route("/")
	.get((req, res) => {
		res.render("home");
	});

//for adding new todos
todoRoute.put('/:id/new', async (req, res) => {
	const { id } = req.params;
	const finduser = await Todouser.findById(id);
	finduser.todos.push(req.body.todouser.todos);
	await finduser.save();
	res.redirect("/todo/dashboard");
});


todoRoute.route('/register')
	.get((req, res) => {
		res.render("register");
	})
	.post(async (req, res) => {
		//res.send("registration details got");
		const finduser = await Todouser.findOne(req.body.todouser);

		if (finduser) {
			res.send("<h1>already registered account</h1>");
		}
		else {
			const newuser = new Todouser(req.body.todouser);
			await newuser.save();

			console.log(newuser);
			req.flash('success', 'registered successfully now, login!');
			res.redirect('/todo/login');
			//res.send('<h1>registered!<h1><p><a href="/todo/login">login</a></p>');
		}
	});

todoRoute.route('/login')
	.get((req, res) => {
		res.render("login");
	})
	.post(async (req, res) => {
		//res.send("login details got");
		const finduser = await Todouser.findOne(req.body.todouser);
		if (finduser) {
			console.log(finduser);
			req.session.userRegistered = finduser;
			res.redirect('dashboard');
		}
		else {
			//res.send("needs registration!");
			req.flash('error', 'not registered user!');
			res.redirect('/todo/register');

		}
	});



todoRoute.get('/signout', (req, res) => {
	req.session.userRegistered.username = null;
	res.redirect('/todo/login');
});

todoRoute.get('/dashboard', isLoggedIn, async (req, res) => {
	console.log(req.session.userRegistered);
	//res.send("hello ");

	const username = req.session.userRegistered.username;
	const finduser = await Todouser.findOne({ username });
	//res.send("<h1>hello registered</h1>");
	res.render("dashboard", { username, finduser });
});


todoRoute.delete('/:userid/:taskid/delete', isLoggedIn, async (req, res) => {
	console.log(req.params);
	const {userid} = req.params.userid;
	const {taskid} = req.params.taskid;
	const deleteTodo = await Todouser.findOneAndUpdate(userid,{$pull : {todos : {_id : taskid}}});
	
	console.log('deleted');
	console.log(deleteTodo);
	res.end();
});
module.exports = todoRoute;
/*for deleting todos

db.todousers.updateOne({name : 'ajay'},
{$pull : {todos : {task : 'hello raghav'}}});

//for inserting new todos
db.todousers.updateOne({name : 'ajay'},{$addToSet : {todos : {task :'create a mobile app',
targetDate : ISODate("2023-09-23T00:00:00.000Z"),_id : ObjectId()}}});

//for updating todos

*/