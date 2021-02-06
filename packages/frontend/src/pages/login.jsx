import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { decode } from 'jsonwebtoken';
import { useToasts } from 'react-toast-notifications';
import AuthContext from '../lib/context/auth/authContext';
import { withCSRRedirect } from '../lib/hoc/with-csr-redirect.hoc';
import { createApolloClient } from '../lib/apollo/apollo-client';
import { getJwtFromCookie } from '../lib/utils/jwt-cookie.utils';
import { isRequestSSR, loadAuthProps, serverRedirect } from '../lib/utils/ssr.utils';

/* enum conditions */
import { MainPaths } from '../enums/paths/main-paths';
import { RestEndPoints } from '../enums/paths/rest-endpoints';
import { RedirectConditions } from '../enums/redirect-conditions';

/* Components */
import FormLayout from '../components/layouts/FormLayout';
import Input from '../components/generic/Input';

const Login = () => {
    /* Routing */
    const router = useRouter();

    const { loginRequest } = getLoginRequest(router);

    /* React hook form */
    const { register, handleSubmit, errors } = useForm({
        mode: "onChange"
    });
    const onSubmit = async data => {
        await loginRequest(data);
    };

    return ( 
        <FormLayout 
            title="Login Your Account"
            description="Sign in to ShareYourRecipes"
            url={MainPaths.LOGIN}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
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
                    <Link href={MainPaths.FORGOT_PASS}>
                        <a className="text-md font-roboto underline font-medium text-gray-500 mt-8 text-center">Forgot Password?</a>
                    </Link>
                </div>
                <div className="border-gray border-t-2 block mt-8 text-center"></div>
                <div className="w-full">
                    <p className="text-lg font-roboto font-bold text-gray-800 mt-8 text-center">You don't have an account?</p>
                    <Link href={MainPaths.SIGNUP}><a className="btn-default">Create New Account</a></Link>
                </div>
            </div>
        </FormLayout>
    );
};

/* Gets the req to login */
const getLoginRequest = (router) => {
    const { setAuth } = useContext(AuthContext);

    /* Set Toast Notification */
    const { addToast } = useToasts();

    const loginRequest = async data => {
        try {
            const res = await fetch(
                process.env.NEXT_PUBLIC_SITE_URL + RestEndPoints.LOGIN,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data),
                }
            );

            const resJson = await res.json();
            
            if (resJson.error) {
                addToast(resJson.error, { appearance: 'error' });
            } else {
                const jwt = resJson.token;
                const user = resJson.user;

                // @ts-ignore
                setAuth({ user, jwt });

                addToast('Authenticating...', { appearance: 'success' });
                
                setTimeout(() => {
                    router.push(MainPaths.INDEX);
                }, 3000);
            }
        } catch (error) {
            addToast(error.message.replace('GraphQL error: ', ''), { appearance: 'error' });
        }
    }

    return { loginRequest };
};

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
 
export default withCSRRedirect(Login, redirect);