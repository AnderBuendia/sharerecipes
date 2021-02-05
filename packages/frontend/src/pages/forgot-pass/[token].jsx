import React from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { useToasts } from 'react-toast-notifications';
import { withCSRRedirect } from '../../lib/hoc/with-csr-redirect.hoc';
import { removeJwtCookie } from '../../lib/utils/jwt-cookie.utils';
import { serverRedirect } from '../../lib/utils/ssr.utils';
import { RESET_PASSWORD } from '../../lib/graphql/user/query';

/* enums */
import { MainPaths } from '../../enums/paths/main-paths';
import { RedirectConditions } from '../../enums/redirect-conditions';

/* Components */
import MainLayout from '../../components/layouts/MainLayout';
import Input from '../../components/generic/Input';
import MuffinIcon from '../../components/icons/muffinicon';

function ResetPasswordToken({token}) {
    /* Routing */
    const router = useRouter();
    
    /* Set Toast Notification */
    const { addToast } = useToasts();

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
            addToast(`Your password has been changed.
            You will be redirected automatically to login`, { appearance: 'success' });

            setTimeout(() => {
                router.push(MainPaths.LOGIN);
            }, 3000);
        } catch (error) {
            addToast(error.message.replace('GraphQL error: ', ''), { appearance: 'error' });
            
            setTimeout(() => {
                router.push(MainPaths.FORGOT_PASS);
            }, 3000);
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
                                <Link href={MainPaths.LOGIN}>
                                    <a className="btn-default">Return to Login</a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

const redirect = {
    href: MainPaths.NOT_FOUND,
    statusCode: 302,
    condition: RedirectConditions.REDIRECT_WHEN_TOKEN_NOT_EXISTS,
}
 
export const getServerSideProps = async ({params, res}) => {
    const props = { lostAuth: false };

    if (params && params.token) removeJwtCookie(res);
    else serverRedirect(res, redirect);

    props.componentProps = {
        token: params?.token,
    }

    return { props };
};

export default withCSRRedirect(ResetPasswordToken, redirect);