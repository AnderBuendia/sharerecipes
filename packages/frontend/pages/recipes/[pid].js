import React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { filter } from 'graphql-anywhere';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import Rating from '@material-ui/lab/Rating';
import Layout from '../../components/layouts/Layout';
import Discussion from '../../components/recipe/Discussion';
import { useToasts } from 'react-toast-notifications';

const GET_RECIPES = gql`
    query getRecipes {
        getRecipes {
            id
        }
    }
`;

const GET_RECIPE = gql`
    query getRecipe($id: ID, $offset: Int, $limit: Int) {
        getRecipe(id: $id) {
            id
            name
            prep_time
            serves
            ingredients
            description
            difficulty
            style
            image_url
            author {
                id
                name
            }
            ...CommentsFragment
            votes
            voted
            average_vote
        }
    }
    ${Discussion.fragments.comments}
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
            image_url
            image_name
        }
    }
`;

const Recipe = () => {
    /* Get current ID - Routing */
    const router = useRouter();
    const { query: { pid: id }} = router;

    /* Set Toast Notification */
    const { addToast } = useToasts();

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

    const [ updateVoteRecipe ] = useMutation(UPDATE_VOTE_RECIPE, {
        update(cache, { data: { updateVoteRecipe: { average_vote } } }) { 
            const { getRecipe } = cache.readQuery({ query: GET_RECIPE,
                variables: {
                    id,
                    offset: 0,
                    limit: 10
                }
            });

            cache.writeQuery({
                query: GET_RECIPE,
                data: {
                    getRecipe: {...getRecipe.average_vote, average_vote},
                }
            });
        }
    });

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
        } catch (error) {
            addToast(error.message.replace('GraphQL error: ', ''), { appearance: 'error' });
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
    const { data: dataRecipe, loading: loadingRecipe, fetchMore } = useQuery(GET_RECIPE, {
        variables: {
            id,
            offset: 0,
            limit: 10
        },
    });

    const { data: userData, loading: loadingUser } = useQuery(GET_USER);

    if (loadingRecipe || loadingUser) return null;

    /* Apollo query data */
    const { getRecipe } = dataRecipe;
    const { getUser } = userData;

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
                { getUser && getRecipe.author.id === getUser.id ? (
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

            <Discussion 
                user={getUser} 
                recipeId={getRecipe.id}
                arrComments={filter(Discussion.fragments.comments, getRecipe)} 
                query={GET_RECIPE} 
                fetchMore={fetchMore}
            />
        </Layout>
    );
}

export default Recipe;