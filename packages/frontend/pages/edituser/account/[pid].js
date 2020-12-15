import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { gql, useQuery, useMutation } from '@apollo/client';
import Layout from '../../../components/layouts/Layout';
import Input from '../../../components/form/Input';
import SelectMenu from '../../../components/edituserform/selectMenu';
import Alert from '../../../components/form/Alert';
import UploadUserImage from '../../../components/edituserform/UploadUserImage';
import { initializeApollo } from '../../../config/apollo';

const GET_USER = gql`
    query getUser {
        getUser {
            id
            name
            email
            image_url
            image_name
        }
    }
`;

const UPDATE_USER = gql`
    mutation updateUser($id: ID!, $input: UserInput) {
        updateUser(id: $id, input: $input) { 
            id
        }
    }
`;

const EditUserAccount = () => {
    /* Get current ID */
    const router = useRouter();
    const { query: { pid: id }} = router;

    /* Set a message login */
    const [message, setMessage] = useState(null);

    /* To get url from DropZone */
    const [urlFileImage, setUrlFileImage] = useState('');

    /* Url and filename from Upload DropZone User */
    const { url, fileName } = urlFileImage;

    /* Apollo mutation to update data user */
    const [ updateUser ] = useMutation(UPDATE_USER);

    /* React hook form */
    const { register, handleSubmit, errors } = useForm({
        mode: "onChange"
    });

    const onSubmit = async data => {
        const { name, email, password } = data;
        try {
            const { data } = await updateUser({
                variables: {
                    id,
                    input: {
                        name,
                        email,
                        password,
                        image_url: url,
                        image_name: fileName
                    }
                }  
            });

            setMessage("Your user data has been changed");

            /* Redirect to Home Page */
            setTimeout(() => {
                setMessage(null);
                location.reload();
            }, 2000);
        } catch (error) {
            setMessage(error.message.replace('GraphQL error: ', ''));
            setTimeout(() => {
                setMessage(null);
            }, 3000);
        }
    }

    /* Apollo query to get data recipe */
    const { data, loading, error } = useQuery(GET_USER, {
        variables: {
            id
        }
    });

    if (loading) return null;
    const { name, email } = data.getUser;

    const initialValues = {
        name,
        email 
    }
  
    return (  
        <Layout>
              <div className="md:w-4/5 xl:w-3/5 mx-auto mb-32">
                <div className="flex justify-center mt-5">
                    <SelectMenu initialValue="account" id={id} />
                </div>
                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-lg bg-white rounded-lg shadow-md px-8 pt-6 pb-8 mb-4">
                    { message && <Alert message={message} /> }
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <h2 className="text-4xl font-roboto font-bold text-gray-800 text-center my-4">
                                Edit Your Account
                            </h2>

                            <UploadUserImage 
                                handleUrlFileUser={setUrlFileImage}
                                handleMessage={setMessage}
                                userData={data.getUser}
                            />

                            <Input
                                label="Username"
                                name="name"
                                type="text"
                                placeholder="Introduce your Name"
                                initialValue={initialValues.name}
                                childRef={register({required: { required: true, message: "User is required" }})}
                                error={errors.name}
                            />

                            <Input
                                label="Email"
                                name="email"
                                type="text"
                                placeholder="example@example.com"
                                initialValue={initialValues.email}
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
                                    required: "Your current password is required"
                                })}
                                error={errors.password}
                            />

                            <input 
                                className="btn-primary"
                                type="submit"
                                value="Edit account"
                            />
                         
                        </form>  
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export const getServerSideProps = async (ctx) => {
    const apolloClient = initializeApollo(null, ctx);

    await apolloClient.query({
        query: GET_USER
    });

    return {
        props: {
            initialApolloState: apolloClient.cache.extract(),
        }
    }
}
 
export default EditUserAccount;