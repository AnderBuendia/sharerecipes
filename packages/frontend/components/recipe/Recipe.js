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
            className="rounded overflow-hidden shadow-2xl transition duration-500 ease-in-out transform hover:scale-105 hover:shadow-md"
            onClick={ () => handleRecipe() }
        >
            <div 
                className="px-3 py-3 bg-auto bg-center h-64 relative" 
                style={{ backgroundImage: `linear-gradient(180deg,transparent 0,rgba(0,0,0,.9) 150%), url(${image_url})` }}>
                <div className="font-bold text-xl mb-4 text-white absolute bottom-0 ">{name}</div>
            </div>
            <div className="w-full flex flex-wrap overflow-hidden text-center p-1">
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