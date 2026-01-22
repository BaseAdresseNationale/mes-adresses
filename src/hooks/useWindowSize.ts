import { useState, useEffect } from "react";

const MOBILE_WIDTH = 768;

const initialValue = {
  innerHeight: null,
  innerWidth: null,
  outerWidth: null,
  outerHeight: null,
};

function getSize() {
  return {
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    outerHeight: window.outerHeight,
    outerWidth: window.outerWidth,
  };
}

function useWindowSize() {
  const [windowSize, setWindowSize] = useState(initialValue);
  const [isMobile, setIsMobile] = useState(false);

  const onResize = () => {
    const size = getSize();
    setWindowSize(size);
    setIsMobile(size.innerWidth <= MOBILE_WIDTH);
  };

  useEffect(() => {
    onResize();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return { windowSize, isMobile };
}

export default useWindowSize;
