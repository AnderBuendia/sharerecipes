import type { FC } from 'react';
import Swal from 'sweetalert2';
import { useDeleteUser } from '@Application/use-case/user/delete-user.use-case';
import { UserRoles } from '@Enums/user/user-roles.enum';
import type { UserProfile } from '@Interfaces/domain/user.interface';

const NUMBER_OF_USERS_TO_SHOW = 9;
const USER_CONFIRMED = 'Active';
const USER_NOT_CONFIRMED = 'Inactive';

export type UserProps = {
  user: UserProfile;
  page: number;
};

const User: FC<UserProps> = ({ user, page }) => {
  const { name, email, role, confirmed } = user;
  const { deleteUser } = useDeleteUser({
    offset: page * NUMBER_OF_USERS_TO_SHOW,
    limit: NUMBER_OF_USERS_TO_SHOW,
    email,
  });

  const confirmDeleteUser = async (email: UserProfile['email']) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await deleteUser({ email });

        if (response) {
          Swal.fire('Correct', 'User has been deleted', 'success');
        }
      }
    });
  };

  const roleStyle = role.includes(UserRoles.ADMIN)
    ? 'bg-purple-600 border-purple-600'
    : 'bg-yellow-600 border-yellow-600';

  const confirmedStyle = confirmed
    ? 'bg-green-600 border-green-600'
    : 'bg-red-600 border-red-600';

  return (
    <tr className="text-center font-roboto border-t border-gray-200">
      <td className="p-3">{name}</td>
      <td className="p-3">{email}</td>
      <td className="p-3">
        <span
          className={`${roleStyle} px-2 py-1 uppercase text-sm text-white rounded-full`}
        >
          {role}
        </span>
      </td>
      <td className="p-3">
        <span
          className={`${confirmedStyle} rounded-full px-2 py-1 uppercase text-sm text-white`}
        >
          {confirmed ? USER_CONFIRMED : USER_NOT_CONFIRMED}
        </span>
      </td>
      <td className="p-3">
        <button
          type="button"
          className="bg-red-700 py-2 px-2 text-white rounded text-xs uppercase font-bold hover:bg-red-600"
          onClick={() => confirmDeleteUser(email)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default User;
