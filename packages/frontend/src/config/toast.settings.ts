import type { ToastContainerProps } from 'react-toastify';

export const toastSettings: ToastContainerProps = {
  position: 'top-center',
  autoClose: 3500,
  theme: 'dark',
  hideProgressBar: false,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  limit: 2,
};
