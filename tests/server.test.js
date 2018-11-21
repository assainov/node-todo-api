const expect = require('expect');
const request = require('supertest');

const {app} = require('../server/server');
const {Todo} = require('../server/models/todo');

//  Clean the db before each done()
beforeEach((done) => {
    Todo.remove({})
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

                    Todo.find()
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
                        expect(todos.length).toBe(0);
                        done();
                    })
                    .catch(err => done(err));
                });
        });
    });
});