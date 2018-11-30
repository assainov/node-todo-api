const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');
const {User} = require('../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');


beforeEach(populateUsers);
//  Clean the db before each done()
beforeEach(populateTodos);

describe('Server', () => {
    describe('POST /todos', () => {
        it('should return json with text "hello world" and completed at false', (done) => {
            const text = 'hello world';

            request(app)
                .post('/todos')
                .send({text: text})
                .set('Accept', 'application/json')
                .set('x-auth', users[0].tokens[0].token)
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
                .set('x-auth', users[0].tokens[0].token)
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
                .set('x-auth', users[0].tokens[0].token)
                .expect(200)
                .expect((res) => {
                    expect(res.body.todos.length).toBe(1);
                })
                .end(done);
        });
    });

    describe('GET /todos/:id', () => {
        it('should return 404 when passed invalid id', (done) => {
            let id = '123';
            request(app)
                .get('/todos/' + id)
                .set('x-auth', users[0].tokens[0].token)
                .expect(404)
                .end(done);
        });

        it('should return todo document', (done) => {
            let id = todos[1]._id.toHexString();

            request(app)
                .get('/todos/' + id)
                .set('x-auth', users[1].tokens[0].token)
                .expect(200)
                .expect(res => {
                    expect(res.body.todo).toInclude({
                        text: "important test 2"
                    });
                })
                .end(done);
        });

        it('should NOT return todo doc of another user', (done) => {
            let id = todos[1]._id.toHexString();

            request(app)
                .get('/todos/' + id)
                .set('x-auth', users[0].tokens[0].token)
                .expect(404)
                .end(done);
        });

        it('should return 404 when doc is not found', (done) => {
            let id = new ObjectID().toHexString();

            request(app)
                .get('/todos/' + id)
                .set('x-auth', users[0].tokens[0].token)
                .expect(404)
                .end(done);
        });
    });

    describe('DELETE /todos/:id', () => {
        it('should remove a todo', (done) => {
            request(app)
                .delete('/todos/' + todos[0]._id.toHexString())
                .set('x-auth', users[0].tokens[0].token)
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

        it('should NOT delete a todo of another user', (done) => {
            request(app)
                .delete('/todos/' + todos[1]._id.toHexString())
                .set('x-auth', users[0].tokens[0].token)
                .expect(404)
                .end(done);
        });

        it('should return 404 if todo not found', (done) => {
            let id = '6bf5b691401642285ccbc942'; // Doesn't exist
            request(app)
                .delete('/todos/' + id)
                .set('x-auth', users[0].tokens[0].token)
                .expect(404)
                .end(done);
        });

        it('should return 404 if object id is invalid', (done) => {
            let id = 123;
            request(app)
                .delete('/todos/' + id)
                .set('x-auth', users[0].tokens[0].token)
                .expect(404)
                .end(done);
        });
    });

    describe('PATCH /todos/:id', () => {
        it('should update the todo', (done) => {
            let hexId = todos[0]._id.toHexString();

            request(app)
                .patch('/todos/' + hexId)
                .set('x-auth', users[0].tokens[0].token)
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

        it('should NOT update the todo of another user', (done) => {
            let hexId = todos[0]._id.toHexString();

            request(app)
                .patch('/todos/' + hexId)
                .set('x-auth', users[1].tokens[0].token)
                .send({
                    text: "finish the mvp for nightfixer",
                    completed: true
                })
                .expect(404)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    Todo.findById(hexId)
                    .then(doc => {
                        expect(doc.text).toNotBe('finish the mvp for nightfixer');
                        expect(doc.completed).toNotBe(true);
                        expect(doc.completedAt).toNotBeA('number');
                        done();
                    })
                    .catch(err => done(err));
                });
        });

        it('should clear completedAt when todo gets not completed', (done) => {
            let hexId = todos[1]._id.toHexString();

            request(app)
                .patch('/todos/' + hexId)
                .set('x-auth', users[1].tokens[0].token)
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

    describe('GET /users/me', () => {
        it('should return user if authenticated', (done) => {
            request(app)
                .get('/users/me')
                .set('x-auth', users[0].tokens[0].token)
                .expect(200)
                .expect(res => {
                    expect(res.body._id).toBe(users[0]._id.toHexString());
                    expect(res.body.email).toBe(users[0].email);
                })
                .end(done);
        });

        it('should return 401 if not authenticated', (done) => {
            request(app)
                .get('/users/me')
                .expect(401)
                .expect(res => {
                    expect(res.body).toEqual({});
                })
                .end(done);
        });
    });

    describe('POST /users/register', () => {
        it('should create a new user', (done) => {
            const email = 'test@user.com';
            const password = '123456';

            request(app)
                .post('/users/register')
                .send({email, password})
                .expect(200)
                .expect(res => {
                    expect(res.headers['x-auth']).toExist();
                    expect(res.body._id).toExist();
                    expect(res.body.email).toBe(email);
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    User.findOne({email})
                    .then(user => {
                        expect(user).toExist();
                        expect(user).toInclude({email});
                        expect(user.password).toNotBe(password);
                        done();
                    })
                    .catch(err => done(err));
                });
        });

        it('should return validation errors if request is invalid', (done) => {
            const email = 'invalid';
            const password = '333';

            request(app)
                .post('/users/register')
                .send({email, password})
                .expect(400)
                .end(done);
        });

        it('should not create user if email in use', (done) => {
            const email = users[0].email;
            const password = 'easyone';

            request(app)
                .post('/users/register')
                .send({email, password})
                .expect(400)
                .expect(res => {
                    expect(res.body.email).toNotExist();
                    expect(res.body.code).toBe(11000);
                })
                .end(done);
        });
    });

    describe('POST /users/login', () => {
        it('should return authentication token if credentials are correct', (done) => {
            const email = users[0].email;
            const password = users[0].password;

            request(app)
                .post('/users/login')
                .send({email, password})
                .expect(200)
                .expect(res => {
                    expect(res.headers['x-auth']).toExist();
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    User.findOne({email})
                    .then(user => {
                        expect(res.headers['x-auth']).toBe(user.tokens[1].token);
                        done();
                    })
                    .catch(err => done(err));
                });
        });

        it('should reject non-existent email', (done) => {
            const email = 'goga@test.com';
            const password = '123456';

            request(app)
                .post('/users/login')
                .send({email, password})
                .expect(400)
                .end(done);
        });

        it('should reject incorrect password', (done) => {
            const email = users[0].email;
            const password = 'invalid';

            request(app)
                .post('/users/login')
                .send({email, password})
                .expect(400)
                .end(done);
        });
    });

    describe('DELETE /users/me/token', () => {
        it('should delete token on log out', (done) => {
            request(app)
                .delete('/users/me/token')
                .set('x-auth', users[0].tokens[0].token)
                .expect(200)
                .end((err, res) => {
                    expect(err).toNotExist();
                    User.findById(users[0]._id)
                    .then(user => {
                        expect(user).toExist();
                        expect(user.tokens[0]).toNotExist();
                        done();
                    })
                    .catch(err => done(err));
                });

        });
    });
});