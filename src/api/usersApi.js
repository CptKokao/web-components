import baseApi from './baseApi';

export const getUsers = (page) => baseApi.get(`/users?_page=${page}&_limit=10`);
export const getUsersById = (userId) => baseApi.get(`/users?id=${userId}`);
export const getUsersSearch = (search, page) => baseApi.get(`/users?q=${search}&_page=${page}&_limit=10`);

export default {
	getUsers,
	getUsersById,
	getUsersSearch,
};
