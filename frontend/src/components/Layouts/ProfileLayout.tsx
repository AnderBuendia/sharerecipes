import { FC } from 'react';
import { useResolution } from '@Lib/hooks/useResolution';
import ProfileMenu from '@Components/Profile/profile-menu';
import ProfileMobileMenu from '@Components/Profile/profile-mobile-menu';
import ProfileData from '@Components/Profile/sections/profile-data';
import ProfilePassword from '@Components/Profile/sections/profile-password';
import ProfileRecipes from '@Components/Profile/sections/profile-recipes';
import { ProfilePaths } from '@Enums/paths/profile-paths.enum';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { ResolutionBreakPoints } from '@Enums/config/resolution-breakpoints.enum';
import Head from '@Components/generic/Head';

export type ProfileLayoutProps = {
  path: ProfilePaths;
};

const ProfileLayout: FC<ProfileLayoutProps> = ({ path }) => {
  const width = useResolution();

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
    },
  };

  const { Component, title } = components[path];

  if (!Component) return null;

  return (
    <>
      <Head title={title} description={title} url={MainPaths.PROFILE} />
      {isMobile ? (
        <div className="container mx-auto w-11/12 py-8">
          <ProfileMobileMenu path={path} />
          <h1 className="mt-8 text-center text-2xl font-bold font-roboto">
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
              className="w-11/12 text-2xl font-roboto pb-2 text-left
                border-b border-gray-400"
            >
              {title}
            </h1>
            <Component />
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileLayout;
