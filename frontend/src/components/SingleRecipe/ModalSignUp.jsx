import { createPortal } from 'react-dom';
import RamenIcon from '@Components/icons/ramenicon';

const ModalPortal = ({ onSignUp }) => {
  return createPortal(
    <ModalSignUp onSignUp={onSignUp} />,
    document.getElementById('my-portal')
  );
};

const ModalSignUp = ({ onSignUp }) => {
  return (
    <div className="flex h-screen fixed backdrop-filter backdrop-blur inset-0 z-10">
      <div className="relative p-6 m-auto border-2 border-gray-600 text-center rounded-md shadow-lg bg-white">
        <RamenIcon className="w-16 h-16 mx-auto" />
        <h2
          className="text-2xl font-bold font-roboto my-2"
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
        <button className="btn-primary" onClick={onSignUp}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default ModalPortal;