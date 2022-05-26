import {
  CommonErrors,
  UserErrors,
} from '@Shared/infrastructure/enums/errors.enum';
import { api, User } from './index';

let token: string;

describe('User Tests', () => {
  test('Register new user - Bad email', async () => {
    await api
      .post('/graphql')
      .send({
        query: `
          mutation {
            create_user(input: {
              name: "Dolan",
              email: "test@email",
              password: "Test_123"
            }) {
              success
            }
          }
        `,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors[0].message).toBe(
          `\"test@email\" ${CommonErrors.FORMAT}`
        );
      });
  });

  test('Register new user - Bad password', async () => {
    await api
      .post('/graphql')
      .send({
        query: `
        mutation {
          create_user(input: {
            name: "Dolan1",
            email: "test1@email.com",
            password: "Ander12"
          }) {
            success
          }
        }
      `,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors[0].message).toBe(`\"**\" ${CommonErrors.FORMAT}`);
      });
  });

  test('Register new user', async () => {
    return await api
      .post('/graphql')
      .send({
        query: `
          mutation {
            create_user(input: {
              name: "testname",
              email: "test2@email.com",
              password: "Test_123"
            }) {
              success
              token
            }
          }
        `,
      })
      .expect(200)
      .expect(({ body }) => {
        token = body.data.create_user.token;
        expect(body.data.create_user.success).toEqual(true);
      });
  });

  test('Register new user - Email already registered', async () => {
    await api
      .post('/graphql')
      .send({
        query: `
          mutation {
            create_user(input: {
              name: "prueba201",
              email: "test2@email.com",
              password: "Ander_123"
            }) {
              success
            }
          }
        `,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors[0].message).toBe(UserErrors.REGISTERED);
      });
  });

  test('Confirm new user - Bad Token', async () => {
    await api
      .post('/graphql')
      .send({
        query: `
            mutation {
              confirm_user(input: {
                token: "232334234fdssd"
              }) {
                success
              }
            }
          `,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors[0].message).toBe('jwt malformed');
      });
  });

  test('Confirm new user', async () => {
    await api
      .post('/graphql')
      .send({
        query: `
          mutation {
            confirm_user(input: {
              token: "${token}"
            }) { 
              success 
            }
          }
        `,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.confirm_user.success).toBe(true);
      });
  });

  test('Forgot User Password - Bad Email', async () => {
    await api
      .post('/graphql')
      .send({
        query: `
      mutation {
        forgot_user_password(input: {
          email: "dolan@email.com",
        }) { 
          success
        }
      }
    `,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors[0].message).toBe(UserErrors.EMAIL_NOT_FOUND);
      });
  });

  test('Forgot User Password', async () => {
    await api
      .post('/graphql')
      .send({
        query: `
      mutation {
        forgot_user_password(input: {
          email: "test2@email.com",
        }) { 
          success
          token
        }
      }
    `,
      })
      .expect(200)
      .expect(({ body }) => {
        token = body.data.forgot_user_password.token;
        expect(body.data.forgot_user_password.success).toEqual(true);
      });
  });

  test('Valid User Password', async () => {
    await api
      .post('/graphql')
      .send({
        query: `
      mutation {
        reset_user_password(input: {
          token: "${token}",
          password: "Test_1234"
        }) { 
          success
        }
      }
    `,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.reset_user_password.success).toBe(true);
      });
  });

  test('Authenticate user - Bad email', async () => {
    await api
      .post('/graphql')
      .send({
        query: `
        mutation {
          authenticate_user(input: {
            email: "prueba201@email",
            password: "Test23"
          }) {
            user {
              name
            }
          }
        }
      `,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors[0].message).toBe(UserErrors.USER_NOT_FOUND);
      });
  });

  test('Authenticate user - Bad password', async () => {
    await api
      .post('/graphql')
      .send({
        query: `
        mutation {
          authenticate_user(input: {
            email: "test2@email.com",
            password: "Test_12"
          }) {
            user {
              name
            }
          }
        }
      `,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors[0].message).toBe(UserErrors.CURRENT_PASSWORD);
      });
  });

  test('Authenticate user', async () => {
    await api
      .post('/graphql')
      .send({
        query: `
      mutation {
        authenticate_user(input: {
          email: "test2@email.com",
          password: "Test_1234"
        }) {
          user {
            name
          }
          token
        }
      }
    `,
      })
      .expect(200)
      .expect(({ body }) => {
        token = body.data.authenticate_user.token;
        expect(body.data.authenticate_user).not.toEqual(null);
      });
  });

  test('Update user - Bad Email', async () => {
    await api
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
      mutation {
        update_user(input: {
          email: "hello@mail.com",
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
        expect(body.errors[0].message).toBe(UserErrors.USER_NOT_FOUND);
      });
  });

  test('Update user - Update password', async () => {
    await api
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
      mutation {
        update_user_password(input: {
          email: "test2@email.com",
          password: "Test_1234",
          confirmPassword: "Test_12345"
        }) {
          email
        }
      }
    `,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.update_user_password.email).toBe('test2@email.com');
      });
  });

  test('Update user - Update user name', async () => {
    await api
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
      mutation {
        update_user(input: {
          email: "test2@email.com",
          password: "Test_12345",
          name: "NewName"
        }) {
          name
        }
      }
    `,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.update_user.name).toBe('NewName');
      });
  });

  afterAll(async () => {
    await User.deleteMany({
      email: { $in: ['test2@email.com'] },
    });
  });
});
