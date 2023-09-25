const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override');
const session = require('express-session')
const cookieParser = require('cookie-parser');
const todoRoute = require('./route/todoroute.js');
//const Todo = require('./models/todo.js');
const Todouser = require('./models/todouser.js');
const flash = require('connect-flash');

mongoose.connect("mongodb+srv://prajapatiajayan88:Mongo88$@cluster0.ox0rvlz.mongodb.net/?retryWrites=true&w=majority")
.then(() => { console.log('database connected') })
	.catch((err) => { console.log(err); })

app.use(express.urlencoded({ extended: true }));
const sessionConfig = { secret: 'secret' };
app.use(session(sessionConfig));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(flash());
app.use(express.static(path.join(__dirname,'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));


app.use((req, res, next) => {
	res.locals.user = req.session.userRegistered;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

app.use('/todo',todoRoute);

app.listen(3000, () => {
	console.log("server is listening at port 3000!");
});