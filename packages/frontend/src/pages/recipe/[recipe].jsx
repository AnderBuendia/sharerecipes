import React, { useContext } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Swal from 'sweetalert2';
import Rating from '@material-ui/lab/Rating';
import { useToasts } from 'react-toast-notifications';
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon } from 'react-share';
import { decode } from 'jsonwebtoken';
import { getJwtFromCookie } from '../../lib/utils/jwt-cookie.utils';
import { isRequestSSR, loadAuthProps } from '../../lib/utils/ssr.utils';
import { createApolloClient } from '../../lib/apollo/apollo-client';
import AuthContext from '../../lib/context/auth/authContext';
import MainLayout from '../../components/layouts/MainLayout';
import Discussion from '../../components/recipes/recipe/Discussion';
import Spinner from '../../components/generic/Spinner';
import { GET_RECIPES } from '../../lib/graphql/recipe/query';
import { UPDATE_VOTE_RECIPE } from '../../lib/graphql/recipe/mutation';
import { DELETE_RECIPE } from '../../lib/graphql/recipe/mutation';
import { GET_RECIPE } from '../../lib/graphql/recipe/query';
import { MainPaths } from '../../enums/paths/main-paths';

const Recipe = () => {
    /* Get current url name - Routing */
    const router = useRouter();
    const { query: { recipe: url }} = router;

    /* user state */
    const { authState } = useContext(AuthContext);

    /* Set Toast Notification */
    const { addToast } = useToasts();

    /* Apollo mutation */
    const [ deleteRecipe ] = useMutation(DELETE_RECIPE, {
        update(cache) {
            const { getRecipes } = cache.readQuery({ query: GET_RECIPES });

            cache.writeQuery({
                query: GET_RECIPES,
                data: {
                    getRecipes: getRecipes.filter(
                        currentRecipe => currentRecipe.id !== recipe.id),
                }
            })
        }
    });

    const [ updateVoteRecipe ] = useMutation(UPDATE_VOTE_RECIPE, {
        update(cache, { data: { updateVoteRecipe: { average_vote } } }) { 
            const { getRecipe } = cache.readQuery({ query: GET_RECIPE,
                variables: {
                    recipeUrl: url,
                    offset: 0,
                    limit: 10
                }
            });

            cache.writeQuery({
                query: GET_RECIPE,
                variables: {
                    recipeUrl: url,
                    offset: 0,
                    limit: 10
                },
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
                    recipeUrl: url,
                    input: {
                        votes, 
                    }
                }
            });
        } catch (error) {
            addToast(error.message.replace('GraphQL error: ', ''), { appearance: 'error' });
        }
    }

    const confirmDeleteRecipe = recipeUrl => {
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
                    /* Delete recipe by recipe url */
                    const { data } = await deleteRecipe({
                        variables: {
                            recipeUrl
                        }
                    });
                    
                    Swal.fire(
                        'Deleted!',
                        'Recipe has been deleted',
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
    const { data, loading, fetchMore } = useQuery(GET_RECIPE, {
        variables: {
            recipeUrl: url,
            offset: 0,
            limit: 10
        },
    });

    /* Apollo query data */
    const recipe = data ? data.getRecipe : null;

    return loading ? ( <Spinner /> ) : (  
        <MainLayout
            title={recipe.name}
            description={`Recipe ${recipe.name}`}
            url={MainPaths.RECIPE}
        >
            <div className="container mx-auto w-11/12 bg-white rounded-lg shadow-md p-5 mb-4">
                <h1 className="break-all text-2xl font-body font-bold mb-2">{recipe.name}</h1>  
                <div className="w-full flex flex-col lgxl:flex-row lgxl:justify-between">
                    <div className="lgxl:2/4">
                        <Image 
                            className="rounded-sm mb-3"
                            key={recipe.image_url}
                            src={recipe.image_url}
                            alt={recipe.image_name}
                            width={1024}
                            height={612}
                        />
                    </div>
                    
                    <div className="w-full lgxl:flex-col lgxl:ml-3 lgxl:mt-1 xl:w-2/4 relative">
                        <div className="w-full flex flex-row border-gray-400 border-t p-3 lgxl:p-0 lgxl:flex-col">
                            <div className="w-full text-center lgxl:w-full lgxl:my-3">
                                <p className="font-light text-gray-500 text-xs uppercase">Preparation time</p>
                                <span className="font-bold text-md">{recipe.prep_time} mins</span>
                            </div>
                            <div className="w-full text-center border-l border-gray-400 lgxl:border-l-0 lg:p-2 lgxl:border-t lgxl:py-3">
                                <p className="font-light text-gray-500 text-xs uppercase">Serves</p>
                                <span className="font-bold text-md">{recipe.serves}</span>
                            </div>
                        </div>
                        
                        <div className="w-full flex flex-row border-gray-400 border-t border-b p-3 lgxl:p-0 lgxl:flex-col">
                            <div className="w-full text-center lgxl:w-full lgxl:my-3">
                                <p className="font-light text-gray-500 text-xs uppercase">Difficulty</p>
                                <span className="font-bold text-md">{recipe.difficulty}</span>
                            </div>
                            <div className="w-full text-center border-l border-gray-400 lgxl:border-l-0 lgxl:p-3 lgxl:border-t lgxl:py-3">
                                <p className="font-light text-gray-500 text-xs uppercase">Style</p>
                                <span className="font-bold text-md uppercase">{recipe.style}</span>
                            </div>
                        </div>
                        
                        <div className="flex flex-row justify-between items-center 
                            xl:flex-col xl:items-end xl:absolute xl:bottom-0 xl:right-0 xl:mt-6">
                            <div className="flex flex-row">
                                <FacebookShareButton
                                    url={process.env.NEXT_PUBLIC_SITE_URL + `/recipe/${url}`}
                                    quote='Visit my new recipe'
                                    className="cursor-pointer mr-3"
                                >
                                    <FacebookIcon size={28} className="rounded-full" />
                                </FacebookShareButton>
                                <TwitterShareButton
                                    url={process.env.NEXT_PUBLIC_SITE_URL + `/recipe/${url}`}
                                    title='Visit my new recipe'
                                    className="cursor-pointer"
                                >
                                    <TwitterIcon size={28} className="rounded-full" />
                                </TwitterShareButton>
                            </div>
                            <div className="flex flex-col float-right items-end mt-4 ">
                                <Rating  
                                    name="half-rating" 
                                    size="large" 
                                    defaultValue={0}
                                    disabled={!authState ? true : false}
                                    value={recipe.average_vote} 
                                    precision={0.5} 
                                    onChange={ (event, newValue) => voteRecipe(newValue) }
                                />
                                <p className="ml-1 text-lg text-gray-500">
                                    ({recipe.average_vote} from {recipe.voted.length} votes)
                                </p>
                            
                            </div>
                        </div>
                       
                    </div>
                </div>
               
                <div className="w-full mt-2 flex flex-wrap lgxl:flex-nowrap lgxl:justify-between">
                    <div className="w-full lgxl:w-2/5 lgxl:border-r-2 lgxl:border-gray-800">
                        <h1 className="text-lg font-body font-bold">Ingredients</h1>
                        {recipe.ingredients.map(ingredient => (
                            <p key={ingredient} className="text-md px-2 py-1 font-body">- {ingredient}</p>
                        ))}
                    </div>
                    <div className="w-full mt-2 lgxl:w-3/5 lgxl:ml-2 lgxl:mt-0">
                        <h2 className="text-lg font-body font-bold">Steps</h2>
                        {recipe.description.split("\n").map(i => (
                            <p key={i} className="text-md px-2 py-1 font-body">{i}</p>
                        ))}
                    </div>
                </div>
                { authState.user && recipe.author.email === authState.user.email ? (
                    <div className="flex w-full mt-6">
                        <button
                            type="button"
                            className="flex-1 mr-2 justify-center items-center bg-red-800 py-2 px-4 w-full
                            text-white rounded text-xs uppercase font-roboto font-bold hover:bg-red-600"
                            onClick={ () => confirmDeleteRecipe(url) }
                        >Delete Recipe</button>
                    </div>
                    ) : ''
                }
            </div>

            <Discussion 
                recipe={recipe}
                query={GET_RECIPE} 
                fetchMore={fetchMore}
            />
        </MainLayout>
    );
}

export const getServerSideProps = async ctx => {
	const props = { lostAuth: false };
	const isSSR = isRequestSSR(ctx.req.url);

	const jwt = getJwtFromCookie(ctx.req.headers.cookie);

	const apolloClient = createApolloClient();

	if (jwt) {
		if (isSSR) {
			const authProps = await loadAuthProps(ctx.res, jwt, apolloClient);

			if (authProps) props.authProps = authProps;
		} else if (!decode(jwt)) props.lostAuth = true;
	}

	await apolloClient.query({
		query: GET_RECIPE,
        variables: { 
            recipeUrl: ctx.params?.recipe, 
            offset: 0,
            limit: 10
        },
	});

	props.apolloCache = apolloClient.cache.extract();

	return { props };
};

export default Recipe;