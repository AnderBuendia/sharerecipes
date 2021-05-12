import React from 'react';
import { Modal, Backdrop, Fade } from '@material-ui/core';
import { useRouter } from 'next/router';

const ModalSignup = ({ open, handleOpen }) => {
  const router = useRouter();

  const handleClose = () => {
    handleOpen(false);
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className="flex justify-center"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className="border-2 border-gray-600 text-center rounded-md shadow-lg p-6 bg-white m-auto inset-0">
            <img
              src="/Muffin.svg"
              alt="Muffin image"
              className="w-16 content-center inline-block mb-4"
            />
            <h2
              className="text-2xl font-bold font-roboto mb-2"
              id="transition-modal-title"
            >
              Sign Up to comment
            </h2>
            <p
              className="font-light font-roboto mb-2 text-gray-400"
              id="transition-modal-description"
            >
              Join our community to discover and share new recipes!
            </p>
            <button
              className="btn-primary"
              onClick={() => router.push('/signup')}
            >
              Sign Up
            </button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default ModalSignup;
