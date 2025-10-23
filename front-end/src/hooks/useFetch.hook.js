import useAsync from './useAsync.hook.js';

const DEFAULT_OPTIONS = {
	'Content-Type': 'application/json',
}

export default function useFetch(url, options = {}, dependencies = []) {
	return useAsync(() => {
		if (!url) {
			return Promise.resolve(null); // Don't fetch if URL is null/empty
		}
		return fetch(url, {...DEFAULT_OPTIONS, ...options})
			.then(res => {
				if (res.ok) return res.json();
				return res.json().then(json => Promise.reject(json));
			})
	}, dependencies);
}
