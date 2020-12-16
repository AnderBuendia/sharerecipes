import React from 'react';
import { gql, useMutation } from '@apollo/client';
import Image from 'next/image';
import { Waypoint } from 'react-waypoint';
import useTimeAgo from '../../hooks/useTimeAgo';
import ChevronUp from '../icons/chevronUp';

const VOTE_COMMENTS_RECIPE = gql`
    mutation voteCommentsRecipe($id: ID!, $input: CommentsRecipeInput) {
        voteCommentsRecipe(id: $id, input: $input) {
            id
            voted
            votes
        }
    }
`;

const Comment = ({comment, i, query, fetchMore, user, numberOfComments}) => {
    const { id, message, votes, author, recipe, createdAt } = comment;

    /* TimeAgo Hook */
    const timeago = useTimeAgo(createdAt);

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
            
            console.log('UPDATEVOTERECIPE', data);
        } catch (error) {
            console.log(error)
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
                    { author.id === recipe.author.id ? 
                        <span className="ml-2 px-2 p-0.5 rounded-full bg-green-100 text-green-900 font-light text-xs uppercase">Chef</span> 
                        : 
                        '' 
                    } 
                </p>
                <p className="text-sm text-gray-500 ml-2">{timeago}</p>
            </div>
            <div className="ml-10 mb-5">
                <p className="break-all font-roboto text-gray-900 text-sm font-medium">{message}</p>
                <div className="flex mt-1 items-center">
                    <button 
                        className="flex font-bold items-center content-center text-xs text-gray-400"
                        onClick={ () => voteComments() }
                    >
                        <ChevronUp className="w-5 h-5" />
                        <span>Upvote {votes > 0 && `(${votes})`}</span>
                    </button>
                    { user && user.id === author.id &&
                            <button className="ml-3 text-xs font-bold text-gray-400">Edit</button>
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