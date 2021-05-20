import Head from '../generic/Head';
import Header from '../Header';

const MainLayout = ({ title, description, url, children }) => (
  <>
    <Head title={title} description={description} url={url} />

    <div className="min-h-screen bg-gray-200 dark:bg-gray-500">
      <Header />
      <div className="w-10/12 mx-auto bg-gray-200 dark:bg-gray-500 py-4">
        {children}
      </div>
    </div>
  </>
);

export default MainLayout;
