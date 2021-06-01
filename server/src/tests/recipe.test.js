const RecipeErrors = require('../enums/recipe.errors');
const { api, mongoose, server, Recipe, Comment } = require('./index');

let token;
let messageId;

describe('Recipe Tests', () => {
  beforeAll(async () => {
    await Recipe.deleteMany({
      name: { $in: ['CarrotCake'] },
    });
    await Comment.deleteMany({
      message: { $in: ['Nice carrot cake!'] },
    });
  });

  test('Authenticate user to handle recipes', async () => {
    await api
      .post('/graphql')
      .send({
        query: `
          mutation {
            authenticateUser(input: {
              email: "prueba201@email.com",
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
        sendCommentsRecipe(
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
        sendCommentsRecipe(
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
        messageId = body.data.sendCommentsRecipe._id;
        expect(body.data.sendCommentsRecipe.message).not.toEqual(null);
      });
  });

  test('Edit a comment in the recipe', async () => {
    await api
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
      mutation {
        editCommentsRecipe(
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
        expect(body.data.editCommentsRecipe.message).not.toEqual(null);
      });
  });

  test('Vote a comment in the recipe', async () => {
    await api
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
      mutation {
        voteCommentsRecipe(
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
        expect(body.data.voteCommentsRecipe.votes).toBe(1);
      });
  });
});
