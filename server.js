var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todosNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('Todo API Root');
});

// GET /todos?completed = true
app.get('/todos', function (req, res) {
	var queryParams = req.query;
	var filteredTodos = todos;
	if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
		filteredTodos = _.where(filteredTodos, {completed: true});
	}else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos, {completed: false});
	}

	res.json(filteredTodos);
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
	var todoid = parseInt(req.params.id, 10);
	var matchedtodo = _.findWhere(todos, {id: todoid}) ;

	if(matchedtodo) {
		res.json(matchedtodo);
	}else{
		res.status(404).send();
	}
});

//POST /todos
app.post('/todos', function (req,res) {
	var body = req.body;
	body = _.pick(body, ['description', 'completed']) ;

	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
		return res.status(400).send();
	}
	body.description = body.description.trim();
	//add id field
	body.id = todosNextId++;

	//push the data into array
	todos.push(body);

	res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedtodo = _.findWhere(todos, {id: todoId});
	if(!matchedtodo) {
		res.status(404).json({"error": "no todo found with id: "+todoId});
	}else {
		todos = _.without(todos, matchedtodo);
		res.json(matchedtodo);
	}
});

//PUT /todos/:id
app.put('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedtodo = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, ['description', 'completed']);
	var validAttributes = {};
	if(!matchedtodo) {
		return res.status(404).send();
	}
	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}else {
		//Never provided atribute no problem here
	}

	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description.trim();
	}else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}

	_.extend(matchedtodo, validAttributes);
	res.json(matchedtodo);
});
 
app.listen(PORT, function () {
	console.log('listening on port '+PORT);
});

// 011 video in 07 folder