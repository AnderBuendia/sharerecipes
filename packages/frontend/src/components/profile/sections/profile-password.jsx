import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { useToasts } from 'react-toast-notifications';
import AuthContext from '../../../lib/context/auth/authContext';
import { UPDATE_USER_PASSWORD } from '../../../lib/graphql/user/mutation';
import { ProfilePaths } from '../../../enums/paths/profile-paths';
import Input from '../../generic/Input';

const ProfilePassword = () => {
    const { authState } = useContext(AuthContext)
    const { addToast } = useToasts();
    
    const router = useRouter();

    /* Apollo mutation to update password */
    const [ updateUserPassword ] = useMutation(UPDATE_USER_PASSWORD);
    
     /* React hook form */
     const { register, handleSubmit, getValues, errors } = useForm({
        mode: "onChange"
    });

    const onSubmit = async data => {
        const { confirmpassword, password } = data;
        try { 
            const { data } = await updateUserPassword({
                variables: {
                    input: {
                        email: authState.user.email,
                        password,
                        confirmpassword,
                    }
                }
            });

            addToast('Your password has been changed', { appearance: 'success' });
            router.push(ProfilePaths.MAIN);
        } catch (error) {
            addToast(error.message.replace('GraphQL error: ', ''), { appearance: 'error' });
        }
    }

    return (  
        <div className="mdxl:w-11/12 bg-white rounded-lg shadow-md mt-3 p-5">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Introduce your Password"
                    childRef={register({ required: "Your current password is required" })}
                    error={errors.password}
                />

                <Input
                    label="New Password"
                    name="newpassword"
                    type="password"
                    placeholder="Introduce a New Password"
                    childRef={register({ 
                        required: "A new password is required",
                        minLength: {
                            value: 7,
                            message: 'Minimum 7 characters'
                        },
                    })}
                    error={errors.newpassword}
                />

                <Input
                    label="Confirm Password"
                    name="confirmpassword"
                    type="password"
                    placeholder="Confirm New Password"
                    childRef={register({ 
                        required:  "Please, confirm new password",
                        validate: {
                            matchesPreviousPassword: value => {
                                const { newpassword } = getValues();
                                return newpassword === value || "Passwords should match!";
                            }
                        }
                    })}
                    error={errors.confirmpassword}
                />

                <input 
                    className="btn-primary"
                    type="submit"
                    value="Change Password"
                />
                
            </form>  
        </div>
    );
}
 
export default ProfilePassword;