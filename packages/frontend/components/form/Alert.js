import React from 'react';

const Alert = ({message, error}) => {
    return ( 
        <div className={`${ error ? 'bg-red-200 border-red-800 text-red-800' : 'bg-green-200 border-green-800 text-green-800' } border-l-4 font-roboto py-2 px-3 w-full my-3 max-w-lg text-center mx-auto`}>
            {message}
        </div> 
    );
}
 
export default Alert;