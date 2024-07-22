//2 way - Timur Utepov:
import {CreateModal} from "./createModal.js";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config.js";

export class Categories {
    constructor(page) {
        this.categoriesContainerElement = null;
        this.addButtonElement = null;
        this.idDeletingCategory = null;
        this.page = page;
        this.categoriesTitleElement = null;
        this.init();
    }

    async init() {
        const that = this;
        this.categoriesContainerElement = document.getElementById('categories');
        this.categoriesTitleElement = document.getElementById('categories-title');
        this.categoriesTitleElement.innerText = this.page === 'income' ? 'Доходы' : 'Расходы';
        const queryString = config.host + '/categories/' + this.page;

        try {
            const results = await CustomHttp.request(queryString);
            if (!results) {
                console.error('Server returned no response.');
                return;
            }
            if (results.length > 0) {
                this.updateDataCategory(results);
            } else {
                console.log('No categories found.');
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }

        this.addButtonElement = document.getElementById('add-category');
        this.addButtonElement.addEventListener('click', () => {
            location.href = '#/create-' + that.page;
        });
        new CreateModal(this.page, this.idDeletingCategory, this.updateDataCategory.bind(this));
    }

    updateDataCategory(categories) {
        Array.from(document.querySelectorAll('div[class~="category_card"]')).forEach(node => node.remove());
        categories.forEach(category => this.drawCategory(category));
    }

    drawCategory(category) {
        const that = this;
        const categoryCardElement = document.createElement('div');
        categoryCardElement.className = 'border p-3 col col-xxl-3 category_card';
        const categoryCardTitle = document.createElement('h3');
        categoryCardTitle.innerText = category.title;
        categoryCardElement.appendChild(categoryCardTitle);

        const categoryCardActions = document.createElement('div');
        categoryCardActions.className = 'd-flex flex-nowrap gap-2';

        const editButton = document.createElement('button');
        editButton.className = 'btn btn-primary';
        editButton.innerText = 'Редактировать';
        editButton.addEventListener('click', () => location.href = `#/edit-${that.page}?id=${category.id}`);
        categoryCardActions.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger';
        deleteButton.setAttribute('data-bs-toggle', 'modal');
        deleteButton.setAttribute('data-bs-target', '#staticBackdrop');
        deleteButton.innerText = 'Удалить';
        deleteButton.addEventListener('click', () => new CreateModal(that.page, category.id, that.updateCategories.bind(that)));
        categoryCardActions.appendChild(deleteButton);

        categoryCardElement.appendChild(categoryCardActions);
        this.categoriesContainerElement.insertBefore(categoryCardElement, this.categoriesContainerElement.firstChild);
    }

    async updateCategories() {
        const queryString = config.host + '/categories/' + this.page;
        try {
            const results = await CustomHttp.request(queryString);
            if (results && results.length > 0) {
                this.updateDataCategory(results);
            } else {
                console.log('No categories found.');
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    }

    async saveCategory() {
        const title = this.inputElement.value.trim();
        if (!title) {
            console.error('The title cannot be empty.');
            return;
        }
        const queryString = this.routeParams.id ? `${config.host}/categories/${this.page}/${this.routeParams.id}` : `${config.host}/categories/${this.page}`;
        const method = this.routeParams.id ? 'PUT' : 'POST';
        try {
            const result = await CustomHttp.request(queryString, method, { title: title[0].toUpperCase() + title.slice(1) });
            if (result && !result.error) {
                window.location.href = `#/${this.page}`;
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error saving category:', error);
        }
    }

}
