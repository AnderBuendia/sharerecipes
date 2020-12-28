import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import Image from 'next/image';
import { Waypoint } from 'react-waypoint';
import useTimeAgo from '../../hooks/useTimeAgo';
import ChevronUp from '../icons/chevronUp';
import { useToasts } from 'react-toast-notifications';

const VOTE_COMMENTS_RECIPE = gql`
    mutation voteCommentsRecipe($id: ID!, $input: CommentsRecipeInput) {
        voteCommentsRecipe(id: $id, input: $input) {
            id
            voted
            votes
        }
    }
`;

const EDIT_COMMENTS_RECIPE = gql`
    mutation editCommentsRecipe($id: ID!, $input: CommentsRecipeInput) {
        editCommentsRecipe(id: $id, input: $input) {
            id
            message
            edited
        }
    }
`;

const Comment = ({comment, query, user, i, numberOfComments, fetchMore}) => {
    const { id, message, votes, author, recipe, createdAt, edited } = comment;

    /* TimeAgo Hook */
    const timeago = useTimeAgo(createdAt);

    /* Set Toast Notification */
    const { addToast } = useToasts();

    /* useState Edit comments */
    const [isEditing, setIsEditing] = useState(false);
    const [editComment, setEditComment] = useState(message);
    
    /* Apollo Mutations */
    const [ editCommentsRecipe ] = useMutation(EDIT_COMMENTS_RECIPE, {
        update(cache, { data: editCommentsRecipe }) {
            const { getRecipe } = cache.readQuery({ 
                query,
                variables: {
                    id: recipe.id,
                    offset: 0,
                    limit: 10
                }
            })

            getRecipe.comments.map(comment => {
                if (comment.id === editCommentsRecipe.id) {
                    return {...comment, editCommentsRecipe};
                }
            })

            cache.writeQuery({
                query,
                data: {
                    getRecipe: {...getRecipe} 
                }
            })
        }
    });

    const handleEdit = async () => {
        try {
            const { data } = await editCommentsRecipe({
                variables: {
                    id,
                    input: {
                        message: editComment,
                        edited: true
                    }
                },
            });
            
            setIsEditing(false);
        } catch (error) {
            addToast(error.message.replace('GraphQL error: ', ''), { appearance: 'error' });
        }
    };
    
    const [ voteCommentsRecipe ] = useMutation(VOTE_COMMENTS_RECIPE, {
        update(cache, { data: voteCommentsRecipe }) {
            const { getRecipe } = cache.readQuery({ 
                query,
                variables: {
                    id: recipe.id,
                    offset: 0,
                    limit: 10
                }
            })

            getRecipe.comments.map(comment => {
                if (comment.id === voteCommentsRecipe.id) {
                    return {...comment, voteCommentsRecipe};
                }
            })

            cache.writeQuery({
                query,
                data: {
                    getRecipe: {...getRecipe} 
                }
            })
        }
    });

    const voteComments = async () => {
        try {
            const { data } = await voteCommentsRecipe({
                variables: {
                    id,
                    input: {
                        votes: 1
                    }
                }
            });
        } catch (error) {
            addToast(error.message.replace('GraphQL error: ', ''), { appearance: 'error' });
        }
    }

    return (  
        <div>
            <div className="flex w-full items-center mt-4">
                <Image 
                    className="block rounded-full"
                    key={author.image_url ? author.image_url : '/usericon.jpeg'}
                    src={author.image_url ? author.image_url : '/usericon.jpeg'}
                    alt={author.image_name ? author.image_name : 'UserIcon Image'}
                    width={28}
                    height={28}
                />
                <p className="ml-2 font-roboto text-black text-md font-bold">
                    {author.name} 
                    { author.id === recipe.author.id &&
                        <span className="ml-2 px-2 p-0.5 rounded-full bg-green-100 text-green-900 font-light text-xs uppercase">
                            Chef
                        </span> 
                    } 
                </p> 
                <p className="text-sm text-gray-500 mx-2">
                    {timeago}
                    <span>{edited && ' - edited'}</span>
                </p>
            </div>
            <div className="ml-10 mb-5">
                { isEditing ? 
                    <input 
                        type="text" 
                        className="py-1 px-2 bg-white border border-black rounded-md hover:bg-gray-50 hover:border-blue-400 leading-tight focus:shadow-outline"
                        value={editComment} 
                        onChange={e => setEditComment(e.target.value)} 
                    />
                    :
                    <p className="break-all font-roboto text-gray-900 text-sm font-medium">{message}</p>
                }
                
                <div className="flex mt-1 items-center">
                    <button 
                        className="flex font-bold items-center content-center text-xs text-gray-400"
                        onClick={ () => voteComments() }
                    >
                        <ChevronUp className="w-5 h-5" />
                        <span>Upvote {votes > 0 && `(${votes})`}</span>
                    </button>
                    { user && user.id === author.id &&
                            <button 
                                className="ml-3 text-xs font-bold text-gray-400"
                                onClick={ isEditing ? () => handleEdit(editComment) : () => setIsEditing(true) }
                            >{ isEditing ? 'Save' : 'Edit' }</button>
                    }
                </div>
            </div>
            { i === numberOfComments - 1 &&
                <Waypoint onEnter={() => fetchMore({ 
                    variables: {
                        id: recipe.id,
                        offset: 0,
                        limit: i+11
                    },
                })} />
            }
        </div>
    );
}
 
export default Comment;