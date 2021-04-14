import { useEffect } from 'react';

const useClickOutside = (componentRef, setOpen) => {
  useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => document.removeEventListener('click', handleClick);
    function handleClick(e) {
      if (componentRef && componentRef.current) {
        const ref = componentRef.current;
        if (!ref.contains(e.target)) {
          setOpen(false);
        }
      }
    }
  }, []);
};

export default useClickOutside;
