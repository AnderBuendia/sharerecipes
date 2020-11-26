import React from 'react';
import Link from 'next/link';

export default function Custom404() {
    return (
        <div className="flex flex-col h-screen bg-gray-200">
            <div className="m-auto flex flex-col items-center">
                <h1 className="font-body font-bold text-8xl mb-4">Oops!</h1>
                <h2 className="font-body font-bold text-xl mb-4">404 - The Page can't be found</h2>
                <Link href="/">
                    <a className="p-4 rounded-full font-bold font-body text-white uppercase transition duration-500 ease-in-out bg-black hover:bg-gray-700 transform hover:-translate-y-1 hover:scale-110">Go TO Homepage</a>
                </Link>
                </div>
	    </div>
    )
}