import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

const MuffinImg = () => {
    const router = useRouter();

    const redirect = () => {
        router.push('/');
        // cleanState();
    }

    return (  
        <Image
            className="cursor-pointer"
            src="/Muffin.svg" 
            alt="Muffin image"
            width={70}
            height={70}
            onClick={() => redirect()}
        />
    );
}
 
export default MuffinImg;