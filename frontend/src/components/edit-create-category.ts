import {UrlManager} from "../utils/url-manager";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";

export class EditCreateCategoryCategory {
    constructor(page) {
        this.routeParams = UrlManager.getQueryParams();
        this.cancelButtonElement = null;
        this.editButtonElement = null;
        this.inputElement = null;
        this.titleElement = null;
        this.page = page;
        this.init();

    }

    async init() {
        const that = this;
        this.inputElement = document.getElementById('input');
        this.titleElement = document.getElementById('category-title');
        if (this.routeParams.id) {
            this.titleElement.innerText = this.page === 'income' ? 'Редактирование категории доходов' : 'Редактирование категории расходов';
        } else {
            this.titleElement.innerText = this.page === 'income' ? 'Создание категории доходов' : 'Создание категории расходов';
        }

        this.cancelButtonElement = document.getElementsByClassName('btn-danger')[0];
        this.editButtonElement = document.getElementsByClassName('btn-success')[0];
        if (this.routeParams.id) {
            this.editButtonElement.innerText = 'Редактировать';
        } else {
            this.editButtonElement.innerText = 'Создать';
        }
        this.cancelButtonElement.addEventListener('click', () => {
            window.location = '#/' + that.page
        });
        this.editButtonElement.addEventListener('click', () => {
            that.saveCategory()
        })
        this.inputElement.addEventListener('change', function () {
            if (this.value) {
                that.editButtonElement.removeAttribute('disabled');
            } else {
                that.editButtonElement.setAttribute('disabled', 'disabled');
            }
        })

        if (this.routeParams.id) {
            try {
                const result = await CustomHttp.request(config.host + `/categories/${this.page}/` + this.routeParams.id);
                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }
                    this.inputElement.value = result.title;
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    async saveCategory() {
        let queryString, method;

        if (this.routeParams.id) {
            queryString = config.host + `/categories/${this.page}/` + this.routeParams.id;
            method = 'PUT';
        } else {
            queryString = config.host +`/categories/${this.page}`;
            method = 'POST'
        }
        try {
            const result = await CustomHttp.request(queryString, method, {
                title: this.inputElement.value[0].toUpperCase() + this.inputElement.value.slice(1).toLowerCase()
            })

            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }
                alert('Category created successfully! Add another?');
                this.inputElement.value = '';  // Clear the input field for new entry
                location.href = '#/' + this.page;

            }

        } catch (error) {
            console.log(error)
        }
    }
}