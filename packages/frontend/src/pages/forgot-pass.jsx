import React from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { gql, useMutation } from '@apollo/client';
import { useToasts } from 'react-toast-notifications';
import { createApolloClient } from '../lib/apollo/apollo-client';
import { withCSRRedirect } from '../lib/hoc/with-csr-redirect.hoc';
import { getJwtFromCookie } from '../lib/utils/jwt-cookie.utils';
import { isRequestSSR, loadAuthProps, serverRedirect } from '../lib/utils/ssr.utils';

/* enum conditions */
import { MainPaths } from '../enums/paths/main-paths';
import { RedirectConditions } from '../enums/redirect-conditions';

/* Components */
import MainLayout from '../components/layouts/MainLayout';
import Input from '../components/form/Input';
import MuffinIcon from '../components/icons/muffinicon';

/* Apollo queries */
const FORGOT_PASSWORD = gql`
    mutation forgotPassword($input: EmailInput) {
        forgotPassword(input: $input) {
            message
        }
    }
`;

const ForgotPass = () => {
    const router = useRouter();
    
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
            addToast(data.forgotPassword.message, { appearance: 'success' });

            setTimeout(() => {
                router.push(MainPaths.INDEX);
            }, 3000);
        } catch (error) {
            addToast(error.message.replace('GraphQL error: ', ''), { appearance: 'error' });
        }
    };

    return ( 
        <MainLayout>
            <div className="md:w-4/5 xl:w-3/5 mx-auto mb-32">
                <div className="flex justify-center">
                    <Link href={MainPaths.INDEX}>
                        <a><MuffinIcon className="w-16 h-16" /></a>
                    </Link>
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
                                <Link href={MainPaths.LOGIN}><a className="btn-default">Return to Login</a></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

const redirect = {
    href: MainPaths.INDEX,
    statusCode: 302,
    condition: RedirectConditions.REDIRECT_WHEN_USER_EXISTS,
};

export const getServerSideProps = async ctx => {
    const props = { lostAuth: false };
    const isSSR = isRequestSSR(ctx.req.url);

    const jwt = getJwtFromCookie(ctx.req.headers.cookie);

    if (jwt) {
		if (isSSR) {
			const apolloClient = createApolloClient();
			const authProps = await loadAuthProps(ctx.res, jwt, apolloClient);

			if (authProps) serverRedirect(ctx.res, redirect);
	    } else if (!decode(jwt)) props.lostAuth = true;
    } 

    props.componentProps = {
        shouldRender: !jwt || props.lostAuth
    }

    return { props }
}
 
export default withCSRRedirect(ForgotPass, redirect);