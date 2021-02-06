import React, { useState, useContext } from 'react';
import { useMutation } from '@apollo/client';
import Image from 'next/image';
import { Waypoint } from 'react-waypoint';
import useTimeAgo from '../../../lib/hooks/useTimeAgo';
import { useToasts } from 'react-toast-notifications';
import AuthContext from '../../../lib/context/auth/authContext';
import ChevronUp from '../../icons/chevronUp';
import { EDIT_COMMENTS_RECIPE, VOTE_COMMENTS_RECIPE } from '../../../lib/graphql/comments/mutation';

const Comment = ({comment, query, recipe, i, fetchMore}) => {
    const { id, message, votes, author, createdAt, edited } = comment;

    /* TimeAgo Hook */
    const timeago = useTimeAgo(createdAt);

    /* auth state */
    const { authState } = useContext(AuthContext);

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
                    recipeUrl: recipe.url,
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
                variables: {
                    recipeUrl: recipe.url,
                    offset: 0,
                    limit: 10
                },
                data: {
                    getRecipe: {...getRecipe} 
                }
            })
        }
    });

    const handleEdit = async editComment => {
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
                    recipeUrl: recipe.url,
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
                variables: {
                    recipeUrl: recipe.url,
                    offset: 0,
                    limit: 10
                },
                data: {
                    getRecipe: {...getRecipe} 
                }
            })
        }
    });

    const voteComments = async id => {
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
                <p className="ml-2 font-roboto text-black text-sm font-bold">
                    {author.name} 
                    { author.id === recipe.author.id &&
                        <span className="ml-1 px-2 rounded-full bg-green-100 text-green-900 font-light text-xs uppercase">
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
                    <p className="break-all font-roboto text-gray-800 text-sm font-medium">{message}</p>
                }
                
                <div className="flex mt-1 items-center">
                    <button 
                        className="flex font-bold items-center content-center text-xs text-gray-400"
                        onClick={ () => voteComments(id) }
                    >
                        <ChevronUp className="w-5 h-5" />
                        <span>Upvote {votes > 0 && `(${votes})`}</span>
                    </button>
                    { authState.user && authState.user.email === author.email &&
                            <button 
                                className="ml-3 text-xs font-bold text-gray-400"
                                onClick={ isEditing ? () => handleEdit(editComment) : () => setIsEditing(true) }
                            >{ isEditing ? 'Save' : 'Edit' }</button>
                    }
                </div>
            </div>
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
    );
}
 
export default Comment;