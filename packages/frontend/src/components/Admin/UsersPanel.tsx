import type { FC, ChangeEvent } from 'react';
import { searchFilterUsers } from '@Lib/utils/search-filter.utils';
import User from '@Components/Admin/User';
import Pagination from '@Components/Admin/Pagination';
import { UsersGroupIcon } from '@Components/Icons/users-group.icon';
import type { UserProfile } from '@Interfaces/domain/user.interface';

export type UsersPanelProps = {
  userQuery: string;
  handleUserQuery: (e: ChangeEvent<HTMLInputElement>) => void;
  handlePage: (e: number) => void;
  handleRouterPage: (e: number) => void;
  page: number;
  totalUsers: number;
  users: UserProfile[];
};

const UsersPanel: FC<UsersPanelProps> = ({
  userQuery,
  handleUserQuery,
  handlePage,
  handleRouterPage,
  page,
  users,
  totalUsers,
}) => {
  const totalPages = Math.ceil(totalUsers / 9);

  if (userQuery) users = searchFilterUsers(users, userQuery);

  return (
    <>
      <h2 className="text-4xl font-roboto font-bold text-center mb-2">
        All Users
      </h2>
      <div className="flex flex-row justify-between w-full">
        <div className="mx-auto flex justify-between items-center w-2/6 lg:w-1/5 bg-white rounded-lg shadow-md py-2 px-6 dark:bg-gray-700">
          <UsersGroupIcon w={70} h={70} />
          <div className="flex flex-col">
            <p className="mb-2 ml-2 font-bold">Users</p>
            <p className="font-bold text-center">{totalUsers}</p>
          </div>
        </div>
        <div className="flex mx-auto w-3/5 lg:w-2/6 bg-white rounded-lg shadow-md p-4 dark:bg-gray-700">
          <input
            type="search"
            value={userQuery}
            placeholder="Filter..."
            className="bg-white h-12 w-full py-4 px-4 border-2 border-gray-700 placeholder-gray-700 rounded-lg text-sm focus:outline-none dark:bg-gray-300 dark:text-black"
            onChange={handleUserQuery}
          />
        </div>
      </div>

      <div className="flex justify-center mt-5">
        <div className="w-full lg:w-4/5 overflow-x-auto bg-white rounded-lg shadow-md p-4 dark:bg-gray-700">
          <table className="table-auto w-full">
            <thead>
              <tr className="w-full dark:bg-gray-700">
                <th className="head-users-panel">Name</th>
                <th className="head-users-panel">Email</th>
                <th className="head-users-panel">Role</th>
                <th className="head-users-panel">Active</th>
                <th className="head-users-panel">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-700">
              {users?.map((user, index) => (
                <User key={index} user={user} page={page} />
              ))}
            </tbody>
          </table>

          {totalPages && (
            <Pagination
              totalPages={totalPages}
              current={page}
              onPageChange={(e: number) => {
                handlePage(e);
                handleRouterPage(e);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default UsersPanel;
