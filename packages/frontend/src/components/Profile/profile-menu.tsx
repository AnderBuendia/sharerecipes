import { FC } from 'react';
import { useRouter } from 'next/router';
import MenuLiLink from '@Components/generic/MenuLiLink';
import { ProfilePaths } from '@Enums/paths/profile-paths.enum';

const ProfileMenu: FC = () => {
  const router = useRouter();
  const currentPath = router.asPath.split('?')[0];

  return (
    <ul className="dark:bg-gray-700 border bg-white border-gray-400 rounded-md">
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
  );
};

export default ProfileMenu;
