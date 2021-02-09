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
import { AlertMessages, FormMessages } from '../../enums/config/messages';

/* Components */
import FormLayout from '../../components/layouts/FormLayout';
import Input from '../../components/generic/Input';

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
            addToast(AlertMessages.PASSWORD_UPDATED_LOGIN, { appearance: 'success' });

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
        <FormLayout 
            title="Reset Your Password"
            description="Reset your password if you have forgotten it"
            url={MainPaths.FORGOT_PASS_CONFIRM}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    label="New Password"
                    name="password"
                    type="password"
                    placeholder="Introduce a New Password"
                    childRef={register({ 
                        required: FormMessages.PASSWORD_REQUIRED,
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
                        required:  FormMessages.CONFIRM_NEW_PASSWORD,
                        validate: {
                            matchesPreviousPassword: value => {
                                const { password } = getValues();
                                return password === value || FormMessages.MATCH_PASSWORDS;
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
        </FormLayout>
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