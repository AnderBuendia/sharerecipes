import React from 'react';
import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useToasts } from 'react-toast-notifications';
import Layout from '../components/layouts/Layout';
import Input from '../components/form/Input';
import MuffinImg from '../components/images/MuffinImg';

/* Apollo queries */
const CREATE_USER = gql`
    mutation newUser($input: UserInput) {
        newUser(input: $input) {
            id
            name
            email
        }
    }
`;

const SignUp = () => {
    /* Routing */
    const router = useRouter();

    /* Set Toast Notification */
    const { addToast } = useToasts();

    /* Apollo mutation */
    const [ newUser ] = useMutation(CREATE_USER);

    /* React hook form */
    const { register, handleSubmit, errors } = useForm({
        mode: "onChange"
    });
    const onSubmit = async data => {
        const { name, email, password } = data;

        try {
            const { data } = await newUser({
                variables: {
                    input: {
                        name,
                        email,
                        password
                    }
                }
            });
            addToast(`User was created succesfully created.
            Please, check your email to confirm your account.`, { appearance: 'success' });
            
            /* Redirect to Home Page */
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
                                Create Your Account
                            </h2>
                            <Input
                                label="Username"
                                name="name"
                                type="text"
                                placeholder="Introduce your Name"
                                childRef={register({required: { value: true, message: "User is required" }})}
                                error={errors.name}
                            />

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
                                value="Create Account"
                            />
                        </form>
                        <p className="text-lg font-roboto font-bold text-gray-800 mt-8 text-center">Have an account? <Link href="/login"><a className="underline text-blue-400">Log in</a></Link></p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
 
export default SignUp;