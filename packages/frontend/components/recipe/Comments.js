import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import Image from 'next/image';
import { Waypoint } from 'react-waypoint';
import ModalSignup from './ModalSignup';

const SEND_COMMENTS_RECIPES = gql`
    mutation sendCommentsRecipe($input: CommentsRecipeInput) {
        sendCommentsRecipe(input: $input) {
            id
            message
        }
    }
`;

const Comments = ({user, recipe, query, fetchMore}) => {
    /* useState Modal */
    const [open, setOpen] = useState(false);

    /* Apollo mutation to update recipe comments */
    const [ sendCommentsRecipe ] = useMutation(SEND_COMMENTS_RECIPES, {
        update(cache, { data: { sendCommentsRecipe } }) {
            const { getRecipe } = cache.readQuery({ 
                query, 
                variables: {
                    id: recipe.id,
                    offset: 0,
                    limit: 10
                }
            });
            console.log('CACHE GET RECIPE', getRecipe.comments)
            
            cache.writeQuery({
                query,
                data: {
                    getRecipe: [...getRecipe.comments, sendCommentsRecipe],
                }
            }) 
        }
    });
    
    /* React hook form */
    const { handleSubmit, control } = useForm({
        mode: "onChange"
    });

    /* Comments react hook form */
    const onSubmit = async data => {
        const { message } = data;

        if (user) {   
            try {
                const { data } = await sendCommentsRecipe({
                    variables: {
                        input: {
                            recipe: recipe.id,
                            message  
                        }
                    }
                });
                console.log('COMMENTS: ', data);
            } catch (error) {
                console.log(error);
            }
        } else {
            setOpen(true)
        }
    }

    return (  
    <div className="mx-auto w-11/12 bg-white rounded-lg shadow-md px-8 pt-6 pb-8 mb-4">
        { open && <ModalSignup open={open} handleOpen={setOpen} /> }
        <h1 className="text-lg font-body font-bold mb-4">Discussion</h1> 
        <div className="flex w-full">
            <div className="w-10 mr-2">
                    <Image 
                        className="block rounded-full"
                        key={user ? user.image_url : '/usericon.jpeg'}
                        src={user ? user.image_url : '/usericon.jpeg'}
                        alt={user ? user.image_name : 'UserIcon Image'}
                        width={36}
                        height={36}
                    />
            </div>
            <div className="w-5/6 relative">
            <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller 
                        name="message"
                        as={<TextField
                            className="w-11/12 border border-black rounded shadow-sm"
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
            <div className="border-t border-gray-400 mb-4">
            { recipe.comments.map((comment, i) => (
                <div key={comment.id}>
                    <div className="flex w-full items-center mt-4">
                        <Image 
                            className="block rounded-full"
                            key={comment.author.image_url ? comment.author.image_url : '/usericon.jpeg'}
                            src={comment.author.image_url ? comment.author.image_url : '/usericon.jpeg'}
                            alt={comment.author.image_name ? comment.author.image_name : 'UserIcon Image'}
                            width={28}
                            height={28}
                        />
                        <p className="ml-2 font-roboto text-black text-md font-bold ">
                            {comment.author.name} 
                            { comment.author.id === recipe.author.id ? 
                                <span className="ml-2 px-2 p-0.5 rounded-full bg-green-100 text-green-900 font-light text-xs uppercase">Chef</span> 
                                : 
                                '' 
                            } 
                        </p>
                    </div>
                    <p className="break-all ml-10 font-roboto text-gray-700 text-sm font-medium mb-5">{comment.message}</p>
                    { i === recipe.comments.length - 1 &&
                        <Waypoint onEnter={() => fetchMore({ 
                            variables: {
                                id: recipe.id,
                                offset: 0,
                                limit: i+11
                            },
                        })} />
                    }         
                </div>
                ))
            }
            </div>
        </div>
    </div>
    );
}
 
export default Comments;