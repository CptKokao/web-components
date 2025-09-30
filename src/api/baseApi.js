const apiServer = import.meta.env.DEV ? 'http://localhost:1111' : 'http://localhost:1111';

const baseFetch = (url, config = {}, params) => {
	return new Promise((resolve, reject) => {
		try {
			const _config = { ...config };

			if (params) {
				_config[body] = JSON.stringify(params);
			}

			window
				.fetch(`${apiServer}${url}`, {
					..._config,
				})
				.then((res) => res.json())
				.then(resolve, reject);
		} catch (e) {
			reject(e);
		}
	});
};

const fetchGet = (url, config) => baseFetch(url, config);
const fetchPost = (url, config) => baseFetch(url, { method: 'POST', ...config }, params);
const fetchPut = (url, config) => baseFetch(url, { method: 'PUT', ...config }, params);
const fetchPatch = (url, config) => baseFetch(url, { method: 'PATCH', ...config }, params);
const fetchDelete = (url, config) => baseFetch(url, { method: 'DELETE', ...config }, params);

export default {
	get: fetchGet,
	post: fetchPost,
	put: fetchPut,
	patch: fetchPatch,
	delete: fetchDelete,
};
