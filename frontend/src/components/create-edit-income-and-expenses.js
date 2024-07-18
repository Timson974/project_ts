//1way - Alex Zhukov
// import {UrlManager} from "../utils/url-manager.js";
// import {CustomHttp} from "../services/custom-http.js";
// import config from "../../config/config.js";
// import {AddOptions} from "../utils/add-options.js";
//
// export class CreateEditIncomeAndExpenses {
//     constructor(action) {
//         this.cancelButtonElement = null;
//         this.saveButtonElement = null;
//         this.routeParams = UrlManager.getQueryParams();
//         this.selectTypeElement = null;
//         this.selectCategoryElement = null;
//         this.categories = null;
//         this.inputAmountElement = null;
//         this.inputDateElement = null;
//         this.inputCommentElement = null;
//         this.formFields = null;
//         this.action = action;
//         this.titleElement = null;
//         this.buttonSaveOperation = null;
//         this.init()
//     }
//
//     async init() {
//         const that = this;
//         this.buttonSaveOperation = document.getElementById('button-save-operation');
//         this.buttonSaveOperation.innerText = this.action === 'edit' ? 'Сохранить' : 'Создать';
//         this.titleElement = document.getElementById('title-operation');
//         this.titleElement.innerText = this.action === 'edit' ? 'Редактирование дохода/расхода' : 'Создание дохода/расхода';
//         this.formFields = document.getElementsByClassName('form-control');
//         [].forEach.call(this.formFields, function (field) {
//             field.addEventListener('change', () => {
//                 that.validateFields(Array.from(that.formFields))
//             })
//         });
//         this.selectTypeElement = document.getElementById('type');
//         this.selectTypeElement.addEventListener('change', function () {
//             that.getCategory(this.value);
//         })
//         this.selectCategoryElement = document.getElementById('category');
//         this.inputAmountElement = document.getElementById('amount');
//         this.inputDateElement = document.getElementById('date')
//         this.inputCommentElement = document.getElementById('comment');
//
//         if (this.action === 'edit') {
//             if (this.routeParams.id) {
//                 try {
//                     const result = await CustomHttp.request(config.host + '/operations/' + this.routeParams.id);
//                     if (result) {
//                         if (result.error) {
//                             throw new Error(result.error);
//                         }
//                         await this.getCategory(result.type)
//                         this.updateDataForm(result)
//                     }
//                 } catch (e) {
//                     console.log(e)
//                 }
//             }
//         }
//
//         this.cancelButtonElement = document.getElementsByClassName('btn-danger')[0];
//         this.cancelButtonElement.addEventListener('click', () => {
//             window.location = '#/income-and-expenses' + '?period=true';
//         })
//         this.saveButtonElement = document.getElementsByClassName('btn-success')[0];
//         this.saveButtonElement.addEventListener('click', () => {
//             that.saveOperation()
//         })
//     }
//
//     async saveOperation() {
//         const method = this.action === 'edit' ? 'PUT' : 'POST';
//         const queryString = this.action === 'edit' ?
//             `${config.host}/operations/${this.routeParams.id}` : `${config.host}/operations`;
//         const data = {
//             type: this.selectTypeElement.value,
//             amount: +this.inputAmountElement.value,
//             date: this.inputDateElement.value,
//             comment: this.inputCommentElement.value,
//             category_id: +this.selectCategoryElement.value
//         }
//         if (data.type && data.amount && data.date && data.category_id && data.comment) {
//             try {
//                 const result = await CustomHttp.request(queryString, method, data)
//                 if (result) {
//                     if (result.error) {
//                         throw new Error(result.message);
//                     }
//                     location.href = '#/income-and-expenses' + '?period=true';
//                 } else {
//                     throw new Error('Операция не обновлена или не создана');
//                 }
//             } catch (e) {
//                 console.log(e)
//             }
//         }
//     }
//
//     updateDataForm (result) {
//         this.selectTypeElement.value = result.type;
//         this.selectCategoryElement.value = this.categories.filter( el => el.title === result.category )[0].id;
//         this.inputAmountElement.value = result.amount;
//         this.inputDateElement.value = result.date;
//         this.inputCommentElement.value = result.comment;
//     }
//
//     async getCategory(type) {
//         try {
//             const results = await CustomHttp.request(config.host + `/categories/${type}`);
//             if (results) {
//                 if (results.error) {
//                     throw new Error(results.error);
//                 }
//                 this.categories = results;
//                 AddOptions.addOptions(results, 'category')
//             } else {
//                 throw new Error('Нет категорий');
//             }
//
//         } catch (e) {
//             console.log(e)
//         }
//     }
//
//     validateFields(fields) {
//         fields.forEach(field => this.validForm = !!field.value);
//         if (this.validForm) {
//             this.saveButtonElement.removeAttribute('disabled')
//         } else {
//             this.saveButtonElement.setAttribute('disabled', 'disabled')
//         }
//     }
//
// }

//2way - Timur Utepov:
import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {AddOptions} from "../utils/add-options.js";

export class CreateEditIncomeAndExpenses {
    constructor(action) {
        this.cancelButtonElement = null;
        this.saveButtonElement = null;
        this.routeParams = UrlManager.getQueryParams();
        this.selectTypeElement = null;
        this.selectCategoryElement = null;
        this.categories = null;
        this.inputAmountElement = null;
        this.inputDateElement = null;
        this.inputCommentElement = null;
        this.formFields = null;
        this.action = action;
        this.titleElement = null;
        this.buttonSaveOperation = null;
        this.init();
    }

    async init() {
        const that = this;
        this.buttonSaveOperation = document.getElementById('button-save-operation');
        this.buttonSaveOperation.innerText = this.action === 'edit' ? 'Сохранить' : 'Создать';
        this.titleElement = document.getElementById('title-operation');
        this.titleElement.innerText = this.action === 'edit' ? 'Редактирование дохода/расхода' : 'Создание дохода/расхода';
        this.formFields = Array.from(document.getElementsByClassName('form-control'));
        this.formFields.forEach(field => {
            field.addEventListener('change', () => that.validateFields(that.formFields));
        });
        this.selectTypeElement = document.getElementById('type');
        this.selectTypeElement.addEventListener('change', function () {
            that.getCategory(this.value);
        });
        this.selectCategoryElement = document.getElementById('category');
        this.inputAmountElement = document.getElementById('amount');
        this.inputDateElement = document.getElementById('date');
        this.inputCommentElement = document.getElementById('comment');

        if (this.action === 'edit' && this.routeParams.id) {
            try {
                const result = await CustomHttp.request(`${config.host}/operations/${this.routeParams.id}`);
                if (!result) {
                    console.error('No data received.');
                    return;
                }
                if (result.error) {
                    throw new Error(result.error);
                }
                await this.getCategory(result.type);
                this.updateDataForm(result);
            } catch (error) {
                console.error('Error loading operation data:', error);
            }
        }

        this.cancelButtonElement = document.getElementsByClassName('btn-danger')[0];
        this.cancelButtonElement.addEventListener('click', () => {
            window.location.href = `#/${this.action === 'edit' ? 'edit-income-and-expenses' : 'income-and-expenses'}`;
        });
        this.saveButtonElement = document.getElementsByClassName('btn-success')[0];
        this.saveButtonElement.addEventListener('click', () => this.saveOperation());
    }

    async saveOperation() {
        const data = {
            type: this.selectTypeElement.value,
            amount: parseFloat(this.inputAmountElement.value),
            date: this.inputDateElement.value,
            comment: this.inputCommentElement.value,
            category_id: parseInt(this.selectCategoryElement.value)
        };
        const queryString = this.action === 'edit' ? `${config.host}/operations/${this.routeParams.id}` : `${config.host}/operations`;
        const method = this.action === 'edit' ? 'PUT' : 'POST';

        if (!data.type || isNaN(data.amount) || !data.date || isNaN(data.category_id) || !data.comment) {
            console.error('Validation failed: some fields are empty or invalid.');
            return;
        }

        try {
            const result = await CustomHttp.request(queryString, method, data);
            if (result && !result.error) {
                window.location.href = '#/income-and-expenses';
            } else {
                throw new Error('Operation failed to save.');
            }
        } catch (error) {
            console.error('Error saving operation:', error);
        }
    }

    validateFields(fields) {
        const isValid = fields.every(field => field.value.trim() !== '');
        if (isValid) {
            this.saveButtonElement.removeAttribute('disabled');
        } else {
            this.saveButtonElement.setAttribute('disabled', 'disabled');
        }
    }

    async getCategory(type) {
        try {
            const results = await CustomHttp.request(`${config.host}/categories/${type}`);
            if (!results) {
                console.error('No categories received.');
                return;
            }
            if (results.error) {
                throw new Error(results.error);
                return;
            }
            this.categories = results;
            AddOptions.addOptions(results, this.selectCategoryElement);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    }

    updateDataForm(data) {
        this.selectTypeElement.value = data.type;
        this.inputAmountElement.value = data.amount;
        this.inputDateElement.value = data.date;
        this.inputCommentElement.value = data.comment;
        this.selectCategoryElement.value = this.categories.find(el => el.title === data.category).id;
    }
}
