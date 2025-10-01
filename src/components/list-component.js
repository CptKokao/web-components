import appConstants from '../common/constants';
import { goTo } from '../router';
import { randomColor, invertColor, getUserInitials, highlightText } from '../common/utils';
import { setPost } from '../service/posts';
import { setUser } from '../service/users';
import { getPosts, getPostsByUser, getPostsSearch } from '../api/postsApi';
import { getUsers, getUsersSearch } from '../api/usersApi';

class ListComponent extends HTMLElement {
	constructor() {
		super();
		this.search = '';
		this.page = 1;
		this.lastPage = false;
		this.listType = appConstants.list.types.post;

		const shadow = this.attachShadow({ mode: 'open' });
		const wrapper = document.createElement('div');
		wrapper.setAttribute('class', 'list-block');

		const title = document.createElement('h2');
		title.setAttribute('class', 'list-title');
		shadow.appendChild(title);

		//pagination
		const pagination = document.createElement('pagination-component');
		pagination.setAttribute('class', 'list-pagination');
		pagination.setAttribute('page', this.page);
		pagination.setAttribute('last', this.lastPage);

		pagination.addEventListener('paginate-back', (e) => {
			e.stopPropagation();
			if (this.page > 1) {
				this.page = this.page - 1;
				if (this.listType === appConstants.list.types.post) {
					this.getPostsPage();
				}
				if (this.listType === appConstants.list.types.user) {
					this.getUsersPage();
				}
			}
		});

		pagination.addEventListener('paginate-next', (e) => {
			e.stopPropagation();
			if (!this.lastPage) {
				console.log(this.listType);
				this.page = this.page + 1;
				if (this.listType === appConstants.list.types.post) {
					this.getPostsPage();
				}
				if (this.listType === appConstants.list.types.user) {
					this.getUsersPage();
				}
			}
		});

		shadow.appendChild(pagination);

		const style = document.createElement('style');

		style.textContent = `
           
           .list-block{
               display: flex;
               align-items: flex-start;
               justify-content: center;
               flex-wrap: wrap;
               padding: 5px;
           }

           .list-title{
               text-align: center;
           }

           .list-pagination{
            display: flex;
            justify-content: center;
           }

        `;

		shadow.appendChild(style);
		shadow.appendChild(wrapper);
	}

	updateComponent() {
		const shadow = this.shadowRoot;
		const userId = this.getAttribute('user');
		const search = this.getAttribute('search');
		const listType = this.getAttribute('list-type');

		if (search) {
			this.search = search;
		}
		if (listType) {
			this.listType = listType;
		}

		if (listType === appConstants.list.types.post) {
			const title = shadow.querySelector('.list-title');

			title.textContent = 'All posts';

			if (userId) {
				title.textContent = 'Users posts';
			}

			this.getPostsPage();
		}

		if (listType === appConstants.list.types.user) {
			const title = shadow.querySelector('.list-title');

			title.textContent = 'All users';
			this.getUsersPage();
		}
	}

	connectedCallback() {
		this.updateComponent();
	}

	static get observedAttributes() {
		return ['search', 'list-type'];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'search') {
			this.search = newValue;
			this.updateComponent();
		}
	}

	getPostsPage() {
		const shadow = this.shadowRoot;
		const userId = this.getAttribute('user');
		const wrapper = shadow.querySelector('.list-block');
		const pagination = shadow.querySelector('pagination-component');

		pagination.setAttribute('page', this.page);
		pagination.setAttribute('last', this.lastPage);

		wrapper.innerHTML = '';

		const apiCall = this.search
			? getPostsSearch(this.search, this.page)
			: userId
			? getPostsByUser(userId, this.page)
			: getPosts(this.page);

		apiCall
			.then((posts) => {
				this.lastPage = posts.length < 10;
				posts.forEach((post) => {
					setPost(post);
					const postElement = document.createElement('post-component');
					postElement.setAttribute('id', post.id);
					if (this.search) {
						postElement.setAttribute('search', this.search);
					}
					wrapper.appendChild(postElement);
				});
			})
			.catch((error) => console.log(error));
	}

	getUsersPage() {
		const shadow = this.shadowRoot;
		const wrapper = shadow.querySelector('.list-block');
		const pagination = shadow.querySelector('pagination-component');

		pagination.setAttribute('page', this.page);
		pagination.setAttribute('last', this.lastPage);

		wrapper.innerHTML = '';

		const apiCall = this.search ? getUsersSearch(this.search, this.page) : getUsers(this.page);

		apiCall
			.then((users) => {
				this.lastPage = users.length < 10;
				users.forEach((post) => {
					setUser(post);
					const listElement = document.createElement('user-component');
					listElement.setAttribute('id', post.id);
					if (this.search) {
						listElement.setAttribute('search', this.search);
					}
					wrapper.appendChild(listElement);
				});
			})
			.catch((error) => console.log(error));
	}
}

customElements.define('list-component', ListComponent);
