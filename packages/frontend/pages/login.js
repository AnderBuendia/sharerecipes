import React from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { gql, useMutation } from '@apollo/client';
import { setAccessToken } from '../lib/accessToken';
import { useToasts } from 'react-toast-notifications';

/* Components */
import Layout from '../components/layouts/Layout';
import Input from '../components/form/Input';
import MuffinImg from '../components/images/MuffinImg';

const AUTH_USER = gql`
    mutation authenticateUser($input: AuthenticateInput) {
        authenticateUser(input: $input) {
            accessToken
        }
    }
`;

const Login = () => {
    /* Routing */
    const router = useRouter();

    /* Set Toast Notification */
    const { addToast } = useToasts();

    /* Apollo mutation */
    const [ authenticateUser ] = useMutation(AUTH_USER);

    /* React hook form */
    const { register, handleSubmit, errors } = useForm({
        mode: "onChange"
    });
    const onSubmit = async data => {
        const { email, password } = data;

        try {
            const { data } = await authenticateUser({
                variables: {
                    input: {
                        email,
                        password
                    }
                }
            });
            addToast('Authenticating...', { appearance: 'success' });

            if (data) {
                setAccessToken(data.authenticateUser.accessToken);
            }

            /* Redirect to Home Page with user data */
            setTimeout(() => {
                router.push('/');
            }, 3000);
        } catch (error) {
            addToast(error.message.replace('GraphQL error: ', ''), { appearance: 'error' });
        }
    };

    return ( 
        <Layout>
            <div className="md:w-4/5 xl:w-3/5 mx-auto mb-32">
                <div className="flex justify-center mx-auto w-32">
                    <MuffinImg />
                </div>
                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-lg bg-white rounded-lg shadow-md px-8 pt-6 pb-8 mb-4">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <h2 className="text-4xl font-roboto font-bold text-gray-800 text-center my-4">
                                Login Your Account
                            </h2>
                            <Input
                                label="Email"
                                name="email"
                                type="text"
                                placeholder="example@example.com"
                                childRef={register({
                                    required: "Email is required", 
                                    pattern: {
                                        value: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                                        message: "This format is invalid. Please, make sure it's written like example@email.com"
                                    }
                                })}
                                error={errors.email}
                            />

                            <Input
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="Password"
                                childRef={register({
                                    required: "Password is required", 
                                    minLength: {
                                        value: 7,
                                        message: 'Minimum 7 characters'
                                    },
                                })}
                                error={errors.password}
                            />

                            <input 
                                className="btn-primary"
                                type="submit"
                                value="Login"
                            />
                         
                        </form>
                                  
                        <div>
                            <div className="w-full text-right mt-4">
                                <Link href="/forgot">
                                    <a className="text-md font-roboto underline font-medium text-gray-500 mt-8 text-center">Forgot Password?</a>
                                </Link>
                            </div>
                            <div className="border-gray border-t-2 block mt-8 text-center"></div>
                            <div className="w-full">
                                <p className="text-lg font-roboto font-bold text-gray-800 mt-8 text-center">You don't have an account?</p>
                                <Link href="/signup"><a className="btn-default">Create New Account</a></Link>
                            </div>
                        </div>

                        
                    </div>
                </div>
            </div>
        </Layout>
    );
}
 
export default Login;