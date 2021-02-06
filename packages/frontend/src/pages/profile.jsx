import { decode } from 'jsonwebtoken';
import { withCSRRedirect } from '../lib/hoc/with-csr-redirect.hoc';
import { createApolloClient } from '../lib/apollo/apollo-client';
import { getJwtFromCookie } from '../lib/utils/jwt-cookie.utils';
import { isRequestSSR, loadAuthProps, serverRedirect } from '../lib/utils/ssr.utils';

/* enum conditions */
import { MainPaths } from '../enums/paths/main-paths';
import { ProfilePaths } from '../enums/paths/profile-paths';
import { RedirectConditions } from '../enums/redirect-conditions';

/* components */
import MainLayout from "../components/layouts/MainLayout";
import ProfileLayout from "../components/layouts/ProfileLayout";

const Profile = () => (
    <MainLayout
        title="Your Profile"
        description="This is your ShareYourRecipes profile"
        url={MainPaths.PROFILE}
    >
        <ProfileLayout path={ProfilePaths.MAIN} />
    </MainLayout>
);

const redirect = {
    href: MainPaths.LOGIN,
    statusCode: 302,
    condition: RedirectConditions.REDIRECT_WHEN_USER_NOT_EXISTS,
    query: { returnTo: MainPaths.PROFILE }
};

export const getServerSideProps = async ctx => {
    const props = { lostAuth: false };
    const isSSR = isRequestSSR(ctx.req.url);

    const jwt = getJwtFromCookie(ctx.req.headers.cookie);

    if (jwt) {
        if (isSSR) {
            const apolloClient = createApolloClient();
            const authProps = await loadAuthProps(ctx.res, jwt, apolloClient);

            props.apolloCache = apolloClient.cache.extract();

            if (!authProps) serverRedirect(ctx.res, redirect);
            else props.authProps = authProps;
        } else if (!decode(jwt)) props.lostAuth = true;
    }

    props.componentProps = {
        shouldRender: !!props.authProps,
    };

    return { props };
};

export default withCSRRedirect(Profile, redirect);