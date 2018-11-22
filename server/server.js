const express = require('express');
const {ObjectID} = require('mongodb');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text,
        completed: req.body.completed
    });

    todo.save()
    .then((doc) => res.send(doc))
    .catch((err) => res.status(400).send(err));
});

app.get('/todos', (req, res) => {
    Todo.find()
    .then((todos) => {
        res.send({todos})
    })
    .catch((err) => {
        res.status(400).send(err);
    });
});

app.get('/todos/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    
    Todo.findById(id)
    .then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    })
    .catch(err => {
        res.status(400).send(err);
    })
});

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});

module.exports = {app};