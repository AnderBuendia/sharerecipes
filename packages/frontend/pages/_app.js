import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../config/apollo';
import ResolutionState from '../context/resolution/resolutionState';
import '../styles/index.css';


const MyApp = ({ Component, pageProps }) => {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <ResolutionState>
        <Component {...pageProps} />
      </ResolutionState>
    </ApolloProvider>
  )
}

export default MyApp;
