import { LockClosed } from '@Components/Icons/lock-closed.icon';
import { HomeIcon } from '@Components/Icons/home.icon';
import { DocumentIcon } from '@Components/Icons/document.icon';
import { ProfilePaths } from '@Enums/paths/profile-paths.enum';

export const menuOptions = [
  {
    value: ProfilePaths.MAIN,
    label: (
      <>
        <p>
          <HomeIcon className="w-4 float-left py-1 mr-2" />
          <span>Profile</span>
        </p>
      </>
    ),
  },
  {
    value: ProfilePaths.PASSWORD,
    label: (
      <>
        <p>
          <LockClosed className="w-4 float-left py-1 mr-2" />
          <span>Change Password</span>
        </p>
      </>
    ),
  },
  {
    value: ProfilePaths.RECIPES,
    label: (
      <>
        <p>
          <DocumentIcon className="w-4 float-left py-1 mr-2" />
          <span>My Recipes</span>
        </p>
      </>
    ),
  },
];
