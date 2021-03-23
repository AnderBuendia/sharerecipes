const supertest = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../index');
const api = supertest(app);
const UserErrors = require('../enums/user.errors');

describe('User Tests', () => {
  test('New user - Bad email', async () => {
    await api
      .post('/graphql')
      .send({
        query: `
          mutation {
            newUser(input: { 
              name: "Dolan", 
              email: "test@email",
              password: "Test_123"
            })
          }
        `,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors[0].message).toBe(UserErrors.EMAIL_FORMAT);
      });
  });

  test('New user - Email already registered', async () => {
    await api
      .post('/graphql')
      .send({
        query: `
          mutation {
            newUser(input: { 
              name: "prueba201", 
              email: "prueba201@correo.com",
              password: "Ander_123"
            })
          }
        `,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors[0].message).toBe(UserErrors.REGISTERED);
      });
  });

  test('Create new user', async () => {
    await api
      .post('/graphql')
      .send({
        query: `
          mutation {
            newUser(input: { 
              name: "testname", 
              email: "test2@email.com",
              password: "Test_123"
            })
          }
        `,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.newUser).toBe(true);
      });
  });
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});
