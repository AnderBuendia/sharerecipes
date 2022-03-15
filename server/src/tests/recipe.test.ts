import { api, User, Recipe, Comment } from './index';
import { hash } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserErrors } from '@Shared/infrastructure/enums/errors.enum';

let token: string;
let messageId: string;

describe('Recipe Tests', () => {
  beforeAll(async () => {
    const newUser = {
      _id: uuidv4(),
      name: 'Prueba2',
      email: 'prueba2@email.com',
      password: await hash('Ander_123', 10),
      confirmed: true,
    };

    await User.create(newUser);
  });

  afterAll(async () => {
    await Recipe.deleteMany({
      name: { $in: ['CarrotCake'] },
    });
    await Comment.deleteMany({
      message: { $in: ['Nice carrot cake Edit!'] },
    });

    await User.deleteMany({
      email: { $in: ['prueba2@email.com'] },
    });
  });

  test('Authenticate user to handle recipes', async () => {
    await api
      .post('/graphql')
      .send({
        query: `
          mutation {
            authenticate_user(input: {
              email: "prueba2@email.com",
              password: "Ander_123"
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

  test('Create new recipe', async () => {
    await api
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
      mutation {
        create_recipe(input: {
          name: "CarrotCake",
          prep_time: 34,
          serves: 3,
          ingredients: ["5 carrots"],
          difficulty: MEDIUM,
          style: "AMERICAN",
          image_url: "T35tim4g3.jpg",
          image_name: "T35tim4g3.jpg",
          description: "Creating new carrot cake recipe"
        }) {
          name
        }
      }
    `,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.create_recipe.name).toBe('CarrotCake');
      });
  });

  test('Add a comment in the recipe - Bad auth token', async () => {
    await api
      .post('/graphql')
      .set('Authorization', `Bearer 3sdaasd31sada2`)
      .send({
        query: `
      mutation {
        send_recipe_comment(
          recipeUrlQuery: "carrotcake",
          input: {
            message: "Nice bad token!"
          }
        ) {
          message
        }
      }
    `,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors[0].message).toBe(UserErrors.NOT_LOGGED_IN);
      });
  });

  test('Add a comment in the recipe', async () => {
    await api
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
      mutation {
        send_recipe_comment(
          recipeUrlQuery: "carrotcake", 
          input: {
            message: "Nice carrot cake!"
          }
        ) {
          _id
          message
        }
      }
    `,
      })
      .expect(200)
      .expect(({ body }) => {
        messageId = body.data.send_recipe_comment._id;
        expect(body.data.send_recipe_comment.message).not.toEqual(null);
      });
  });

  test('Edit a comment in the recipe', async () => {
    await api
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
      mutation {
        edit_comment(
          commentId: "${messageId}", 
          input: {
            message: "Nice carrot cake Edit!"
          }
        ) {
          message
        }
      }
    `,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.edit_comment.message).not.toEqual(null);
      });
  });

  test('Vote a comment in the recipe', async () => {
    await api
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
      mutation {
        vote_comment(
          commentId: "${messageId}", 
          input: {
            votes: 1
          }
        ) {
          votes
        }
      }
    `,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.vote_comment.votes).toBe(1);
      });
  });
});
