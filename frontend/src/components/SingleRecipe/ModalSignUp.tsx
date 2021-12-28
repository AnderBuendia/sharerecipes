import { FC } from 'react';
import { createPortal } from 'react-dom';
import { RamenIcon } from '@Components/Icons/ramen.icon';

export type ModalSignUpProps = {
  onSignUp: () => void;
};

const ModalPortal: FC<ModalSignUpProps> = ({ onSignUp }) => {
  return createPortal(
    <ModalSignUp onSignUp={onSignUp} />,
    document.getElementById('my-portal')!
  );
};

const ModalSignUp: FC<ModalSignUpProps> = ({ onSignUp }) => {
  return (
    <div className="flex fixed inset-0 bg-white bg-opacity-60">
      <div className="relative p-6 m-auto border-2 border-gray-600 text-center rounded-md shadow-lg bg-white dark:bg-gray-700">
        <RamenIcon w={60} h={60} />
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
        <button className="btn-form bg-black" onClick={onSignUp}>
          <span>Sign Up</span>
        </button>
      </div>
    </div>
  );
};

export default ModalPortal;
