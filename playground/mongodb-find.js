// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    // db.collection('Todos').find({_id: new ObjectID('5bf1c8df2744ed031983088a')}).toArray()
    // .then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // })
    // .catch((err) => {
    //     console.log('Unable to fetch todos', err);
    // });


    // db.collection('Todos').find().count()
    // .then((count) => {
    //     console.log(`Todos count: ${count} `);
    // })
    // .catch((err) => {
    //     console.log('Unable to fetch todos', err);
    // });


    db.collection('Users').find({name: 'Ilyas Assainov'}).count()
    .then((count) => {
        console.log(`Users with name Ilyas Assainov: ${count} `);
    })
    .catch((err) => {
        console.log('Unable to fetch user count', err);
    });

    db.collection('Users').find({name: 'Ilyas Assainov'}).toArray()
    .then((docs) => {
        console.log(JSON.stringify(docs, undefined, 2));
    })
    .catch((err) => {
        console.log('Unable to fetch users', err)
    });


    client.close();
});