import React from 'react';
import Router from 'next/router';
import ReactSelect from 'react-select';
import LockClosed from '../icons/lockclosed';
import HomeIcon from '../icons/homeicon';
import DocumentIcon from '../icons/documenticon';
import { ProfilePaths } from '../../enums/paths/profile-paths';

const ProfileMobileMenu = ({path}) => {
    /* React select options values */ 
    const accountOptions = [
        {value: ProfilePaths.MAIN, label: (
            <>
                <p><HomeIcon className="w-4 float-left py-1 mr-2" /><span> Profile</span></p>
            </>
        )},
        {value: ProfilePaths.PASSWORD, label: (
            <>
                <p><LockClosed className="w-4 float-left py-1 mr-2" /><span> Change Password</span></p>
            </>
        )},
        {value: ProfilePaths.RECIPES, label: (
            <>
                <p><DocumentIcon className="w-4 float-left py-1 mr-2" /><span> My Recipes</span></p>
            </>
        )},
    ];

    const setSelectedMenu = selected => {
        Router.push({
            pathname: selected.value,
        });
    }

    return ( 
        <ReactSelect
            instanceId="selected-account-menu"
            className="w-full max-w-lg mb-4 font-body shadow appearance-none"
            options={accountOptions}
            onChange={ selected => setSelectedMenu(selected) }
            name="style"
            value={accountOptions.filter(option => option.value === path)}
        />
    );
}
 
export default ProfileMobileMenu;