import React from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { gql, useMutation } from '@apollo/client';
import { useToasts } from 'react-toast-notifications';

/* Components */
import Layout from '../components/layouts/Layout';
import Input from '../components/form/Input';
import MuffinImg from '../components/images/MuffinImg';

/* Apollo queries */
const FORGOT_PASSWORD = gql`
    mutation forgotPassword($input: EmailInput) {
        forgotPassword(input: $input)
    }
`;

const Forgot = () => {
    /* Set Toast Notification */
    const { addToast } = useToasts();

    /* Apollo mutation */
    const [ forgotPassword ] = useMutation(FORGOT_PASSWORD);

    /* React hook form */
    const { register, handleSubmit, errors } = useForm({
        mode: "onChange"
    });
    const onSubmit = async data => {
        const { email } = data;

        try {
            const { data } = await forgotPassword({
                variables: {
                    input: {
                        email,
                    }
                }
            });
            addToast(data.forgotPassword, { appearance: 'success' });
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
                                Can't login?
                            </h2>
                            <Input
                                label="We'll send a recovery link to"
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

                            <input 
                                className="btn-primary"
                                type="submit"
                                value="Send Recovery Link"
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
 
export default Forgot;