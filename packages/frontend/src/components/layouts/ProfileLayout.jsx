import React from 'react'
import { useRouter } from 'next/router';

const ProfileLayout = ({path}) => {
    const router = useRouter();

    return (  
        <h1>From profile layout</h1>
    );
}
 
export default ProfileLayout;