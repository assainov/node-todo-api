const {ObjectID} = require('mongodb');
const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

// Todo.deleteMany({})
// .then((result) => {
//     console.log(result);
// });

// Todo.deleteOne({text: 'thank you for attention'})
// .then((doc) => console.log('Removed todo:', doc))
// .catch((err) => console.log(err));

Todo.findOneAndDelete({_id: ObjectID('5bf6af96d9d85320ace0af01')})
.then((doc) => console.log('removed todo:', doc))
.catch((err) => console.log(err));

// Todo.findByIdAndRemove(id).then...

