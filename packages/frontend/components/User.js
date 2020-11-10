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
    const { id, name, email, role } = user;

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
        <tr className="font-roboto">
            <td className="border px-4 py-2">{name}</td>
            <td className="border px-4 py-2">{email}</td>
            <td className="border px-4 py-2">{role}</td>
            <td className="border px-4 py-2">
                <div className="flex w-full">
                    <button
                        type="button"
                        className="flex-1 bg-red-700 py-2 px-4 text-white rounded text-xs uppercase font-bold"
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