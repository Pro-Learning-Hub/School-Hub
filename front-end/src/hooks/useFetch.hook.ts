import { DependencyList } from 'react';
import useAsync from './useAsync.hook';

interface FetchOptions extends RequestInit {
	headers?: Record<string, string>;
}

interface UseFetchReturn<T> {
	loading: boolean;
	error: Error | null;
	value: T | null;
}

const DEFAULT_OPTIONS: FetchOptions = {
	headers: {
		'Content-Type': 'application/json',
	}
};

export default function useFetch<T = any>(
	url: string | null, 
	options: FetchOptions = {}, 
	dependencies: DependencyList = []
): UseFetchReturn<T> {
	return useAsync<T>(() => {
		if (!url) {
			return Promise.resolve(null as T); // Don't fetch if URL is null/empty
		}
		
		const mergedOptions: FetchOptions = {
			...DEFAULT_OPTIONS,
			...options,
			headers: {
				...DEFAULT_OPTIONS.headers,
				...options.headers,
			}
		};

		return fetch(url, mergedOptions)
			.then(res => {
				if (res.ok) return res.json();
				return res.json().then(json => Promise.reject(new Error(json.message || 'Fetch failed')));
			});
	}, dependencies);
}
