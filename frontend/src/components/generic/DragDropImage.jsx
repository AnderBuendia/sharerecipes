import React, { useState, useEffect, useMemo } from 'react';
import Uppy from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import { DragDrop, DashboardModal } from '@uppy/react';
import ImageEditor from '@uppy/image-editor';
import useUser from '@Lib/hooks/useUser';

const DragDropImage = ({ name, onChange, url, current, rounded }) => {
  const [modal, setModal] = useState(false);
  const { authState } = useUser();

  const uppy = useMemo(() => {
    return new Uppy({
      allowMultipleUploads: false,
      restrictions: {
        allowedFileTypes: ['image/*'],
        minNumberOfFiles: 1,
        maxNumberOfFiles: 1,
        maxFileSize: 1000000,
      },
      onBeforeFileAdded: () => {
        setModal(true);
        return true;
      },
    })
      .use(ImageEditor, {
        id: 'ImageEditor',
        quality: 0.8,
      })
      .use(XHRUpload, {
        endpoint: url,
        formData: true,
        fieldName: name,
        method: 'POST',
        headers: {
          authorization: `bearer ${authState.jwt}`,
        },
      });
  }, []);

  useEffect(() => {
    uppy.on('file-removed', () => {
      uppy.reset();
      setModal(false);
    });

    uppy.on('upload-success', (_file, response) => {
      uppy.reset();
      setModal(false);
      console.log('RESPONSE', response);
      onChange && onChange(response.body);
    });
    return () => uppy.close();
  }, []);

  const imageStyle = current
    ? {
        backgroundImage: `url('${current}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.8,
      }
    : undefined;

  return (
    <div
      className={`avatar-editor w-full h-full relative ${
        rounded ? 'rounded-full' : ''
      }`}
    >
      <DragDrop
        uppy={uppy}
        locale={{
          strings: {
            dropHereOr: 'Suelta la imagen o %{browse}',
            browse: 'pulsa aquí',
          },
        }}
      />
      <DashboardModal
        showProgressDetails={true}
        onRequestClose={() => {
          uppy.reset();
          setModal(false);
        }}
        plugins={['ImageEditor']}
        open={modal}
        uppy={uppy}
      />
      <div
        style={imageStyle}
        className="w-full h-full absolute top-0 pointer-events-none"
      />
    </div>
  );
};

export default DragDropImage;
