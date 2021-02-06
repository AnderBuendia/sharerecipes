import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { removeJwtCookie } from '../../lib/utils/jwt-cookie.utils';
import { HTTPStatusCodes } from '../../enums/config/http-status-codes';
import { MainPaths } from '../../enums/paths/main-paths';
import MainLayout from '../../components/layouts/MainLayout';
import { CONFIRM_USER } from '../../lib/graphql/user/mutation';

const ConfirmationToken = ({token}) => {
    const router = useRouter();

    /* Confirmation message state */
    const [messageConfirmation, setMessageConfirmation] = useState(null);

    /* Apollo mutation */
    const [ confirmUser ] = useMutation(CONFIRM_USER);

    useEffect(token => {
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

            setMessageConfirmation(`Your account has been activated.
            You will be redirected automatically to login`);

            /* Redirect to login */
            setTimeout(() => {
                setMessageConfirmation(null);
                router.push(MainPaths.LOGIN);
            }, 4000);

        } catch (error) {
        }
    }

    return (  
        <MainLayout
            title="Account confirmation"
            description="Your account has been confirmed"
            url={MainPaths.CONFIRMATION}
        >
            <div className="flex w-full mx-auto mt-8 justify-center">
                <div className="bg-white text-black rounded-lg shadow-md px-8 pt-6 pb-8 mb-4">
                    <div className="w-full max-w-lg bg-green-200 text-black rounded-lg shadow-md px-8 pt-6 pb-8 mb-4">
                        <p>{messageConfirmation}</p>
                    </div>
                </div>
            </div>
        </MainLayout>    
    );
};

export const getServerSideProps = async ({params, res}) => {
    const props = {};

    if (params && params.token) removeJwtCookie(res);
    else res.statusCode = HTTPStatusCodes.NOT_FOUND;

    props.componentProps = {
        token: params?.token,
    }

    return { props };
};
 
export default ConfirmationToken;