import React, { useState, useCallback } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { useToasts } from 'react-toast-notifications';

const UPLOAD_IMAGES = gql`
    mutation uploadRecipeImage($file: Upload!) {
        uploadRecipeImage(file: $file) {
            url
            fileName
        }
    }
`;

const UploadRecipeImage = ({handleUrlFileRecipe}) => {
    /* Image state to show in DropZone container */
    const [imageRecipe, setImageRecipe] = useState('');
    
    /* Set Toast Notification */
    const { addToast } = useToasts();
    
    /* Apollo mutation to upload files */
    const [ uploadRecipeImage ] = useMutation(UPLOAD_IMAGES);

    /* Get content from Dropzone */
    const onDropRejected = () => {
        addToast('File is not an image or is greater than 2MB', { appearance: 'error' });
    };

    const onDropAccepted = useCallback(async ([file]) => {
        const { data } = await uploadRecipeImage({
            variables: { file }
        });
        console.log(data);
        setImageRecipe(data.uploadRecipeImage);
        handleUrlFileRecipe(data.uploadRecipeImage);
    }, []);

    const { isDragActive, getRootProps, getInputProps } = useDropzone({ onDropAccepted, onDropRejected, maxFiles: 1, maxSize: 2000000, resizeQuality: 0.7, accept: 'image/jpeg, image/jpg, image/png' });

    return ( 
            <div 
                className="container mx-auto mb-3 lg:mt-0 justify-center items-center text-center w-4/5 border-dashed rounded-lg border-gray-400 border-2 bg-gray-100"
            >
            <div {...getRootProps({ className: `dropzone w-full ${isDragActive ? 'py-20' : 'py-4'}` })}>
            <input className="h-100" {...getInputProps() } />
            { isDragActive ? 
                ( <p className="text-2xl text-center text-gray-600">Drop Your Image</p> )
            : 
            imageRecipe ? 
                (<div 
                    className="md:flex-1 w-full mb-4 mt-3 lg:mt-0 flex flex-col items-center justify-center"
                >
                    <Image 
                        width={350}
                        height={200}
                        key={imageRecipe.fileName}
                        src={imageRecipe.url}
                        alt={imageRecipe.fileName}
                    />  
                </div>
                ) : ( 
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
                ) 
            }
            </div>
        </div>  
    );
}
 
export default UploadRecipeImage;