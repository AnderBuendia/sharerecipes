import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import Layout from '../../../components/layouts/Layout';
import Input from '../../../components/form/Input';
import SelectMenu from '../../../components/edituserform/selectMenu';
import { useToasts } from 'react-toast-notifications';

const UPDATE_USER_PASSWORD = gql`
    mutation updateUserPassword($id: ID!, $input: UserPasswordInput) {
        updateUserPassword(id: $id, input: $input) {
            name
        }
    }
`;

const EditUserAccount = () => {
    /* Get current ID */
    const router = useRouter();
    const { query: { pid: id }} = router;

    /* Set Toast Notification */
    const { addToast } = useToasts();

    /* Apollo mutation to update data user */
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
                    id,
                    input: {
                        password,
                        confirmpassword
                    }
                }
            });

            addToast('Your password has been changed', { appearance: 'success' });
        } catch (error) {
            addToast(error.message.replace('GraphQL error: ', ''), { appearance: 'error' });
        }
    }
  
    return (  
        <Layout>
              <div className="md:w-4/5 xl:w-3/5 mx-auto mb-32">
                <div className="flex justify-center mt-5">
                    <SelectMenu initialValue="changepassword" id={id} />
                </div>
                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-lg bg-white rounded-lg shadow-md px-8 pt-6 pb-8 mb-4">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <h2 className="text-4xl font-roboto font-bold text-gray-800 text-center my-4">
                                Change your Password
                            </h2>
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
                </div>
            </div>
        </Layout>
    );
}
 
export default EditUserAccount;