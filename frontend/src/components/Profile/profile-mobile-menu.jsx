import React from 'react';
import Router from 'next/router';
import ReactSelect from '@Components/generic/ReactSelect';
import { menuOptions } from '@Enums/select-options/profile-mobile-menu';

const ProfileMobileMenu = ({ path }) => {
  const setSelectedMenu = (selected) => {
    Router.push({
      pathname: selected.value,
    });
  };

  return (
    <ReactSelect
      instance="selected-account-menu"
      style="w-full max-w-lg mb-4 font-body shadow appearance-none"
      options={menuOptions}
      handleChange={(selected) => setSelectedMenu(selected)}
      value={menuOptions.filter((option) => option.value === path)}
    />
  );
};

export default ProfileMobileMenu;
