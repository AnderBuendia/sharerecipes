import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import Layout from '../../../components/layouts/Layout';
import User from '../../../components/User';
import UsersGroup from '../../../components/icons/usersgroup';

const GET_USER = gql`
    query getUser {
        getUser {
            id
            role
        }
    }
`;

const GET_USERS = gql`
    query getUsers {
        getUsers {
            total
            users {
                id
                name
                email
                role
                confirmed
            }
        }
    }
`;

const AdminUsers = () => {
    const router = useRouter();
    const { query: { pid: id } } = router;

    const { data: dataGetUser, loading: loadingGetUser} = useQuery(GET_USER, {
        variables: {
            id
        }
    });

    const { data: dataGetUsers, loading: loadingGetUsers } = useQuery(GET_USERS);

    if (loadingGetUser || loadingGetUsers) return null;

    const { getUser } = dataGetUser;
    const { getUsers } = dataGetUsers;

    if (getUser.role !== 'Admin') router.push('/404');

    return (  
        <Layout>
            <h2 className="text-4xl font-roboto font-bold text-gray-800 text-center my-4">
                All Users
            </h2>
            <div className="flex mx-auto w-2/5 lg:w-1/5 bg-white rounded-lg shadow-md p-4">
                
                <UsersGroup className="w-2/4" />
                <div className="flex-col">
                <p className="flex-1 flex-col mb-2 font-bold">Total Users</p>
                <p className="flex-1 flex-col font-bold text-center">{getUsers.total}</p>
                </div>
       
            </div>
            <div className="flex justify-center mt-5">
                <div className="w-full lg:w-4/5 overflow-x-auto bg-white rounded-lg shadow-md p-4">
                <table className="table-auto w-full">
                    <thead>
                        <tr className="w-full">
                            <th className="uppercase text-md border-b border-gray-300 w-2/6 py-2">Name</th>
                            <th className="uppercase text-md border-b border-gray-300 w-2/6 py-2">Email</th>
                            <th className="uppercase text-md border-b border-gray-300 w-1/6 py-2">Role</th>
                            <th className="uppercase text-md border-b border-gray-300 w-1/6 py-2">Active</th>
                            <th className="uppercase text-md border-b border-gray-300 w-1/6 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        { getUsers.users.map(user => (
                            <User key={user.id} user={user} />
                        ))}
                    </tbody>
                </table>
                </div>
            </div>
        </Layout>
    );
}
 
export default AdminUsers;