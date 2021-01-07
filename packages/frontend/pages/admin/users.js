import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import Layout from '../../components/layouts/Layout';
import User from '../../components/adminpanel/User';
import UsersGroup from '../../components/icons/usersgroup';
import Pagination from '../../components/adminpanel/Pagination';
import Spinner from '../../components/generic/Spinner';

const GET_USER = gql`
    query getUser {
        getUser {
            id
            role
        }
    }
`;

const GET_USERS = gql`
    query getUsers($offset: Int, $limit: Int) {
        getUsers(offset: $offset, limit: $limit) {
            users {
                id
                name
                email
                role
                confirmed
            }
            total
        }
    }
`;

const AdminUsers = () => {
    /* Routing */
    const router = useRouter();
    const { query: { page: numberpage } } = router;

    /* Pagination */
    const [page, setPage] = useState(parseInt(numberpage || '0'));

    /* Filtering */
    const [q, setQ] = useState('');

    const searchUser = rows => {
        const columns = rows[0] && Object.keys(rows[0]);

        users = rows.filter(row => columns.some(column => 
            row[column].toString().toLowerCase().indexOf(q) > -1
        ));

        return users;
    } 

    /* Apollo queries */
    const { data: dataGetUser, loading: loadingGetUser } = useQuery(GET_USER);
    const { data: dataGetUsers, loading: loadingGetUsers } = useQuery(GET_USERS, {
        fetchPolicy: 'cache-and-network',
        variables: {
            offset: page * 9,
            limit: 9,
        }
    });
   
    if (loadingGetUser || loadingGetUsers) return <Spinner />;

    const { getUser } = dataGetUser;
    const totalPages = dataGetUsers ? Math.ceil(dataGetUsers.getUsers.total / 9) : null
    let users = dataGetUsers ? dataGetUsers.getUsers.users : null;

    if (users) {
        searchUser(users);
    }

    /* Not enough permissions to go to the panel admin */
    if (getUser.role !== 'Admin') router.push('/404');

    return (  
        <Layout>
            <h2 className="text-4xl font-roboto font-bold text-gray-800 text-center my-4">
                All Users
            </h2>
            <div className="flex flex-row justify-between ">
                <div className="mx-auto flex w-2/6 lg:w-1/5 bg-white rounded-lg shadow-md p-4">
                    <UsersGroup className="w-2/4" />
                    <div className="flex-col">
                        <p className="flex-1 flex-col mb-2 font-bold">Total Users</p>
                        <p className="flex-1 flex-col font-bold text-center">{dataGetUsers.getUsers.total}</p>
                    </div>
                </div>
                <div className="flex mx-auto w-3/5 lg:w-2/6 bg-white rounded-lg shadow-md p-4">
                <input 
                    type="search" 
                    value={q}
                    placeholder="Filter..." 
                    className="bg-white h-12 w-full py-4 px-4 border-2 border-gray-700 placeholder-gray-700 rounded-lg text-sm focus:outline-none"
                    onChange={ e => setQ(e.target.value) }
                />
                </div>
            </div>
            
            <div className="flex justify-center mt-5">
                <div className="w-full lg:w-4/5 overflow-x-auto bg-white rounded-lg shadow-md p-4">
                <table className="table-auto w-full">
                    <thead>
                        <tr className="w-full">
                            <th className="uppercase text-center text-md border-b border-gray-300 w-2/6 py-2">Name</th>
                            <th className="uppercase text-center text-md border-b border-gray-300 w-2/6 py-2">Email</th>
                            <th className="uppercase text-center text-md border-b border-gray-300 w-1/6 py-2">Role</th>
                            <th className="uppercase text-center text-md border-b border-gray-300 w-1/6 py-2">Active</th>
                            <th className="uppercase text-center text-md border-b border-gray-300 w-1/6 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        { users.map(user => (
                            <User 
                                key={user.id} 
                                user={user} 
                                q={GET_USERS}
                                page={page}
                            />
                        ))}
                    </tbody>
                </table>

                <Pagination 
                    totalPages={totalPages} 
                    current={page} 
                    onPageChange={ e => {
                        setPage(e);
                        router.push(router.route + '/?page=' + e, undefined, { shallow: true});
                    }}
                />
                </div>
            </div>
        </Layout>
    );
}

export default AdminUsers;