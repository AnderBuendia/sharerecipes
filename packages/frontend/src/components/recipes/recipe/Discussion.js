import React, { useState, useContext } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import Image from 'next/image';
import ModalSignup from './ModalSignup';
import Comment from './Comment';
import { useToasts } from 'react-toast-notifications';
import AuthContext from '../../../lib/context/auth/authContext';
import { SEND_COMMENTS_RECIPE } from '../../../lib/graphql/comments/mutation';

export const COMMENTS_FRAGMENT = gql`
    fragment CommentsFragment on Recipe {
        comments(offset: $offset, limit: $limit) {
            id
            message
            edited
            createdAt
            votes
            author {
                name
                email
                image_url
                image_name
            }
        }
    }
`;

const Discussion = ({recipe, query, fetchMore}) => {
    /* useState Modal */
    const [open, setOpen] = useState(false);
    const [defaultMessage, setDefaultMessage] = useState('');

    /* auth state */
    const { authState } = useContext(AuthContext);
    const image_user = authState.user?.image_url ? authState.user.image_url : '/usericon.jpeg';
    const image_name = authState.user?.image_name ? authState.user.image_name : 'UserIcon Image';

    /* Set Toast Notification */
    const { addToast } = useToasts();

    /* Apollo mutation to update recipe comments */
    const [ sendCommentsRecipe ] = useMutation(SEND_COMMENTS_RECIPE, {
        update(cache, { data: { sendCommentsRecipe } }) {
            const { getRecipe } = cache.readQuery({ 
                query, 
                variables: {
                    recipeUrl: recipe.url,
                    offset: 0,
                    limit: 10
                }
            });
            
            cache.writeQuery({
                query,
                variables: {
                    recipeUrl: recipe.url,
                    offset: 0,
                    limit: 10
                },
                data: {
                    getRecipe: {
                        comments: [...getRecipe.comments, sendCommentsRecipe]
                    }
                }
            });
        }
    });

    /* React hook form */
    const { handleSubmit, control, reset } = useForm({
        mode: "onChange",
        defaultValues: defaultMessage
    });

    /* Comments react hook form */
    const onSubmit = async data => {
        const { message } = data;

        if (authState.user) {   
            try {
                const { data } = await sendCommentsRecipe({
                    variables: {
                        recipeUrl: recipe.url,
                        input: {
                            message  
                        }
                    }
                });

               reset(setDefaultMessage(''));
            } catch (error) {
                addToast(error.message.replace('GraphQL error: ', ''), { appearance: 'error' });
            }
        } else {
            setOpen(true)
        }
    }

    return (  
    <div className="mx-auto w-11/12 bg-white rounded-lg shadow-md px-5 py-4">
        { open && <ModalSignup open={open} handleOpen={setOpen} /> }
        <h1 className="text-lg font-body font-bold mb-4">Discussion</h1> 
        <div className="flex w-full">
            <div className="w-10 mr-2">
                    <Image 
                        className="block rounded-full"
                        key={image_user}
                        src={image_user}
                        alt={image_name}
                        width={256}
                        height={256}
                    />
            </div>
            <div className="w-5/6 relative">
            <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller 
                        name="message"
                        as={<TextField
                            className="w-10/12 sm:w-11/12 border border-black rounded shadow-sm"
                            id="outlined-multiline-flexible"
                            multiline
                            rowsMax={3}
                            placeholder="Introduce your message..."
                            variant="outlined"
                        />}   
                        defaultValue={defaultMessage}
                        control={control}
                    />
                    
                    <input 
                        className="ml-1 px-2 py-2 rounded-lg bg-black text-white font-roboto font-bold absolute top-0 hover:bg-gray-800 cursor-pointer" 
                        type="submit" 
                        value="SEND" 
                    />
                </form>
            </div>               
        </div>
        <div className="w-full mt-4">
            <div className="border-t border-gray-400 mb-4">
            { recipe.comments.map((comment, i) => (
                    <Comment 
                        key={comment.id}
                        comment={comment}
                        i={i}
                        query={query}
                        fetchMore={fetchMore}
                        recipe={recipe}
                    />
                )) 
            }
            </div>
        </div>
    </div>
    );
}

Discussion.fragments = {
    comments: COMMENTS_FRAGMENT
}
 
export default Discussion;