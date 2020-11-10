import React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import Swal from 'sweetalert2';
import Layout from '../../components/layouts/Layout';
import TextField from '@material-ui/core/TextField';

const GET_RECIPES = gql`
    query getRecipes {
        getRecipes {
            id
            name
            serves
            ingredients
            prep_time
            difficulty
            image_name
            image_url
            style
            description
            author
            comments {
                user_id
                user_name
                message
            }
        } 
    }
`;

const GET_RECIPE = gql`
    query getRecipe($id:ID!) {
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
            }
        }
    }
`;

const UPDATE_COMMENTS_RECIPE = gql`
    mutation updateCommentsRecipe($id: ID!, $input: RecipeInput) {
        updateCommentsRecipe(id: $id, input: $input) {
            comments {
                user_id
                user_name
                message
            }
        }
    }
`;

const DELETE_RECIPE = gql`
    mutation deleteRecipe($id:ID!) {
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
    
    /* Get current ID */
    const router = useRouter();
    const { query: { pid: id }} = router;

    /* Apollo mutation to delete recipe */
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

    const [ updateCommentsRecipe ] = useMutation(UPDATE_COMMENTS_RECIPE);

    /* Apollo query to get data recipe */
    const { data: dataRecipe, loading: loadingRecipe } = useQuery(GET_RECIPE, {
        variables: {
            id
        }
    });

    const { data: dataUser, loading: loadingUser } = useQuery(GET_USER);

    /* React hook form */
    const { register, handleSubmit, errors, control } = useForm({
        mode: "onChange"
    });

    if (loadingRecipe || loadingUser) return null;

    console.log(dataRecipe);
    console.log(dataUser);

    /* Apollo query data */
    const { getRecipe } = dataRecipe;

    const { getUser } = dataUser;

    /* Comments react hook form */
    const onSubmit = async data => {
        const { message } = data;
        const { id: user_id, name: user_name } = getUser;
        try {
            const { data } = await updateCommentsRecipe({
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

    return (  
        <Layout>
            <div className="mx-auto w-10/12 bg-white rounded-lg shadow-md px-8 pt-6 pb-8 mb-4">
                <div className="w-full lg:flex">
                    <div className="lg:w-3/6">
                        <h1 className="text-2xl font-body font-bold mb-4">{getRecipe.name}</h1>   
                    </div>
                    <div className="w-full lg:w-3/6">
                        <img src={getRecipe.image_url} className="mx-auto mb-8 rounded-sm" />
                    </div>
                </div>
                <table className="border border-gray-500  text-center w-full">
                    <thead>
                        <tr className="text-sm font-roboto font-light text-gray-700">
                            <th className="w-1/3 p-2">Preparation Time</th>
                            <th className="border-l border-r border-gray-500 w-1/3 p-2">Serves</th>
                            <th className="w-1/3 p-2">Difficulty</th>
                        </tr>
                    </thead>
                    <tbody className="text-xl font-roboto font-bold">
                        <tr>
                            <td className="p-2">{getRecipe.prep_time} mins</td>
                            <td className="border-l border-r border-gray-500 p-2">{getRecipe.serves}</td>
                            <td>{getRecipe.difficulty}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="w-full lg:flex mt-4">
                    <div className="w-full lg:w-2/6 lg:border-r-2 border-black ">
                        <h1 className="text-lg font-body font-bold">Ingredients</h1>
                        {getRecipe.ingredients.map(ingredient => (
                            <p key={ingredient} className="text-md px-2 py-1 font-body">- {ingredient}</p>
                        ))}
                    </div>
                    <div className="w-full mt-2 lg:w-4/6 lg:ml-2 lg:mt-0">
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
                    ) : ''}
            </div>
            <div className="mx-auto w-10/12 bg-white rounded-lg shadow-md px-8 pt-6 pb-8 mb-4">
                <h1 className="text-lg font-body font-bold mb-4">Discussion</h1> 
                <div className="flex w-full">
                    <div className="w-12">
                        { getUser !== null ?
                            <img className="w-10 h-10 rounded-full" src="/usericon.jpeg" />
                            : <img className="w-10 h-10 rounded-full" src="/usericon.jpeg" />
                        }
                    </div>
                    <div className="w-5/6 relative">
                        <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller 
                            name="message"
                            as={<TextField
                                className="w-10/12 md:w-11/12 border border-black rounded" 
                                id="outlined-multiline-flexible"
                                multiline
                                rowsMax={3}
                                placeholder="Introduce your message..."
                                variant="outlined"
                            />}
                            defaultValue=""
                            control={control}
                        />
                        
                            <input className="ml-3 px-3 py-2 rounded-lg bg-black text-white font-roboto font-bold absolute top-0 hover:bg-gray-800 cursor-pointer" type="submit" value="SEND" />
                        </form>   
                    </div>            
                </div>
                <div className="w-full mt-4">
                    <div className="border-t border-gray-400 mb-4"></div>
                    { getRecipe.comments.map(comment => (
                        <div>
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