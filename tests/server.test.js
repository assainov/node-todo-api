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
        _id: ObjectID('5bf5b691401642285ccbc943'),
        text: "important task 2",
        completed: true,
        completedAt: 333
    }
];

//  Clean the db before each done()
beforeEach((done) => {
    Todo.deleteMany({})
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

    describe('DELETE /todos/:id', () => {
        it('should remove a todo', (done) => {
            request(app)
                .delete('/todos/' + todos[0]._id.toHexString())
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo._id).toBe(todos[0]._id.toHexString());
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    Todo.findById(todos[0]._id.toHexString())
                    .then (todo => {
                        expect(todo).toNotExist();
                        done();
                    })
                    .catch(err => done(err));
                });
        });

        it('should return 404 if todo not found', (done) => {
            let id = '6bf5b691401642285ccbc942'; // Doesn't exist
            request(app)
                .delete('/todos/' + id)
                .expect(404)
                .end(done);
        });

        it('should return 404 if object id is invalid', (done) => {
            let id = 123;
            request(app)
                .delete('/todos/' + id)
                .expect(404)
                .end(done);
        });
    });

    describe('PATCH /todos/:id', () => {
        it('should update the todo', (done) => {
            let hexId = todos[0]._id.toHexString();

            request(app)
                .patch('/todos/' + hexId)
                .send({
                    text: "finish the mvp for nightfixer",
                    completed: true
                })
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    Todo.findById(hexId)
                    .then(doc => {
                        expect(doc.text).toBe('finish the mvp for nightfixer');
                        expect(doc.completed).toBe(true);
                        expect(doc.completedAt).toBeA('number');
                        done();
                    })
                    .catch(err => done(err));
                });
        });

        it('should clear completedAt when todo gets not completed', (done) => {
            let hexId = todos[1]._id.toHexString();

            request(app)
                .patch('/todos/' + hexId)
                .send({
                    text: "good enough task",
                    completed: false
                })
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    Todo.findById(hexId)
                    .then(doc => {
                        expect(doc.text).toBe('good enough task');
                        expect(doc.completed).toBe(false);
                        expect(doc.completedAt).toNotExist();
                        done();
                    })
                    .catch(err => done(err));
                });
        });
    });
});