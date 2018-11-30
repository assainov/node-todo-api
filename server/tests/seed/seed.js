const {ObjectID} = require('mongodb');
const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');
const jwt = require('jsonwebtoken');


const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const todos = [
    {
        _id: ObjectID('5bf5b691401642285ccbc942'),
        text: "important test 1",
        _creator: userOneId
    }, {
        _id: ObjectID('5bf5b691401642285ccbc943'),
        text: "important test 2",
        completed: true,
        completedAt: 333,
        _creator: userTwoId
    }
];

const users = [{
    _id: userOneId,
    email: 'iliyas.assainov@gmail.com',
    password: 'hello123',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId.toHexString(), access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'azaliya@gmail.com',
    password: 'iloveilyas',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId.toHexString(), access: 'auth'}, 'abc123').toString()
    }]
}];

const populateTodos = (done) => {
    Todo.deleteMany({})
    .then(() => {
        return Todo.insertMany(todos);
    })
    .then(() => done());
}

const populateUsers = (done) => {
    User.deleteMany({})
    .then(() => {
        const userOne = new User(users[0]).save();
        const userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
}

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
};