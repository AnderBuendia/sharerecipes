import React from 'react';

const Alert = ({message}) => {
    return ( 
        <div className="bg-blue-200 border-l-4 border-blue-700 text-blue-700 font-roboto py-2 px-3 w-full my-3 max-w-lg text-center mx-auto">
            {message}
        </div> 
    );
}
 
export default Alert;