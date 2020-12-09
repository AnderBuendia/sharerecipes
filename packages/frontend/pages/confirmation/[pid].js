import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { gql, useMutation } from '@apollo/client';
import Layout from '../../components/layouts/Layout';

const CONFIRM_USER = gql`
    mutation confirmUser($input: TokenInput) {
        confirmUser(input: $input)
    }
`;

const Confirmation = () => {
    /* Confirmation message state */
    const [messageConfirmation, setMessageConfirmation] = useState(null);

    const router = useRouter();
    const { query: { pid: token }} = router;

    const [ confirmUser ] = useMutation(CONFIRM_USER);

    useEffect(() => {
        response(token);
    }, [token]);

    const response = async token => { 
        try {
            const { data } = await confirmUser({
                variables: {
                    input: {
                        token
                    }
                }
            });

            setMessageConfirmation(data.confirmUser);

            /* Redirect to login */
            setTimeout(() => {
                setMessageConfirmation(null);
                router.push("/login")
            }, 5000);

        } catch (error) {
        }
    }

    return (  
        <Layout>
                <div className="flex w-full mx-auto mt-8 justify-center">
                    <div className="bg-white text-black rounded-lg shadow-md px-8 pt-6 pb-8 mb-4">
                        <div className="w-full max-w-lg bg-green-200 text-black rounded-lg shadow-md px-8 pt-6 pb-8 mb-4">
                            <p>{messageConfirmation}</p>
                        </div>
                </div>
            </div>
        </Layout>    
    );
} 
 
export default Confirmation;