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
        let queryString;
        if (this.page) {
            queryString = config.host + '/categories/' + this.page;

        }
        try {
            const results = await CustomHttp.request(queryString)
            if (results && results.length > 0) {
                this.updateDataCategory(results);

            } else {
                console.log('нет ни одной категории')
            }
        } catch (e) {
            console.log(e)
        }

        this.addButtonElement = document.getElementById('add-category')
        this.addButtonElement.addEventListener('click', () => {
            console.log(that.page)
            location.href = '#/create-' + that.page;
        })
        new CreateModal(this.page, this.idDeletingCategory, this.updateDataCategory.bind(this));
    }

    updateDataCategory(categories) {
        Array.from(document.querySelectorAll('div[class~="category_card"]')).forEach(node => {
            node.remove()
        });

        categories.forEach(category => {
            this.drawCategory(category)
        })
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

        const categoryCardActionsEditButton = document.createElement('button');
        categoryCardActionsEditButton.className = 'btn btn-primary';
        categoryCardActionsEditButton.innerText = 'Редактировать';
        categoryCardActionsEditButton.addEventListener('click', function () {
            window.location = '#/edit-' + that.page + `?id=${category.id}`;
        })
        categoryCardActions.appendChild(categoryCardActionsEditButton);

        const categoryCardActionsDeleteButton = document.createElement('button');
        categoryCardActionsDeleteButton.className = 'btn btn-danger';
        categoryCardActionsDeleteButton.setAttribute('data-bs-toggle', 'modal');
        categoryCardActionsDeleteButton.setAttribute('data-bs-target', '#staticBackdrop');
        categoryCardActionsDeleteButton.innerText = 'Удалить';
        categoryCardActionsDeleteButton.addEventListener('click', function () {
            new CreateModal(that.page, category.id, that.updateCategories.bind(that));
        })
        categoryCardActions.appendChild(categoryCardActionsDeleteButton);
        categoryCardElement.appendChild(categoryCardActions);
        this.categoriesContainerElement.insertBefore(categoryCardElement, this.categoriesContainerElement.firstChild);
    }

    async updateCategories() {
        try {
            const results = await CustomHttp.request(config.host + '/categories/' + this.page)
            if (results && results.length > 0) {
                this.updateDataCategory(results)

            } else {
                console.log('нет ни одной категории дохода')
            }

        } catch (error) {
            console.log(error)
        }
    }

}