import React, { useState, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/router';
import { gql, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';
import ReactSelect from 'react-select';
import { useToasts } from 'react-toast-notifications';
import { decode } from 'jsonwebtoken';
import ImagesContext from '../lib/context/images/imagesContext';
import { withCSRRedirect } from '../lib/hoc/with-csr-redirect.hoc';
import { createApolloClient } from '../lib/apollo/apollo-client';
import { getJwtFromCookie } from '../lib/utils/jwt-cookie.utils';
import { isRequestSSR, loadAuthProps, serverRedirect } from '../lib/utils/ssr.utils';

/* enum conditions */
import { MainPaths } from '../enums/paths/main-paths';
import { RedirectConditions } from '../enums/redirect-conditions';

/* components */
import MainLayout from '../components/layouts/MainLayout';
import Input from '../components/form/Input';
import DragDropImage from '../components/form/DragDropImage';

const NEW_RECIPE = gql`
    mutation newRecipe($input: RecipeInput) {
        newRecipe(input: $input) {
            id
            name
            prep_time
            serves
            ingredients
            difficulty
            style
            description
            image_url
            image_name
        }
    }
`;

const GET_RECIPES = gql`
    query getRecipes {
        getRecipes {
            id
        }
    }
`;

const NewRecipe = () => {
    /* Routing */
    const router = useRouter();

    /* Set Toast Notification */
    const { addToast } = useToasts();

    /* Set new recipe image */
    const { recipe_image, setRecipeImage } = useContext(ImagesContext);
    const { image_url, filename } = recipe_image;

    /* useStates */
    /* To select options */
    const [selectedFoodStyle, setSelectedFoodStyle] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');

    /* To get the ingredients */
    const [indexes, setIndexes] = useState([]);
    const [counter, setCounter] = useState(0);

    /* Apollo mutation */
    const [ newRecipe ] = useMutation(NEW_RECIPE, {
        update(cache, { data: { newRecipe } }) {
            const { getRecipes } = cache.readQuery({ query: GET_RECIPES });

            cache.writeQuery({
                query: GET_RECIPES,
                data: {
                    getRecipes: [...getRecipes, newRecipe]
                }
            })
        }
    });

    /* Select options */
    const foodStyle = [
        { value: 'indian', label: 'Indian' },
        { value: 'mediterranean', label: 'Mediterranean' },
        { value: 'other', label: 'Other...' },
      ];
    
    const difficulty = [
        { value: 'EASY', label: 'EASY' },
        { value: 'MEDIUM', label: 'MEDIUM' },
        { value: 'HARD', label: 'HARD' },
    ];

    const addIngredients = () => {
        setIndexes(prevIndexes => [...prevIndexes, counter]);
        setCounter(prevCounter => prevCounter + 1);
    }

    const removeIngredient = index => {
        setIndexes(prevIndexes => [...prevIndexes.filter(item => item !== index)]);
        setCounter(prevCounter => prevCounter + 1);
    }

    /* React hook form */
    const { register, handleSubmit, errors, control } = useForm({
        mode: "onChange"
    });

    const onSubmit = async data => {
        const { name, prep_time, serves, ingredients, difficulty, description, other_style } = data;
        
        /* Parse field numbers */
        const prep_timeParse = parseInt(prep_time);
        const servesParse = parseInt(serves);
     
        try {
            const { data } = await newRecipe({
                variables: {
                    input: {
                        name,
                        prep_time: prep_timeParse,
                        serves: servesParse,
                        ingredients,
                        difficulty: difficulty.value,
                        style: other_style ? other_style : selectedFoodStyle.value,
                        image_url,
                        image_name: filename,
                        description
                    }
                }
            });

            /* Recipe Image State */
            setRecipeImage('');

            /* Redirect to Home Page*/
            router.push(MainPaths.INDEX);

            /* Show alerts */
            Swal.fire(
                'Correct',
                'Recipe has been created successfully',
                'success'
            );
        } catch (error) {
            addToast(error.message.replace('GraphQL error: ', ''), { appearance: 'error' });
        }
    };

    return (  
        <MainLayout>
            <div className="md:w-11/12 xl:w-10/12 mx-auto">
                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-lg bg-white rounded-lg shadow-md px-8 pt-6 pb-8 mb-4">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <h2 className="text-4xl font-roboto font-bold text-gray-800 text-center my-4">
                                Create New Recipe
                            </h2>
                            <label
                                className="block text-black text-md font-body font-bold mb-4"
                            >Recipe Image</label>
                            <div className="flex w-128 h-56 overflow-hidden mx-auto my-4 rounded-md">
                                <DragDropImage 
                                    url={`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/recipes`}
                                    current={image_url}
                                    name='photo'
                                    ratio={1}
                                    onChange={url => setRecipeImage(url)}
                                />
                            </div>

                            <Input
                                label="Name"
                                name="name"
                                type="text"
                                placeholder="Recipe Name"
                                childRef={register({required: { value: true, message: "User is required" }})}
                                error={errors.name}
                            />
        
                            <Input
                                label="Preparation Time"
                                name="prep_time"
                                type="number"
                                placeholder="Preparation Time"
                                childRef={register({required: { value: true, message: "Prep time is required" }})}
                                error={errors.prep_time}
                            />

                            <Input
                                label="Serves"
                                name="serves"
                                type="number"
                                placeholder="Number of Serves"
                                childRef={register({required: { value: true, message: "Number of serves is required" }})}
                                error={errors.serves}
                            />

                            <div className="border w-full bg-white mt-6 mb-4 rounded-lg shadow appearance-none">
                                <label
                                    className="block text-black text-md font-body font-bold mx-3 my-2"
                                >Ingredients</label>
                                { indexes.map(index => {
                                    const fieldName = `ingredients[${index}]`;
                                    return (
                                        <div className="mx-3 my-3" name={fieldName} key={fieldName}>
                                            <input
                                                className="font-body shadow appearance-none border rounded w-11/12 py-2 px-3 
                                                text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                                                name={fieldName}
                                                type="text"
                                                placeholder="Introduce your ingredients"
                                                ref={register({required: { value: true, message: "Ingredients are required" }})}
                                                error={errors.ingredients ? errors.ingredients[index] : ''}
                                            />

                                            <button 
                                                type="button"
                                                className="w-7 bg-red-700 ml-1 p-1 text-white text-center rounded"
                                                onClick={() => removeIngredient(index)}
                                            >-</button>
                                            
                                            { errors.ingredients &&
                                                <div className="my-3 bg-red-200 border-l-4 border-red-700 text-red-700 p-2">
                                                    <p>{errors.ingredients[index].message}</p>
                                                </div>
                                            }
                                        </div>
                                    );
                                }) }

                                <button 
                                    type="button" 
                                    className="bg-black w-1/2 py-2 rounded-lg text-white mx-3 my-2 hover:bg-gray-800"
                                    onClick={addIngredients}
                                >
                                    Add an Ingredient
                                </button>
                            </div>
                            
                            <label
                                className="block text-black text-md font-body font-bold mb-2"
                            >Recipe Difficulty</label>
                            <Controller
                                as={
                                    <ReactSelect
                                        instanceId="selected-difficulty"
                                        className="mt-2 mb-4 font-body shadow appearance-none"
                                        placeholder="Select a recipe difficulty..."
                                        options={difficulty}
                                        onChange={setSelectedDifficulty} 
                                    />
                                }
                                defaultValue={selectedDifficulty}
                                name="difficulty"
                                control={control}
                            />

                            <label
                                className="block text-black text-md font-body font-bold mb-2"
                            >Food Style</label>
                            <ReactSelect
                                instanceId="selected-food-style"
                                className="mt-2 mb-4 font-body shadow appearance-none"
                                placeholder="Select a food style..."
                                options={foodStyle}
                                onChange={setSelectedFoodStyle}
                                name="style"
                                defaultValue={selectedFoodStyle}
                            />

                            { selectedFoodStyle.value === 'other' ? 
                                <Input
                                    name="other_style"
                                    type="text"
                                    placeholder="Introduce that style"
                                    childRef={register}
                                /> 
                                : ''
                            }

                            <label
                                className="block text-black text-md font-body font-bold mb-2"
                            >Description of your Recipe</label>
                            <textarea
                                className="font-body shadow appearance-none border rounded w-full h-32 mb-3 py-2 px-3 
                                text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                                name="description"
                                placeholder="Introduce your recipe..."
                                ref={register({required: { value: true, message: "Your recipe is required" }})}
                            />
                        
                            <input 
                                className="btn-primary"
                                type="submit"
                                value="Create New Recipe"
                            />
                         
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

const redirect = {
    href: MainPaths.INDEX,
    statusCode: 302,
    condition: RedirectConditions.REDIRECT_WHEN_USER_NOT_EXISTS,
};

export const getServerSideProps = async ctx => {
    const props = { lostAuth: false };
    const isSSR = isRequestSSR(ctx.req.url);

    const jwt = getJwtFromCookie(ctx.req.headers.cookie);

    if (jwt) {
		if (isSSR) {
			const apolloClient = createApolloClient();
			const authProps = await loadAuthProps(ctx.res, jwt, apolloClient);

            if (authProps) serverRedirect(ctx.res, redirect);
            else props.authProps = authProps;
	    } else if (!decode(jwt)) props.lostAuth = true;
    } 

    props.componentProps = {
        shouldRender: !!props.authProps
    }

    return { props }
};
 
export default withCSRRedirect(NewRecipe, redirect);