import React from 'react';
import { useRouter } from 'next/router';
import MenuLiLink from '../generic/MenuLiLink';
import { ProfilePaths } from '../../enums/paths/profile-paths';

const ProfileMenu = () => {
  const router = useRouter();
  const currentPath = router.asPath.split('?')[0];

  return (
    <div className="w-11/12 mx-auto bg-white dark:bg-gray-700">
      <ul className="h-full border border-gray-400 rounded-md">
        <MenuLiLink
          href={ProfilePaths.MAIN}
          active={currentPath === ProfilePaths.MAIN}
          label="Profile"
        />
        <MenuLiLink
          href={ProfilePaths.PASSWORD}
          active={currentPath === ProfilePaths.PASSWORD}
          label="Change Password"
        />
        <MenuLiLink
          href={ProfilePaths.RECIPES}
          active={currentPath === ProfilePaths.RECIPES}
          label="My Recipes"
        />
      </ul>
    </div>
  );
};

export default ProfileMenu;
