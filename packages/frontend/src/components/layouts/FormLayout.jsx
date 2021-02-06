import Link from 'next/link';
import Head from '../generic/Head';
import { MainPaths } from '../../enums/paths/main-paths';
import RamenIcon from '../icons/ramenicon';

const FormLayout = ({title, description, url, children}) => (
    <>
        <Head 
            title={title} 
            description={description}
            url={url}
        />
        <div className="bg-gray-200">
            <div className="w-11/12 container mx-auto flex flex-col items-center justify-center min-h-screen">
                <Link href={MainPaths.INDEX}>
                    <a className="flex justify-center"><RamenIcon className="w-16 h-16" /></a>
                </Link>
                <h2 className="text-3xl font-roboto font-bold text-gray-800 text-center my-4">
                    {title}
                </h2>

                <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8">
                    {children}
                </div>
            </div>
        </div>
    </>
);
 
export default FormLayout;