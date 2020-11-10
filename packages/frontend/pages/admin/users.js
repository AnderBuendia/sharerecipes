import React from 'react';
import { gql, useQuery } from '@apollo/client';
import Layout from '../../components/layouts/Layout';
import User from '../../components/User';

const GET_USERS = gql`
    query getUsers {
        getUsers {
            id
            name
            email
            role
        }
    }
`;

const AdminUsers = () => {
    const { data, loading, error } = useQuery(GET_USERS);

    if (loading) return null;

    const { getUsers } = data;

    return (  
        <Layout>
            <h1 className="text-4xl font-body font-bold text-center items-center justify-center mb-4">All Users</h1>
            <div className="overflow-x-scroll">
            <table className="table-auto shadow-md mt-4 w-full w-lg">
                <thead className="bg-gray-700">
                    <tr className="text-white">
                        <th className="border border-gray-800 shadow-lg w-1/5 py-2">Name</th>
                        <th className="border border-gray-800 shadow-lg w-1/5 py-2">Email</th>
                        <th className="border border-gray-800 shadow-lg w-1/5 py-2">Role</th>
                        <th className="border border-gray-800 shadow-lg w-1/5 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                { getUsers.map(user => (
                    <User key={user.id} user={user} />
                ))}
                </tbody>
            </table>
            </div>
        </Layout>
    );
}
 
export default AdminUsers;