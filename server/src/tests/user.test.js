const UserErrors = require('../enums/user.errors');
const { api, mongoose, server, User } = require('./index');

let token;

describe('User Tests', () => {
  beforeAll(async () => {
    await User.deleteMany({
      email: { $in: ['test2@email.com'] },
    });
  });

  test('Register new user - Bad email', async () => {
    try {
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
    } catch (error) {
      console.log(error);
    }
  });

  test('Register new user - Email already registered', async () => {
    try {
      await api
        .post('/graphql')
        .send({
          query: `
          mutation {
            newUser(input: {
              name: "prueba201",
              email: "prueba201@email.com",
              password: "Ander_123"
            })
          }
        `,
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.errors[0].message).toBe(UserErrors.REGISTERED);
        });
    } catch (error) {
      console.log(error);
    }
  });

  test('Register new user - Bad password', async () => {
    try {
      await api
        .post('/graphql')
        .send({
          query: `
        mutation {
          newUser(input: {
            name: "Dolan",
            email: "test@email.com",
            password: "Ander12"
          })
        }
      `,
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.errors[0].message).toBe(UserErrors.PASSWORD);
        });
    } catch (error) {
      console.log(error);
    }
  });

  test('Register new user', async () => {
    try {
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
          token = body.data.newUser;
          expect(body.data.newUser).not.toEqual(null);
        });
    } catch (error) {
      console.log(error);
    }
  });

  test('Confirm new user - Bad Token', async () => {
    await api
      .post('/graphql')
      .send({
        query: `
            mutation {
              confirmUser(input: {
                token: "232334234fdssd"
              })
            }
          `,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.confirmUser).toBe(null);
      });
  });

  test('Confirm new user', async () => {
    await api
      .post('/graphql')
      .send({
        query: `
          mutation {
            confirmUser(input: {
              token: "${token}"
            })
          }
        `,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.confirmUser).toBe(true);
      });
  });

  test('Forgot Password - Bad Email', async () => {
    await api
      .post('/graphql')
      .send({
        query: `
      mutation {
        forgotPassword(input: {
          email: "dolan@email.com",
        })
      }
    `,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors[0].message).toBe(UserErrors.EMAIL_NOT_FOUND);
      });
  });

  test('Forgot Password', async () => {
    await api
      .post('/graphql')
      .send({
        query: `
      mutation {
        forgotPassword(input: {
          email: "test2@email.com",
        })
      }
    `,
      })
      .expect(200)
      .expect(({ body }) => {
        token = body.data.forgotPassword;
        expect(body.data.forgotPassword).not.toEqual(null);
      });
  });

  test('Valid Password', async () => {
    await api
      .post('/graphql')
      .send({
        query: `
      mutation {
        resetPassword(input: {
          token: "${token}",
          password: "Test_1234"
        })
      }
    `,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.resetPassword).toBe(true);
      });
  });

  test('Authenticate user - Bad email', async () => {
    await api
      .post('/graphql')
      .send({
        query: `
        mutation {
          authenticateUser(input: {
            email: "prueba201@email",
            password: "Test23"
          }) {
            user {
              _id
            }
          }
        }
      `,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors[0].message).toBe(UserErrors.EMAIL_FORMAT);
      });
  });

  test('Authenticate user - Bad password', async () => {
    await api
      .post('/graphql')
      .send({
        query: `
        mutation {
          authenticateUser(input: {
            email: "prueba201@email.com",
            password: "Test_12"
          }) {
            user {
              _id
            }
          }
        }
      `,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors[0].message).toBe(UserErrors.PASSWORD);
      });
  });

  test('Authenticate user', async () => {
    await api
      .post('/graphql')
      .send({
        query: `
      mutation {
        authenticateUser(input: {
          email: "test2@email.com",
          password: "Test_1234"
        }) {
          user {
            _id
          }
          token
        }
      }
    `,
      })
      .expect(200)
      .expect(({ body }) => {
        token = body.data.authenticateUser.token;
        expect(body.data.authenticateUser).not.toEqual(null);
      });
  });

  test('Update user - Bad Email', async () => {
    await api
      .post('/graphql')
      .send({
        query: `
      mutation {
        updateUser(input: {
          email: "test@email.com",
          password: "Test_1234",
          name: "NewName"
        }) {
          name
        }
      }
    `,
      })
      .expect(200)
      .expect((response) => {
        expect(response.body.errors[0].message).toBe(UserErrors.USER_NOT_FOUND);
      });
  });

  test('Update user', async () => {
    await api
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
      mutation {
        updateUser(input: {
          email: "test2@email.com",
          password: "Test_1234",
          name: "NewName"
        }) {
          name
        }
      }
    `,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.updateUser.name).toBe('NewName');
      });
  });

  test('Update user password', async () => {
    await api
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
      mutation {
        updateUserPassword(input: {
          email: "test2@email.com",
          password: "Test_1234",
          confirmPassword: "Test_12345"
        })
      }
    `,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.updateUserPassword).toBe(true);
      });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.close();
});
