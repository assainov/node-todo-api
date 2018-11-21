const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server/server');
const {Todo} = require('../server/models/todo');

const todos = [
    {
        _id: ObjectID('5bf5b691401642285ccbc942'),
        text: "important task 1"
    }, {
        text: "important task 2"
    }
];

//  Clean the db before each done()
beforeEach((done) => {
    Todo.remove({})
    .then(() => {
        return Todo.insertMany(todos);
    })
    .then(() => done());
});

describe('Server', () => {
    describe('POST /todos', () => {
        it('should return json with text "hello world" and completed at false', (done) => {
            const text = 'hello world';

            request(app)
                .post('/todos')
                .send({text: text})
                .set('Accept', 'application/json')
                .expect(200)
                .expect((res) => {
                    expect(res.body).toInclude({
                        text: 'hello world',
                        completed: false
                    });
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    Todo.find({text})
                    .then((todos) => {
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                        done();
                    })
                    .catch((err) => done(err));
                });
        });

        it('should not create new todo with invalid data', (done) => {
            request(app)
                .post('/todos')
                .send({})
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    Todo.find()
                    .then(todos => {
                        expect(todos.length).toBe(2);
                        done();
                    })
                    .catch(err => done(err));
                });
        });
    });

    describe('GET /todos', () => {
        it('should get all todos from the db', (done) => {
            request(app)
                .get('/todos')
                .expect(200)
                .expect((res) => {
                    expect(res.body.todos.length).toBe(2);
                })
                .end(done);
        });
    });

    describe('GET /todos/:id', () => {
        it('should return 404 when passed invalid id', (done) => {
            let id = '123';
            request(app)
                .get('/todos/' + id)
                .expect(404)
                .end(done);
        });

        it('should return todo document', (done) => {
            let id = '5bf5b691401642285ccbc942';

            request(app)
                .get('/todos/' + id)
                .expect(200)
                .expect(res => {
                    expect(res.body.todo).toInclude({
                        text: "important task 1"
                    });
                })
                .end(done);
        });

        it('should return 404 when doc is not found', (done) => {
            let id = new ObjectID().toHexString();

            request(app)
                .get('/todos/' + id)
                .expect(404)
                .end(done);
        });
    });
});