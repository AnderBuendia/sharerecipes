import React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import { Waypoint } from 'react-waypoint';

const GET_RECIPE_COMMENTS = gql`
    query getRecipeComments($id: ID!, $offset: Int, $limit: Int) {
        getRecipeComments(id: $id, offset: $offset, limit: $limit) {
            comments {
                user_id
                user_name
                message
                createdAt
            }
        }
    }
`;

const SEND_COMMENTS_RECIPES = gql`
    mutation sendCommentsRecipe($id: ID!, $input: RecipeInput) {
        sendCommentsRecipe(id: $id, input: $input) {
            comments {
                user_id
                user_name
                message
                createdAt
            }
        }
    }
`;

const Comments = ({user, recipe, qrecipe}) => {

    const { id, comments } = recipe;

    /* Apollo mutation to update recipe comments */
    const [ sendCommentsRecipe ] = useMutation(SEND_COMMENTS_RECIPES, {
        update(cache, { data: { sendCommentsRecipe } }) {
            const { getRecipe } = cache.readQuery({
                query: qrecipe,
                variables: { id }
            });
    
            cache.writeQuery({
                query: qrecipe,
                data: {
                    getRecipe: [...getRecipe.comments, sendCommentsRecipe]
                }
            });
        }
    });
    /* React hook form */
    const { handleSubmit, control } = useForm({
        mode: "onChange"
    });

    /* Comments react hook form */
    const onSubmit = async data => {
        const { message } = data;
        const { id: user_id, name: user_name } = user;
        
        try {
            const { data } = await sendCommentsRecipe({
                variables: {
                    id,
                    input: {
                        comments: {
                            user_id,
                            user_name,
                            message  
                        }
                    }
                }
            });
            console.log('COMMENTS: ', data);
        } catch (error) {
            console.log(error);
        }
    }

    /* Apollo query to limit the number of comments */
    const { data, loading, fetchMore } = useQuery(GET_RECIPE_COMMENTS, {
        variables: {
            id,
            offset: 0,
            limit: 10,
        }
    });

    if (loading) return null;
    const { getRecipeComments } = data;
    console.log(getRecipeComments)

    return (  
        <div className="mx-auto w-11/12 bg-white rounded-lg shadow-md px-8 pt-6 pb-8 mb-4">
        <h1 className="text-lg font-body font-bold mb-4">Discussion</h1> 
        <div className="flex w-full">
            <div className="w-10">
                { user !== null ?
                    <img className="w-8 h-8 rounded-full" src="/usericon.jpeg" />
                    : <img className="w-8 h-8 rounded-full" src="/usericon.jpeg" />
                }
            </div>
            <div className="w-5/6 relative">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller 
                        name="message"
                        as={<TextField
                            className="w-10/12 md:w-11/12 border border-black rounded shadow-sm" 
                            id="outlined-multiline-flexible"
                            multiline
                            rowsMax={3}
                            placeholder="Introduce your message..."
                            variant="outlined"
                        />}
                        defaultValue=""
                        control={control}
                    />
                    
                    <input className="ml-2 px-3 py-2 rounded-lg bg-black text-white font-roboto font-bold absolute top-0 hover:bg-gray-800 cursor-pointer" type="submit" value="SEND" />
                </form>   
            </div>            
        </div>
        <div className="w-full mt-4">
            <div className="border-t border-gray-400 mb-4"></div>
            { getRecipeComments.comments.map((comment, i) => (
                <div key={comment.createdAt}>
                    <p className="font-body text-black text-lg font-bold">{comment.user_name}</p>
                    <p className="font-body mb-4">{comment.message}</p>
                    { i === getRecipeComments.comments.length - 1 &&
                        <Waypoint onEnter={() => fetchMore({ 
                            variables: {
                                id,
                                offset: i+1,
                                limit: i+11
                            },
                        })} />
                    }
                </div>
                ))
            }
        </div>
    </div>
    );
}
 
export default Comments;