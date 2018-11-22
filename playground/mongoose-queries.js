const {ObjectID} = require('mongodb');
const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

const id = '5bf2b9423a228736983033add';

// if (!ObjectID.isValid(id)) {
//     console.log('ID is not valid');
// }

// Todo.find({_id: id})
// .then ((todos) => {
//     if (todos.length === 0) {
//         return console.log('Todos not found.');
//     }
//     console.log('Todos:', todos);   
// });

// //  Find one document by some unique value
// Todo.findOne({_id: id})
// .then ((todo) => {
//     if (!todo) {
//         return console.log('Todo not found.');
//     }
//     console.log('Todo:', todo);
// });


//  Find one document by id
// Todo.findById(id)
// .then ((todo) => {
//     if (!todo) {
//         return console.log('ID not found.');
//     }
//     console.log('Todo By Id:', todo);
// })
// .catch((err) => console.log(err));

User.findById(id)
.then(user => {
    if (!user) {
        return console.log('User not found');
    }
    console.log('User email:', user.email);
})
.catch(err => console.log('Invalid user id'));