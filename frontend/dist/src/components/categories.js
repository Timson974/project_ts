"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Categories = void 0;
const createModal_1 = require("./createModal");
const custom_http_1 = require("../services/custom-http");
const config_1 = __importDefault(require("../../config/config"));
class Categories {
    constructor(page) {
        this.categoriesContainerElement = null;
        this.addButtonElement = null;
        this.idDeletingCategory = null;
        this.page = page;
        this.categoriesTitleElement = null;
        this.queryString = null;
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const that = this;
            this.categoriesContainerElement = document.getElementById('categories');
            this.categoriesTitleElement = document.getElementById('categories-title');
            if (this.categoriesTitleElement) {
                this.categoriesTitleElement.innerText = this.page === 'income' ? 'Доходы' : 'Расходы';
            }
            if (this.page) {
                this.queryString = config_1.default.host + '/categories/' + this.page;
            }
            try {
                if (this.queryString) {
                    const results = yield custom_http_1.CustomHttp.request(this.queryString);
                    if (results && results.length > 0) {
                        this.updateDataCategory(results);
                    }
                    else {
                        console.log('нет ни одной категории');
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
            this.addButtonElement = document.getElementById('add-category');
            if (this.addButtonElement) {
                this.addButtonElement.addEventListener('click', () => {
                    location.href = '#/create-' + that.page;
                });
            }
            new createModal_1.CreateModal(this.page, this.idDeletingCategory, this.updateDataCategory.bind(this));
        });
    }
    updateDataCategory(categories) {
        Array.from(document.querySelectorAll('div[class~="category_card"]')).forEach(node => {
            node.remove();
        });
        categories && categories.forEach(category => {
            this.drawCategory(category);
        });
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
            window.location.href = '#/edit-' + that.page + `?id=${category.id}`;
        });
        categoryCardActions.appendChild(categoryCardActionsEditButton);
        const categoryCardActionsDeleteButton = document.createElement('button');
        categoryCardActionsDeleteButton.className = 'btn btn-danger';
        categoryCardActionsDeleteButton.setAttribute('data-bs-toggle', 'modal');
        categoryCardActionsDeleteButton.setAttribute('data-bs-target', '#staticBackdrop');
        categoryCardActionsDeleteButton.innerText = 'Удалить';
        categoryCardActionsDeleteButton.addEventListener('click', function () {
            new createModal_1.CreateModal(that.page, category.id, that.updateCategories.bind(that));
        });
        categoryCardActions.appendChild(categoryCardActionsDeleteButton);
        categoryCardElement.appendChild(categoryCardActions);
        if (this.categoriesContainerElement) {
            this.categoriesContainerElement.insertBefore(categoryCardElement, this.categoriesContainerElement.firstChild);
        }
    }
    updateCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield custom_http_1.CustomHttp.request(config_1.default.host + '/categories/' + this.page);
                if (results && results.length > 0) {
                    this.updateDataCategory(results);
                }
                else {
                    console.log('нет ни одной категории дохода');
                }
            }
            catch (e) {
                console.log(e);
            }
        });
    }
}
exports.Categories = Categories;
//# sourceMappingURL=categories.js.map