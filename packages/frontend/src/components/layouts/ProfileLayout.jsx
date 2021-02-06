import React, { useContext } from 'react'
import ResolutionContext from '../../lib/context/resolution/resolutionContext';

/* components */
import ProfileMenu from '../profile/profile-menu';
import ProfileMobileMenu from '../profile/profile-mobile-menu';
import ProfileData from '../profile/sections/profile-data';
import ProfilePassword from '../profile/sections/profile-password';
import ProfileRecipes from '../profile/sections/profile-recipes';

/* enums */
import { ProfilePaths } from '../../enums/paths/profile-paths';
import { ResolutionBreakPoints } from '../../enums/config/resolution-breakpoints';

const ProfileLayout = ({path}) => {
    const { width } = useContext(ResolutionContext);
    
    const isMobile = width <= ResolutionBreakPoints.SM ? true : false;

    const components = {
        [ProfilePaths.MAIN]: {
            Component: ProfileData,
            title: 'My Account',
        },
        [ProfilePaths.PASSWORD]: {
            Component: ProfilePassword,
            title: 'Change Password',
        },
        [ProfilePaths.RECIPES]: {
            Component: ProfileRecipes,
            title: 'Recipes',
        }
    }

    const { Component, title } = components[path];

    if (!Component) return <div>Prueba</div>;

    return isMobile ? (
        <div className="container mx-auto w-11/12">
            <ProfileMobileMenu path={path} />
            <h1 className="text-center text-2xl font-bold font-roboto">
                {title}
            </h1>
            <Component />
        </div>
    ) : (
        <div className="flex container mx-auto my-4">
            <div className="w-1/4">
                <ProfileMenu />
            </div>
            <div className="w-3/4">
                <h1 
                    className="w-11/12 text-2xl font-roboto pb-2 text-gray-800 text-left
                        border-b border-gray-400"
                >
                    {title}
                </h1>
                <Component />
            </div>
        </div>
    )
};
 
export default ProfileLayout;