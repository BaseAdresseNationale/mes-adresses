import { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";

import { useDebouncedCallback } from "use-debounce";

function useFuse(source, delay, options) {
  const [filtered, setFiltered] = useState(source || []);

  const fuse = useMemo(() => {
    return new Fuse(source, {
      threshold: 0.4,
      ...options,
    });
  }, [options, source]);

  useEffect(() => {
    setFiltered(source);
  }, [source]);

  const debouncedCallback = useDebouncedCallback((value) => {
    if (fuse) {
      if (value) {
        const results = fuse.search(value);
        setFiltered(results.map((result) => result.item));
      } else {
        setFiltered(source);
      }
    }
  }, delay);

  return [filtered, debouncedCallback];
}

export default useFuse;
