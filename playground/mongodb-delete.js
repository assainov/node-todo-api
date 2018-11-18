// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    //Delete Many
    // db.collection('Todos').deleteMany({text: 'eat lunch'})
    // .then ((result) => {
    //     console.log(result);
    // });

    //Delete One
    // db.collection('Todos').deleteOne({text: 'eat lunch'})
    // .then ((result) => {
    //     console.log(result);
    // });

    //Find and Delete One
    // db.collection('Todos').findOneAndDelete({completed: false})
    // .then((result) => {
    //     console.log(result);
    // });

    // db.collection('Users').deleteMany({name: 'Ilyas Assainov'})
    // .then((result) => {
    //     console.log(result);
    // });

    db.collection('Users').findOneAndDelete({_id: new ObjectID('5bf06d748c1e3d3af0af634d')})
    .then((result) => {
        console.log(result);
    });

    client.close();
});