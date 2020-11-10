// import AuthState from '../context/auth/authState';
import { ApolloProvider } from '@apollo/client';
import client from '../config/apollo';
import ResolutionState from '../context/resolution/resolutionState';
import '../styles/index.css';

const MyApp = ({ Component, pageProps }) => {
  return (
    <ApolloProvider client={client}>
      <ResolutionState>
        <Component {...pageProps} />
      </ResolutionState>
    </ApolloProvider>
  )
}

export default MyApp;
