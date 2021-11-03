import { FC } from 'react';
import { useRouter } from 'next/router';
import ReactSelect from '@Components/generic/ReactSelect';
import { menuOptions } from '@Lib/utils/select-options/profile-mobile-menu';
import { SelectOption } from '@Interfaces/select/option.interface';
import { SingleValue } from 'react-select';
import { ProfilePaths } from '@Enums/paths/profile-paths.enum';

export type ProfileMobileMenuProps = {
  path: ProfilePaths;
};

const ProfileMobileMenu: FC<ProfileMobileMenuProps> = ({ path }) => {
  const router = useRouter();
  const valueArray = menuOptions.filter((option) => option.value === path);

  const handleChangeMenu = (option: SingleValue<SelectOption>) => {
    router.push({
      pathname: option?.value,
    });
  };

  return (
    <ReactSelect
      instance="selected-account-menu"
      style="w-full max-w-lg mb-4 font-body shadow appearance-none"
      options={menuOptions}
      handleChange={handleChangeMenu}
      value={valueArray[0]}
      name="menu"
    />
  );
};

export default ProfileMobileMenu;
