import React from 'react';
import { useMutation } from '@apollo/client';
import Swal from 'sweetalert2';
import { DELETE_USER } from '../../lib/graphql/user/mutation';
import { UserRoles } from '../../enums/user/user-roles';
import { GET_USERS } from '../../lib/graphql/user/query';

const User = ({user, page}) => {
    const { name, email, role, confirmed } = user;

    const [ deleteUser ] = useMutation(DELETE_USER, {
        update(cache) {
            const { getUsers } = cache.readQuery({ 
                query: GET_USERS,
                variables: {
                    offset: page * 9,
                    limit: 9
                }
            });

            cache.writeQuery({
                query: GET_USERS,
                data: {
                    getUsers: getUsers.users.filter(currentUser => currentUser.email !== email)
                }
            })
        }
    });

    const confirmDeleteUser = async email => {
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
                            email,
                        }
                    });
        
                    /* Show alerts */
                    Swal.fire(
                        'Correct',
                        'User has been deleted',
                        'success'
                    );
                } catch (error) {
                    console.log(error);
                }
            }
        })
    }

    return (  
        <tr className="text-center font-roboto border-t border-gray-200">
            <td className="p-3">{name}</td>
            <td className="p-3">{email}</td>
            <td className="p-3"><span className={`${role.includes(UserRoles.ADMIN) ? 'bg-purple-600 border-purple-600' : 'bg-yellow-600 border-yellow-600' } px-2 py-1 uppercase text-sm text-white rounded-full`}>{role}</span></td>
            <td className="p-3"><span className={`${confirmed ? 'bg-green-600 border-green-600' : 'bg-red-600 border-red-600'} rounded-full px-2 py-1 uppercase text-sm text-white`}>{confirmed ? 'Active' : 'Inactive'}</span></td>
            <td className="p-3">
                <div className="flex w-full">
                    <button
                        type="button"
                        className="flex-1 bg-red-700 py-2 px-2 text-white rounded text-xs uppercase font-bold hover:bg-red-600"
                        onClick={ () => confirmDeleteUser(email) }
                    >
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );
}
 
export default User;