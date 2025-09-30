export const getUsers = (page) => baseFetch.get(`/users?_page=${page}&limit=10`);
export const getUsersById = (userId) => baseApi.get(`/users?id=${userId}`);
export const getUsersSearch = (search, page) => baseApi.get(`/users?q=${search}&_page=${page}&limit=10`);

export default {
	getUsers,
	getUsersById,
	getUsersSearch,
};
