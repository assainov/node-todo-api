// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    //findOneAndUpdate
    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5bf1d6232744ed0319830af8')
    // },
    // {
    //     $set: { completed: false }
    // },
    // {
    //     returnOriginal: false
    // })
    // .then((result) => {
    //     console.log(result);
    // });

    db.collection('Users').findOneAndUpdate({_id: new ObjectID('5bf1c70419a73c0868b7cb1f')}, 
    {
        $set: {
            name: 'Ilyas'
        },
        $inc: {
            age: 1
        }
    }, {returnOriginal: false})
    .then((result) => {
        console.log(result);
    });

    client.close();
});