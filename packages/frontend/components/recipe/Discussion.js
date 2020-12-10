import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import Image from 'next/image';
import ModalSignup from './ModalSignup';
import Comment from './Comment';

const SEND_COMMENTS_RECIPE = gql`
    mutation sendCommentsRecipe($input: CommentsRecipeInput) {
        sendCommentsRecipe(input: $input) {
            id
            message
        }
    }
`;

const COMMENTS_FRAGMENT = gql`
    fragment CommentsFragment on Recipe {
        comments(offset: $offset, limit: $limit) {
            id
            message
            votes
            recipe {
                id
                author {
                    id
                }
            }
            author {
                id
                name
                image_url
                image_name
            }
        }
    }
`;

const Discussion = ({user, recipeId, arrcomments, query, fetchMore}) => {
    /* useState Modal */
    const [open, setOpen] = useState(false);

    /* Comments */
    const { comments } = arrcomments;

    /* Apollo mutation to update recipe comments */
    const [ sendCommentsRecipe ] = useMutation(SEND_COMMENTS_RECIPE, {
        update(cache, { data: { sendCommentsRecipe } }) {
            const { getRecipe } = cache.readQuery({ 
                query, 
                variables: {
                    id: recipeId,
                    offset: 0,
                    limit: 10
                }
            });
            
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
                            recipe: recipeId,
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
            { comments.map((comment, i) => (
                    <Comment 
                        key={comment.id}
                        comment={comment}
                        i={i}
                        query={query}
                        fetchMore={fetchMore}
                        user={user}
                        numberOfComments={comments.length}
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