import React from 'react';
import Router from 'next/router';


const Recipe = ({recipe}) => {

    const { id, name, prep_time, serves, difficulty, style, image_url } = recipe;

    const handleRecipe = () => {
        Router.push({
            pathname: "/recipes/[pid]",
            query: { pid: id }
        })
    }

    return (
        <>
        <div 
            className="rounded overflow-hidden shadow-lg"
            onClick={ () => handleRecipe() }
        >
            <div 
                className="px-3 py-3 bg-auto bg-center h-64 relative" 
                style={{ backgroundImage: `linear-gradient(180deg,transparent 0,rgba(0,0,0,.9) 150%), url(${image_url})` }}>
                <div className="font-bold text-xl mb-4 text-white absolute bottom-0 ">{name}</div>
            </div>
            <div className="w-full px-3 pt-2 pb-2">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{style}</span>
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{difficulty}</span>
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">Preparation time: {prep_time}</span>
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">Serves: {serves}</span>
            </div>
        </div>
        </>
    );
}
 
export default Recipe;