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
exports.CreateEditIncomeAndExpenses = void 0;
const url_manager_1 = require("../utils/url-manager");
const custom_http_1 = require("../services/custom-http");
const config_1 = __importDefault(require("../../config/config"));
const add_options_1 = require("../utils/add-options");
const actions_categories_type_1 = require("../types/actions-categories.type");
class CreateEditIncomeAndExpenses {
    constructor(action) {
        this.canselButtonElement = null;
        this.saveButtonElement = null;
        this.routeParams = url_manager_1.UrlManager.getQueryParams();
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
        this.validForm = null;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const that = this;
            this.buttonSaveOperation = document.getElementById('button-save-operation');
            if (this.buttonSaveOperation) {
                this.buttonSaveOperation.innerText = this.action === actions_categories_type_1.ActionsCategoriesType.edit ? 'Сохранить' : 'Создать';
            }
            this.titleElement = document.getElementById('title-operation');
            if (this.titleElement) {
                this.titleElement.innerText = this.action === actions_categories_type_1.ActionsCategoriesType.edit ? 'Редактирование дохода/расхода' : 'Создание дохода/расхода';
            }
            this.formFields = document.getElementsByClassName('form-control');
            [].forEach.call(this.formFields, function (field) {
                field.addEventListener('change', () => {
                    that.validateFields(Array.from(that.formFields));
                });
            });
            this.selectTypeElement = document.getElementById('type');
            if (this.selectTypeElement) {
                this.selectTypeElement.addEventListener('change', function () {
                    that.getCategory(this.value);
                });
            }
            this.selectCategoryElement = document.getElementById('category');
            this.inputAmountElement = document.getElementById('amount');
            this.inputDateElement = document.getElementById('date');
            this.inputCommentElement = document.getElementById('comment');
            if (this.action === actions_categories_type_1.ActionsCategoriesType.edit) {
                if (this.routeParams.id) {
                    try {
                        const result = yield custom_http_1.CustomHttp.request(config_1.default.host + '/operations/' + this.routeParams.id);
                        if (result) {
                            if (result.error) {
                                throw new Error(result.message);
                            }
                            yield this.getCategory(result.type);
                            this.updateDataForm(result);
                        }
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            }
            this.canselButtonElement = document.getElementsByClassName('btn-danger')[0];
            this.canselButtonElement.addEventListener('click', () => {
                location.href = '#/income-and-expenses' + '?period=true';
            });
            this.saveButtonElement = document.getElementsByClassName('btn-success')[0];
            this.saveButtonElement.addEventListener('click', () => {
                that.saveOperation();
            });
        });
    }
    saveOperation() {
        return __awaiter(this, void 0, void 0, function* () {
            const method = this.action === actions_categories_type_1.ActionsCategoriesType.edit ? 'PUT' : 'POST';
            const queryString = this.action === actions_categories_type_1.ActionsCategoriesType.edit ?
                `${config_1.default.host}/operations/${this.routeParams.id}` : `${config_1.default.host}/operations`;
            const data = {
                type: this.selectTypeElement.value,
                amount: +this.inputAmountElement.value,
                date: this.inputDateElement.value,
                comment: this.inputCommentElement.value,
                category_id: +this.selectCategoryElement.value
            };
            if (data.type && data.amount && data.date && data.category_id && data.comment) {
                try {
                    const result = yield custom_http_1.CustomHttp.request(queryString, method, data);
                    if (result) {
                        if (result.error) {
                            throw new Error(result.message);
                        }
                        location.href = '#/income-and-expenses' + '?period=true';
                    }
                    else {
                        throw new Error('Операция не обновлена или не создана');
                    }
                }
                catch (e) {
                    console.log(e);
                }
            }
        });
    }
    updateDataForm(result) {
        if (this.selectTypeElement && this.inputAmountElement && this.inputDateElement && this.inputCommentElement) {
            this.selectTypeElement.value = result.type;
            this.inputAmountElement.value = result.amount.toString();
            this.inputDateElement.value = result.date;
            this.inputCommentElement.value = result.comment;
        }
        if (this.selectCategoryElement && this.categories) {
            this.selectCategoryElement.value = this.categories.filter(el => el.title === result.category)[0].id.toString();
        }
    }
    getCategory(type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield custom_http_1.CustomHttp.request(config_1.default.host + `/categories/${type}`);
                if (results) {
                    if (results.error) {
                        throw new Error(results.message);
                    }
                    this.categories = results;
                    add_options_1.AddOptions.addOptions(results, 'category');
                }
                else {
                    throw new Error('Нет категорий');
                }
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    validateFields(fields) {
        fields.forEach((field) => {
            if (field.value) {
                this.validForm = true;
            }
            else {
                this.validForm = false;
            }
        });
        if (this.saveButtonElement) {
            if (this.validForm) {
                this.saveButtonElement.removeAttribute('disabled');
            }
            else {
                this.saveButtonElement.setAttribute('disabled', 'disabled');
            }
        }
    }
}
exports.CreateEditIncomeAndExpenses = CreateEditIncomeAndExpenses;
//# sourceMappingURL=create-edit-income-and-expenses.js.map