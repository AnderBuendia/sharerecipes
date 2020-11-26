import React from 'react';
import { gql, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';

const DELETE_USER = gql`
    mutation deleteUser($id: ID!) {
        deleteUser(id: $id)
    }
`;

const GET_USERS = gql`
    query getUsers {
        getUsers {
            id
            name
        }
    }
`;

const User = ({user}) => {
    const { id, name, email, role, confirmed } = user;

    const [ deleteUser ] = useMutation(DELETE_USER, {
        update(cache) {
            /* copy from cache object */
            const { getUsers } = cache.readQuery({ query: GET_USERS });

            /* write cache object */
            cache.writeQuery({
                query: GET_USERS,
                data: {
                    getUsers: getUsers.filter(currentUser => currentUser.id !== id)
                }
            })
        }
    });

    const confirmDeleteUser = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!'
        }).then( async (result) => {
            if (result.isConfirmed) {
                try {
                    const { data } = await deleteUser({
                        variables: {
                            id
                        }
                    });
        
                    /* Show alerts */
                    Swal.fire(
                        'Correct',
                        data.deleteUser,
                        'success'
                    );
                } catch (error) {
                    console.log(error);
                }
            }
        })
    }

    return (  
        <tr className="text-center font-roboto border-b border-gray-300">
            <td className="p-3">{name}</td>
            <td className="p-3">{email}</td>
            <td className="p-3"><span className={`${role === 'Admin' ? 'bg-purple-600 border-purple-600' : 'bg-yellow-600 border-yellow-600' } px-2 py-1 uppercase text-sm text-white rounded-full`}>{role}</span></td>
            <td className="p-3"><span className={`${confirmed ? 'bg-green-600 border-green-600' : 'bg-red-600 border-red-600'} rounded-full px-2 py-1 uppercase text-sm text-white`}>{confirmed ? 'Active' : 'No'}</span></td>
            <td className="p-3">
                <div className="flex w-full">
                    <button
                        type="button"
                        className="flex-1 bg-red-700 py-2 px-2 text-white rounded text-xs uppercase font-bold hover:bg-red-600"
                        onClick={ () => confirmDeleteUser() }
                    >
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );
}
 
export default User;