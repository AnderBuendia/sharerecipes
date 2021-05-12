import { useState, useEffect } from 'react';

const useResolution = () => {
  const [windowDimensions, setWindowDimensions] = useState(0);
  useEffect(() => {
    let timer;
    const handleResize = () => {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        setWindowDimensions(window.innerWidth);
      }, 100);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
};

export default useResolution;
