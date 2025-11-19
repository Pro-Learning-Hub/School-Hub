import { useState, useEffect, useRef, DependencyList } from 'react';

interface UseAsyncReturn<T> {
  loading: boolean;
  error: Error | null;
  value: T | null;
}

export default function useAsync<T>(
  callback: () => Promise<T>, 
  dependencies: DependencyList = []
): UseAsyncReturn<T> {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [value, setValue] = useState<T | null>(null);
  
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Main logic of the hook
  useEffect(() => {
    // Set the loading indicator
    setLoading(true);
    // Reset values from previous call if any
    setError(null);
    setValue(null);
    // And now the main logic of the hook
    callbackRef.current()
      .then((value: T) => setValue(value))
      .catch((e: Error) => setError(e))
      .finally(() => setLoading(false));
  // eslint-disable-next-line
  }, dependencies);

  return { loading, error, value };
}
