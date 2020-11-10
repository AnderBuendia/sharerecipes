import React, { useCallback } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useDropzone } from 'react-dropzone';

const UPLOAD_IMAGES = gql`
    mutation UploadFile($file: Upload!) {
        uploadFile(file: $file) {
            url
            fileName
        }
    }
`;

const Upload = ({handleUrlFile, handleMessage}) => {
    /* Apollo mutation to upload files */
    const [ uploadFile ] = useMutation(UPLOAD_IMAGES);

    /* Get content from Dropzone */
    const onDropRejected = () => {
            handleMessage('Could not upload file. File is not an image or is greater than 5MB');
    };

    const onDropAccepted = useCallback(async ([file]) => {
        const { data } = await uploadFile({
            variables: { file }
        });
        console.log(data)
        handleUrlFile(data.uploadFile);
    }, []);

    const { isDragActive, getRootProps, getInputProps } = useDropzone({ onDropAccepted, onDropRejected, maxFiles: 1, maxSize: 5000000, accept: 'image/jpeg, image/jpg, image/png' });

    return ( 
            <div 
                className="container mx-auto mb-3 lg:mt-0 justify-center items-center text-center w-3/5 border-dashed border-gray-400 border-2 bg-gray-100"
            >
            <div {...getRootProps({ className: `dropzone w-full ${isDragActive ? 'py-20' : 'py-4'}` })}>
            <input className="h-100" {...getInputProps() } />
            {
                isDragActive ? 
                    <p className="text-2xl text-center text-gray-600">Drop Your Image</p>
                : 
                    <div className="text-center">
                        <p className="mt-4 text-2xl text-center text-gray-600">
                            Drag and drop image
                        </p>
                        <button 
                            className="bg-blue-700 w-4/5 py-3 rounded-lg text-white my-10 hover:bg-blue-800"
                            type="button"
                        >
                            Select image to upload
                        </button>
                    </div>
            }
            </div>
        </div>  
    );
}
 
export default Upload;