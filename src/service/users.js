const users = new Map();

export const getUser = (userId) => {
	return users.get(userId);
};

export const setUser = (user) => {
	console.log(user.id);
	users.set(user.id, user);
};

export default {
	getUser,
	setUser,
};
