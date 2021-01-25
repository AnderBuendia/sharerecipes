import React from 'react';
import Router from 'next/router';
import ReactSelect from 'react-select';
import LockClosed from '../icons/lockclosed';
import HomeIcon from '../icons/homeicon';

const SelectMenu = ({initialValue, id}) => {
    /* React select options values */ 
    const accountOptions = [
        {value: 'account', label: (
            <>
                <p><HomeIcon className="w-4 float-left py-1 mr-2" /><span> Edit Profile</span></p>
            </>
        )},
        {value: 'changepassword', label: (
            <>
                <p><LockClosed className="w-4 float-left py-1 mr-2" /><span> Change Password</span></p>
            </>
        )}
    ];

    const setSelectedMenu = selected => {
        Router.push({
            pathname: `http://localhost:3000/profile/${selected.value}/[pid]`,
            query: { pid: id }
        });
    }

    return ( 
        <ReactSelect
            instanceId="selected-account-menu"
            className="w-full max-w-lg mb-4 font-body shadow appearance-none"
            options={accountOptions}
            onChange={ selected => setSelectedMenu(selected) }
            name="style"
            value={accountOptions.filter(option => option.value === initialValue)}
        />
    );
}
 
export default SelectMenu;