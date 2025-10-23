import { useState, useEffect, useRef } from 'react';

export default function useAsync(callback, dependencies = []) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [value, setValue] = useState(null);
	
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
			.then(value => setValue(value))
			.catch(e => setError(e))
			.finally(() => setLoading(false));
	// eslint-disable-next-line
	}, dependencies);

	return {loading, error, value};
}
