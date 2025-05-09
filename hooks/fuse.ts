import { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";

import { useDebouncedCallback } from "use-debounce";

function useFuse<T>(
  source: T[],
  delay,
  options,
  initialValue = null
): [T[], (value: string) => void] {
  const [filtered, setFiltered] = useState(source || []);

  const fuse = useMemo(() => {
    return new Fuse(source, {
      threshold: 0.4,
      ...options,
    });
  }, [options, source]);

  useEffect(() => {
    setFiltered(source);
    if (initialValue) {
      const results = fuse.search(initialValue);
      setFiltered(results.map((result) => result.item));
    }
  }, [source, initialValue]);

  const debouncedCallback = useDebouncedCallback((value) => {
    if (fuse) {
      if (value) {
        const results = fuse.search(value);
        setFiltered(results.map((result) => result.item));
      } else {
        setFiltered(source);
      }
    }

    if (value) {
      const results = fuse.search(value);
      setFiltered(results.map((result) => result.item));
    } else {
      setFiltered(source);
    }
  }, delay);

  return [filtered, debouncedCallback];
}

export default useFuse;
