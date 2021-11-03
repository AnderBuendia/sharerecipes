import { FC } from 'react';
import Swal from 'sweetalert2';
import useDeleteUser from '@Lib/hooks/user/useDeleteUser';
import { UserRoles } from '@Enums/user/user-roles.enum';
import { UserProfile } from '@Interfaces/auth/user.interface';

export type UserProps = {
  user: UserProfile;
  page: number;
};

const User: FC<UserProps> = ({ user, page }) => {
  const { name, email, role, confirmed } = user;
  const { setDeleteUser } = useDeleteUser({
    offset: page * 9,
    limit: 9,
    email,
  });

  const confirmDeleteUser = async (email: string) => {
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
        const response = await setDeleteUser({ email });

        if (response) {
          Swal.fire('Correct', 'User has been deleted', 'success');
        }
      }
    });
  };

  return (
    <tr className="text-center font-roboto border-t border-gray-200">
      <td className="p-3">{name}</td>
      <td className="p-3">{email}</td>
      <td className="p-3">
        <span
          className={`${
            role.includes(UserRoles.ADMIN)
              ? 'bg-purple-600 border-purple-600'
              : 'bg-yellow-600 border-yellow-600'
          } px-2 py-1 uppercase text-sm text-white rounded-full`}
        >
          {role}
        </span>
      </td>
      <td className="p-3">
        <span
          className={`${
            confirmed
              ? 'bg-green-600 border-green-600'
              : 'bg-red-600 border-red-600'
          } rounded-full px-2 py-1 uppercase text-sm text-white`}
        >
          {confirmed ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="p-3">
        <div className="flex w-full">
          <button
            type="button"
            className="flex-1 bg-red-700 py-2 px-2 text-white rounded text-xs uppercase font-bold hover:bg-red-600"
            onClick={() => confirmDeleteUser(email)}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default User;
