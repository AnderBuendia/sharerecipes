import React, { useCallback, useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

const UPLOAD_IMAGES = gql`
    mutation uploadUserImage($file: Upload!) {
        uploadUserImage(file: $file) {
            url
            fileName
        }
    }
`;

const UploadUserImage = ({handleUrlFileUser, handleMessage, userData}) => {
    /* Image state */
    const [userImage, setUserImage] = useState('');

    /* User data to set image */
    const { image_url, image_name } = userData;

    /* Apollo mutation to upload files */
    const [ uploadUserImage ] = useMutation(UPLOAD_IMAGES);

    /* Get content from Dropzone */
    const onDropRejected = () => {
            handleMessage('Could not upload file. File is not a image (jpg, jpeg) or is greater than 1MB');
    };

    const onDropAccepted = useCallback(async ([file]) => {
        console.log('FILE', file);
        const { data } = await uploadUserImage({
            variables: { file }
        });

        handleUrlFileUser(data.uploadUserImage);
        setUserImage(data.uploadUserImage);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDropAccepted, onDropRejected, maxFiles: 1, resizeQuality: 0.6, resizeWidth: 90, resizeHeight: 90, maxSize: 1000000, accept: 'image/jpeg, image/jpg' });

    useEffect(() => {
        if (image_url) {
            setUserImage({
                url: image_url, 
                fileName: image_name
            });
        }
    }, [image_url])

    return ( 
        <div 
            className="container m-auto inset-0 h-32 w-32 mb-3 rounded-full justify-center items-center text-center"
        >
            <div {...getRootProps({ className: 'dropzone w-full cursor-pointer' })}>
                <input className="h-100" {...getInputProps() } />
                <div className="relative">
                    <Image 
                        className="block rounded-full"
                        key={userImage.url ? userImage.url : '/usericon.jpeg'}
                        src={userImage.url ? userImage.url : '/usericon.jpeg'}
                        image_name={userImage.fileName ? userImage.fileName : '/usericon.jpeg'}
                        width={256}
                        height={256}
                    />
                    <div className="absolute rounded-full h-32 w-32 inset-0 opacity-0 border border-black bg-gray-200 hover:opacity-50">
                        <p className="absolute font-roboto font-bold text-black inset-0 top-40">Change Avatar</p>
                    </div>
                </div>
            </div>
        </div>  
    );
}
 
export default UploadUserImage;