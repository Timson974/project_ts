//1 way - Alex Zhukov:
// import {UrlManager} from "../utils/url-manager";
// import {CustomHttp} from "../services/custom-http";
// import config from "../../config/config";
//
// export class EditCreateCategoryCategory {
//     constructor(page) {
//         this.routeParams = UrlManager.getQueryParams();
//         this.cancelButtonElement = null;
//         this.editButtonElement = null;
//         this.inputElement = null;
//         this.titleElement = null;
//         this.page = page;
//         this.init();
//
//     }
//
//     async init() {
//         const that = this;
//         this.inputElement = document.getElementById('input');
//         this.titleElement = document.getElementById('category-title');
//         if (this.routeParams.id) {
//             this.titleElement.innerText = this.page === 'income' ? 'Редактирование категории доходов' : 'Редактирование категории расходов';
//         } else {
//             this.titleElement.innerText = this.page === 'income' ? 'Создание категории доходов' : 'Создание категории расходов';
//         }
//
//         this.cancelButtonElement = document.getElementsByClassName('btn-danger')[0];
//         this.editButtonElement = document.getElementsByClassName('btn-success')[0];
//         if (this.routeParams.id) {
//             this.editButtonElement.innerText = 'Редактировать';
//         } else {
//             this.editButtonElement.innerText = 'Создать';
//         }
//         this.cancelButtonElement.addEventListener('click', () => {
//             window.location = '#/' + that.page
//         });
//         this.editButtonElement.addEventListener('click', () => {
//             that.saveCategory()
//         })
//         this.inputElement.addEventListener('change', function () {
//             if (this.value) {
//                 that.editButtonElement.removeAttribute('disabled');
//             } else {
//                 that.editButtonElement.setAttribute('disabled', 'disabled');
//             }
//         })
//
//         if (this.routeParams.id) {
//             try {
//                 const result = await CustomHttp.request(config.host + `/categories/${this.page}/` + this.routeParams.id);
//                 if (result) {
//                     if (result.error) {
//                         throw new Error(result.error);
//                     }
//                     this.inputElement.value = result.title;
//                 }
//             } catch (error) {
//                 console.log(error)
//             }
//         }
//     }
//
//     async saveCategory() {
//         let queryString, method;
//
//         if (this.routeParams.id) {
//             queryString = config.host + `/categories/${this.page}/` + this.routeParams.id;
//             method = 'PUT';
//         } else {
//             queryString = config.host +`/categories/${this.page}`;
//             method = 'POST'
//         }
//         try {
//             const result = await CustomHttp.request(queryString, method, {
//                 title: this.inputElement.value[0].toUpperCase() + this.inputElement.value.slice(1).toLowerCase()
//             })
//             if (result) {
//                 if (result.error) {
//                     throw new Error(result.error);
//                 }
//                 location.href = '#/' + this.page;
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }
// }

//2way - Timur Utepov:
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
        this.titleElement.innerText = this.page === 'income' ? 'Создание категории доходов' : 'Создание категории расходов';

        this.cancelButtonElement = document.getElementsByClassName('btn-danger')[0];
        this.editButtonElement = document.getElementsByClassName('btn-success')[0];
        this.cancelButtonElement.addEventListener('click', () => window.location.href = `#/${that.page}`);
        this.editButtonElement.addEventListener('click', () => that.saveCategory());
        this.inputElement.addEventListener('input', () => {
            that.editButtonElement.disabled = !that.inputElement.value.trim();
        });

        if (this.routeParams.id) {
            this.titleElement.innerText = this.page === 'income' ? 'Редактирование категории доходов' : 'Редактирование категории расходов';
            try {
                console.log(`Fetching category data from: ${config.host}/categories/${this.page}/${this.routeParams.id}`);
                const result = await CustomHttp.request(`${config.host}/categories/${this.page}/${this.routeParams.id}`);
                if (result.error) {
                    console.error('Error fetching category data:', result.error);
                    return;
                }
                this.inputElement.value = result.title;
            } catch (error) {
                console.error('Failed to fetch category data:', error);
            }
        }

        this.editButtonElement.innerText = this.routeParams.id ? 'Редактировать' : 'Создать';
    }

    async saveCategory() {
        const title = this.inputElement.value.trim();
        if (!title) {
            console.error('The title cannot be empty.');
            return;
        }
        const queryString = this.routeParams.id ? `${config.host}/categories/${this.page}/${this.routeParams.id}` : `${config.host}/categories/${this.page}`;
        const method = this.routeParams.id ? 'PUT' : 'POST';
        console.log(`Sending request to: ${queryString}`);
        try {
            const result = await CustomHttp.request(queryString, method, { title: title[0].toUpperCase() + title.slice(1) });
            if (result.error) {
                throw new Error(result.error);
            }
            window.location.href = `#/${this.page}`;
        } catch (error) {
            console.error('Error saving category:', error);
        }
    }
}
