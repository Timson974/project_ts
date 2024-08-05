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
exports.EditCreateCategory = void 0;
const url_manager_1 = require("../utils/url-manager");
const custom_http_1 = require("../services/custom-http");
const config_1 = __importDefault(require("../../config/config"));
const page_type_1 = require("../types/page.type");
class EditCreateCategory {
    constructor(page) {
        this.routeParams = url_manager_1.UrlManager.getQueryParams();
        this.canselButtonElement = null;
        this.editButtonElement = null;
        this.inputElement = null;
        this.titleElement = null;
        this.page = page;
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const that = this;
            this.inputElement = document.getElementById('input');
            this.titleElement = document.getElementById('category-title');
            if (this.routeParams.id) {
                this.titleElement.innerText = this.page === page_type_1.PageType.income ? 'Редактирование категории доходов' : 'Редактирование категории расходов';
            }
            else {
                this.titleElement.innerText = this.page === page_type_1.PageType.income ? 'Создание категории доходов' : 'Создание категории расходов';
            }
            this.canselButtonElement = document.getElementsByClassName('btn-danger')[0];
            this.editButtonElement = document.getElementsByClassName('btn-success')[0];
            if (this.routeParams.id) {
                this.editButtonElement.innerText = 'Редактировать';
            }
            else {
                this.editButtonElement.innerText = 'Создать';
            }
            this.canselButtonElement.addEventListener('click', () => {
                window.location.href = '#/' + that.page;
            });
            this.editButtonElement.addEventListener('click', () => {
                that.saveCategory();
            });
            this.inputElement.addEventListener('change', function () {
                if (that.editButtonElement) {
                    if (this.value) {
                        that.editButtonElement.removeAttribute('disabled');
                    }
                    else {
                        that.editButtonElement.setAttribute('disabled', 'disabled');
                    }
                }
            });
            if (this.routeParams.id) {
                try {
                    const result = yield custom_http_1.CustomHttp.request(config_1.default.host + `/categories/${this.page}/` + this.routeParams.id);
                    if (result) {
                        if (result.error) {
                            throw new Error(result.message);
                        }
                        this.inputElement.value = result.title;
                    }
                }
                catch (e) {
                    console.log(e);
                }
            }
        });
    }
    saveCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            let queryString, method;
            if (this.routeParams.id) {
                queryString = config_1.default.host + `/categories/${this.page}/` + this.routeParams.id;
                method = 'PUT';
            }
            else {
                queryString = config_1.default.host + `/categories/${this.page}`;
                method = 'POST';
            }
            try {
                const result = yield custom_http_1.CustomHttp.request(queryString, method, {
                    title: this.inputElement && this.inputElement.value[0].toUpperCase() + this.inputElement.value.slice(1).toLowerCase()
                });
                if (result) {
                    if (result.error) {
                        throw new Error(result.message);
                    }
                    location.href = '#/' + this.page;
                }
            }
            catch (e) {
                console.log(e);
            }
        });
    }
}
exports.EditCreateCategory = EditCreateCategory;
//# sourceMappingURL=edit-create-category.js.map