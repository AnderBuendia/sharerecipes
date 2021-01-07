import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useToasts } from 'react-toast-notifications';
import imagesContext from '../../../context/images/imagesContext';
import Layout from '../../../components/layouts/Layout';
import Input from '../../../components/form/Input';
import SelectMenu from '../../../components/edituserform/selectMenu';
import DragDropImage from '../../../components/form/DragDropImage';
import Spinner from '../../../components/generic/Spinner';


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

    /* Set Toast Notification */
    const { addToast } = useToasts();

    /* Set new user image */
    const ImagesContext = useContext(imagesContext);
    const { user_image, setUserImage } = ImagesContext;
    const { image_url: user_image_url } = user_image;

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
                        password
                    }
                }  
            });
            addToast('Your user data has been changed', { appearance: 'success' });

            /* Redirect to Home Page */
            setTimeout(() => {
                location.reload();
            }, 3000);
        } catch (error) {
            addToast(error.message.replace('GraphQL error: ', ''), { appearance: 'error' });
        }
    }

    /* Apollo query to get data recipe */
    const { data, loading, error } = useQuery(GET_USER, {
        variables: {
            id
        }
    });

    if (loading) return <Spinner />;

    const { name, email, image_url } = data.getUser;

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
                        <h2 className="text-4xl font-roboto font-bold text-gray-800 text-center my-4">
                            Edit Your Account
                        </h2>
                        <div className="flex w-32 h-32 overflow-hidden mx-auto rounded-full my-4">
                            <DragDropImage 
                                url={process.env.backendURL + '/upload/user'}
                                current={user_image_url ? user_image_url : image_url}
                                userData={data.getUser}
                                name='photo'
                                ratio={1}
                                rounded
                                onChange={url => setUserImage(url)}
                            />
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)}>
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

export default EditUserAccount;