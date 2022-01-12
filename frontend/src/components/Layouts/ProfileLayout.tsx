import { FC } from 'react';
import { useResolution } from '@Lib/hooks/useResolution';
import ProfileMenu from '@Components/Profile/profile-menu';
import ProfileMobileMenu from '@Components/Profile/profile-mobile-menu';
import ProfileData from '@Components/Profile/sections/profile-data';
import ProfilePassword from '@Components/Profile/sections/profile-password';
import ProfileRecipes from '@Components/Profile/sections/profile-recipes';
import Head from '@Components/generic/Head';
import { ProfilePaths } from '@Enums/paths/profile-paths.enum';
import { MainPaths } from '@Enums/paths/main-paths.enum';

export type ProfileLayoutProps = {
  path: ProfilePaths;
};

const ProfileLayout: FC<ProfileLayoutProps> = ({ path }) => {
  const isNarrowScreen = useResolution();

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

      <div className="container m-auto w-11/12 min-h-screen py-5">
        {isNarrowScreen ? (
          <>
            <ProfileMobileMenu path={path} />
            <h1 className="mt-8 text-center text-2xl font-bold font-roboto">
              {title}
            </h1>
            <Component />
          </>
        ) : (
          <div className="flex">
            <div className="w-1/4 mr-3">
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
      </div>
    </>
  );
};

export default ProfileLayout;
