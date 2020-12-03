import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { useForm, Controller, get } from 'react-hook-form';
import Swal from 'sweetalert2';
import Rating from '@material-ui/lab/Rating';
import Layout from '../../components/layouts/Layout';
import TextField from '@material-ui/core/TextField';

const GET_RECIPES = gql`
    query getRecipes {
        getRecipes {
            id
        }
    }
`;

const GET_RECIPE = gql`
    query getRecipe($id: ID) {
        getRecipe(id: $id) {
            name
            prep_time
            serves
            ingredients
            description
            difficulty
            style
            image_url
            author
            comments {
                user_id
                user_name
                message
                createdAt
            }
            votes
            voted
            average_vote
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

const UPDATE_VOTE_RECIPE = gql`
    mutation updateVoteRecipe($id: ID!, $input: RecipeInput) {
        updateVoteRecipe(id: $id, input: $input) {
            average_vote
        }
    }
`;

const DELETE_RECIPE = gql`
    mutation deleteRecipe($id: ID!) {
        deleteRecipe(id: $id)
    }        
`;

const GET_USER = gql`
    query getUser {
        getUser {
            id
            name
        }
    }
`;

const Recipe = () => {
    /* Get current ID - Routing */
    const router = useRouter();
    const { query: { pid: id }} = router;

    /* Apollo mutation */
    const [ deleteRecipe ] = useMutation(DELETE_RECIPE, {
        update(cache) {
            const { getRecipes } = cache.readQuery({ query: GET_RECIPES });

            cache.writeQuery({
                query: GET_RECIPES,
                data: {
                    getRecipes: getRecipes.filter(currentRecipe => currentRecipe.id !== id)
                }
            })
        }
    });

    const [ sendCommentsRecipe ] = useMutation(SEND_COMMENTS_RECIPES, {
        update(cache, { data: { sendCommentsRecipe } }) {
            const { getRecipe } = cache.readQuery({
                query: GET_RECIPE,
                variables: { id }
            });

            cache.writeQuery({
                query: GET_RECIPE,
                data: {
                    getRecipe: [...getRecipe.comments, sendCommentsRecipe]
                }
            });
        }
    });

    const [ updateVoteRecipe ] = useMutation(UPDATE_VOTE_RECIPE, {
        update(cache, { data: { updateVoteRecipe } }) {
            const { getRecipe } = cache.readQuery({
                query: GET_RECIPE,
                variables: { id }
            });

            cache.writeQuery({
                query: GET_RECIPE,
                data: {
                    getRecipe: updateVoteRecipe
                }
            });
        }
    });

    /* React hook form */
    const { register, handleSubmit, errors, control } = useForm({
        mode: "onChange"
    });

    /* Comments react hook form */
    const onSubmit = async data => {
        const { message } = data;
        const { id: user_id, name: user_name } = getUser;
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

    /* Update votes */
    const voteRecipe = async votes => {
        try {
            const { data } = await updateVoteRecipe({
                variables: {
                    id,
                    input: {
                        votes, 
                    }
                }
            });

            console.log('DATA', data)
        } catch (error) {
            console.log(error)
        }
    }

    const confirmDeleteRecipe = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    /* Delete recipe by ID */
                    const { data } = await deleteRecipe({
                        variables: {
                            id
                        }
                    });
                    // console.log('DELETE: ', data);
                    Swal.fire(
                        'Deleted!',
                        data.deleteRecipe,
                        'success'
                    )

                    /* Redirect to Home Page */
                    router.push('/');
                } catch (error) {
                    console.log(error);
                }
            }
        })
    }

    /* Apollo queries */
    const { data: dataRecipe, loading: loadingRecipe } = useQuery(GET_RECIPE, {
        variables: {
            id
        },
        fetchPolicy: "cache-and-network"
    });

    const { data: dataUser, loading: loadingUser } = useQuery(GET_USER);

    if (loadingRecipe || loadingUser) return null;

    console.log(dataRecipe);
    console.log(dataUser);

    /* Apollo query data */
    const { getRecipe } = dataRecipe;
    const { getUser } = dataUser;

    return (  
        <Layout>
            <div className="mx-auto w-11/12 bg-white rounded-lg shadow-md px-8 pt-6 pb-8 mb-4">
                <h1 className="break-all text-2xl font-body font-bold mb-2">{getRecipe.name}</h1>  
                <div className="w-full flex flex-col lg:flex-row lg:justify-between">
                    <div className="xl:2/4">
                        <img src={getRecipe.image_url} className="rounded-sm mb-3" />
                    </div>
                    
                    <div className="w-full lg:flex-col lg:ml-3 lg:mt-1 xl:w-2/4 relative">
                        <div className="w-full flex flex-row border-gray-400 border-t p-3 lg:p-0 lg:flex-col">
                            <div className="w-full text-center lg:w-full lg:my-3">
                                <p className="font-light text-gray-500 text-xs uppercase">Preparation time</p>
                                <span className="font-bold text-lg">{getRecipe.prep_time} mins</span>
                            </div>
                            <div className="w-full text-center border-l border-gray-400 lg:border-l-0 lg:p-2 lg:border-t lg:py-3">
                                <p className="font-light text-gray-500 text-xs uppercase">Serves</p>
                                <span className="font-bold text-lg">{getRecipe.serves}</span>
                            </div>
                        </div>
                        
                        <div className="w-full flex flex-row border-gray-400 border-t border-b p-3 lg:p-0 lg:flex-col">
                            <div className="w-full text-center lg:w-full lg:my-3">
                                <p className="font-light text-gray-500 text-xs uppercase">Difficulty</p>
                                <span className="font-bold text-lg">{getRecipe.difficulty}</span>
                            </div>
                            <div className="w-full text-center border-l border-gray-400 lg:border-l-0 lg:p-3 lg:border-t lg:py-3">
                                <p className="font-light text-gray-500 text-xs uppercase">Style</p>
                                <span className="font-bold text-lg uppercase">{getRecipe.style}</span>
                            </div>
                        </div>
                        
                        <div className="flex flex-col float-right items-center mt-4 xl:absolute xl:bottom-0 xl:right-0 xl:mt-6">
                            <Rating  

                                name="half-rating" 
                                size="large" 
                                defaultValue={0}
                                disabled={!getUser ? true : false}
                                value={getRecipe.average_vote} 
                                precision={0.5} 
                                onChange={ (event, newValue) => voteRecipe(newValue) }
                            />
                            <p className="ml-1 text-lg text-gray-500">
                                ({getRecipe.average_vote} from {getRecipe.voted.length} votes)
                            </p>
                           
                        </div>
                    </div>
                </div>
               
                <div className="w-full mt-2 flex flex-wrap lg:flex-nowrap lg:justify-between">
                    <div className="w-full lg:w-2/5 lg:border-r-2 lg:border-gray-800">
                        <h1 className="text-lg font-body font-bold">Ingredients</h1>
                        {getRecipe.ingredients.map(ingredient => (
                            <p key={ingredient} className="text-md px-2 py-1 font-body">- {ingredient}</p>
                        ))}
                    </div>
                    <div className="w-full mt-2 lg:w-3/5 lg:ml-2 lg:mt-0">
                        <h2 className="text-lg font-body font-bold">Steps</h2>
                        {getRecipe.description.split("\n").map(i => (
                            <p key={i} className="text-md px-2 py-1 font-body">{i}</p>
                        ))}
                    </div>
                </div>
                { getUser !== null && getRecipe.author === getUser.id ? (
                    <div className="flex w-full mt-6">
                        <button
                            type="button"
                            className="flex-1 mr-2 justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-roboto font-bold hover:bg-red-600"
                            onClick={ () => confirmDeleteRecipe() }
                        >Delete Recipe</button>
                    </div>
                    ) : ''
                }
            </div>
            <div className="mx-auto w-11/12 bg-white rounded-lg shadow-md px-8 pt-6 pb-8 mb-4">
                <h1 className="text-lg font-body font-bold mb-4">Discussion</h1> 
                <div className="flex w-full">
                    <div className="w-10">
                        { getUser !== null ?
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
                    { getRecipe.comments.map(comment => (
                        <div key={comment.createdAt}>
                            <p className="font-body text-black text-lg font-bold">{comment.user_name}</p>
                            <p className="font-body mb-4">{comment.message}</p>
                        </div>
                        ))
                    }
                </div>
            </div>
        </Layout>
    );
}
 
export default Recipe;