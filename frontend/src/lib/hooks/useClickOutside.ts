import { useEffect, MutableRefObject, Dispatch, SetStateAction } from 'react';

export type EventType = MouseEvent | TouchEvent;

const useClickOutside = (
  componentRef: MutableRefObject<HTMLDivElement>,
  setOpen: Dispatch<SetStateAction<boolean>>
) => {
  useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => document.removeEventListener('click', handleClick);
    function handleClick(e: EventType) {
      if (componentRef && componentRef.current) {
        const ref = componentRef.current;
        if (!ref.contains(e.target as Node)) {
          setOpen(false);
        }
      }
    }
  }, []);
};

export default useClickOutside;
