import { RecipeErrors } from '@Enums/recipe-errors.enum';
import { api, User, Recipe, Comment } from './index';
import { hashSync } from 'bcrypt';

let token: string;
let messageId: string;

describe('Recipe Tests', () => {
  beforeAll(async () => {
    await User.create({
      name: 'Prueba2',
      email: 'prueba2@email.com',
      password: hashSync('Ander_123', 10),
      confirmed: true,
    });
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
            authenticateUser(input: {
              email: "prueba2@email.com",
              password: "Ander_123"
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

  test('Create new recipe', async () => {
    await api
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
      mutation {
        newRecipe(input: {
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
        expect(body.data.newRecipe.name).toBe('CarrotCake');
      });
  });

  test('Add a comment in the recipe - Bad auth token', async () => {
    await api
      .post('/graphql')
      .set('Authorization', `Bearer 3sdaasd31sada2`)
      .send({
        query: `
      mutation {
        sendCommentRecipe(
          recipeUrl: "carrotcake",
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
        expect(body.errors[0].message).toBe(RecipeErrors.NOT_LOGGED_IN);
      });
  });

  test('Add a comment in the recipe', async () => {
    await api
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
      mutation {
        sendCommentRecipe(
          recipeUrl: "carrotcake", 
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
        messageId = body.data.sendCommentRecipe._id;
        expect(body.data.sendCommentRecipe.message).not.toEqual(null);
      });
  });

  test('Edit a comment in the recipe', async () => {
    await api
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
      mutation {
        editCommentRecipe(
          _id: "${messageId}", 
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
        expect(body.data.editCommentRecipe.message).not.toEqual(null);
      });
  });

  test('Vote a comment in the recipe', async () => {
    await api
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
      mutation {
        voteCommentRecipe(
          _id: "${messageId}", 
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
        expect(body.data.voteCommentRecipe.votes).toBe(1);
      });
  });
});
