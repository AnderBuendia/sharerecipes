import React from 'react';
import { gql, useQuery } from '@apollo/client';
import Router from 'next/router';
import ChatIcon from '../icons/chaticon';
import StarIcon from '../icons/staricon';

const GET_NUMBER_OF_COMMENTS = gql`
    query getNumberOfComments($id: ID!) {
        getNumberOfComments(id: $id) {
            id
        }
    }
`;

const Recipe = ({recipe}) => {
    const { id, name, prep_time, serves, difficulty, style, image_url, average_vote } = recipe;

    const handleRecipe = () => {
        Router.push({
            pathname: "/recipes/[pid]",
            query: { pid: id }
        })
    }

    const { data, loading } = useQuery(GET_NUMBER_OF_COMMENTS, {
        variables: {
            id
        }
    });

    if (loading) return null;
    const { getNumberOfComments } = data;

    return (
        <>
        <div 
            className="w-full rounded overflow-hidden shadow-2xl transition duration-500 ease-in-out transform hover:scale-105 hover:shadow-md"
            onClick={ () => handleRecipe() }
        >
            <div 
                className="px-3 py-3 bg-auto bg-center h-56 relative" 
                style={{ backgroundImage: `linear-gradient(180deg,transparent 0,rgba(0,0,0,.9) 150%), url(${image_url})` }}>
                <div className="grid absolute bottom-0 mb-2 ">
                    <div className="font-bold text-xl text-white">{name}</div>
                    <div className="flex items-center mr-auto px-2 bg-white rounded-full">
                        <ChatIcon className="w-4 h-4 mr-0.5" /> <span className="text-sm mr-1">{getNumberOfComments.length}</span> 
                        <StarIcon className="w-4 h-4 text-yellow-400 mr-0.5" /> <span className="text-sm">{average_vote}</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap overflow-hidden text-center p-1">
                <div className="w-1/2 overflow-hidden p-1 border-r border-b border-gray-300">
                    <p className="font-light text-gray-500 text-xs uppercase">Prep time</p>
                    <span className="font-bold">{prep_time} mins</span>
                </div>
                <div className="w-1/2 overflow-hidden p-1 border-b border-gray-300">
                    <p className="font-light text-gray-500 text-xs uppercase">Serves</p>
                    <span className="font-bold">{serves}</span> 
                </div>
                <div className="w-1/2 overflow-hidden p-1 border-r border-gray-300">
                    <p className="font-light text-gray-500 text-xs uppercase">Difficulty</p>
                    <span className="font-bold uppercase">{difficulty}</span>
                </div>
                <div className="w-1/2 overflow-hidden p-1">
                    <p className="font-light text-gray-500 text-xs uppercase">Style</p>
                    <span className="font-bold uppercase">{style}</span> 
                </div>
            </div>
        </div>
        </>
    );
}
 
export default Recipe;