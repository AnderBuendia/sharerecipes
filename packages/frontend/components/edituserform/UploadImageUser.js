import React, { useCallback, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

const UPLOAD_IMAGES = gql`
    mutation uploadImageUser($file: Upload!) {
        uploadImageUser(file: $file) {
            url
            fileName
        }
    }
`;

const UploadImageUser = ({handleUrlFileUser, handleMessage}) => {
    /* Image state */
    const [imageUser, setImageUser] = useState('');

    /* Apollo mutation to upload files */
    const [ uploadImageUser ] = useMutation(UPLOAD_IMAGES);

    /* Get content from Dropzone */
    const onDropRejected = () => {
            handleMessage('Could not upload file. File is not a image (jpg, jpeg) or is greater than 2MB');
    };

    const onDropAccepted = useCallback(async ([file]) => {
        console.log('FILE', file);
        const { data } = await uploadImageUser({
            variables: { file }
        });
        handleUrlFileUser(data.uploadImageUser);
        setImageUser(data.uploadImageUser);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDropAccepted, onDropRejected, maxFiles: 1, resizeQuality: 0.6, resizeWidth: 90, resizeHeight: 90, maxSize: 2000000, accept: 'image/jpeg, image/jpg' });

    return ( 
            <div 
                className="container mx-auto mb-3 lg:mt-0 rounded-full justify-center items-center text-center w-1/5 border-solid border-gray-600 border-2 bg-gray-100"
            >
                
            <div {...getRootProps({ className: 'dropzone w-full cursor-pointer' })}>
            <input className="h-100" {...getInputProps() } />
                <div className="relative w-full">
                    { imageUser ? (
                        <Image 
                            className="block rounded-full"
                            key={imageUser.url}
                            src={imageUser.url}
                            alt={imageUser.fileName}
                            width={90}
                            height={90}
                        />
                    ) : (
                        <Image 
                            className="block rounded-full"
                            key="/usericon.jpeg"
                            src="/usericon.jpeg"
                            alt="Usericon image"
                            width={90}
                            height={90}
                        />
                    )}  
                    <div className="absolute rounded-full inset-0 w-full opacity-0 bg-gray-200 hover:opacity-50">
                        <p className="absolute font-roboto font-bold text-black top-30">Change Avatar</p>
                    </div>
                </div>
            </div>
        </div>  
    );
}
 
export default UploadImageUser;