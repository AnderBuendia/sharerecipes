import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { gql, useMutation } from '@apollo/client';

/* Components */
import Layout from '../../components/layouts/Layout';
import Input from '../../components/form/Input';
import Img from '../../components/form/Img';
import Alert from '../../components/form/Alert';

/* Apollo queries */
const RESET_PASSWORD = gql`
    mutation resetPassword($input: UserPasswordInput) {
        resetPassword(input: $input) {
            message
        }
    }
`;

const ResetPassword = () => {
    /* Routing */
    const router = useRouter();
    const { query: { pid: token }} = router;

    /* useState alert message */
    const [message, setMessage] = useState(null);
    const [classAlert, setClassAlert] = useState(null);

    /* Apollo mutation */
    const [ resetPassword ] = useMutation(RESET_PASSWORD);

    /* React hook form */
    const { register, getValues, handleSubmit, errors } = useForm({
        mode: "onChange"
    });
    const onSubmit = async data => {
        const { password } = data;
        try {
            const { data } = await resetPassword({
                variables: {
                    input: {
                        token,
                        password
                    }
                }
            });
            const { message } = data.resetPassword;
            setMessage(message);

            setTimeout(() => {
                setMessage(null);
                router.push('/login');
            }, 4000);
        } catch (error) {
            console.log(error.message)
            const { errorMessage, errorClass } = JSON.parse(error.message.replace('Error:', ''));
            setMessage(errorMessage);
            setClassAlert(errorClass);
            setTimeout(() => {
                setMessage(null);
                setClassAlert(null);
                router.push('/forgot');
            }, 3000);
        }
    };

    return ( 
        <Layout>
            <div className="md:w-4/5 xl:w-3/5 mx-auto mb-32">
                <div className="flex justify-center mx-auto w-32">
                    <Img />
                </div>
                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-lg bg-white rounded-lg shadow-md px-8 pt-6 pb-8 mb-4">
                        { message && <Alert message={message} error={classAlert} /> }
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <h2 className="text-4xl font-roboto font-bold text-gray-800 text-center my-4">
                                Reset Your Password
                            </h2>
                            <Input
                                label="New Password"
                                name="password"
                                type="password"
                                placeholder="Introduce a New Password"
                                childRef={register({ 
                                    required: "A new password is required",
                                    minLength: {
                                        value: 7,
                                        message: 'Minimum 7 characters'
                                    }, 
                                })}
                                error={errors.password}
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
                                            const { password } = getValues();
                                            return password === value || "Passwords should match!";
                                        }
                                    }
                                })}
                                error={errors.confirmpassword}
                            />
                            
                            <input 
                                className="btn-primary"
                                type="submit"
                                value="Reset Password"
                            />
                         
                        </form>       
                        <div>
                            <div className="border-gray border-t-2 block mt-8 text-center"></div>
                            <div className="w-full">
                                <Link href="/login"><a className="btn-default">Return to Login</a></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
 
export default ResetPassword;