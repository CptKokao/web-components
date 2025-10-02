import baseApi from './baseApi';

export const getUsers = (page) => baseApi.get(`/users?_page=${page}&_limit=10`);
export const getUserById = (userId) => {
	return baseApi.get(`/users/${userId}`);
};

export const getUsersSearch = (search, page) => baseApi.get(`/users?q=${search}&_page=${page}&_limit=10`);

export default {
	getUsers,
	getUserById,
	getUsersSearch,
};
