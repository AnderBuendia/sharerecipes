import { ApolloProvider } from '@apollo/client';
import client from '../config/apollo';
import ResolutionState from '../context/resolution/resolutionState';
import '../styles/index.css';

if (typeof window === 'undefined') {
  global.window = {}
}

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
