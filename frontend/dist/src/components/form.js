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
exports.Form = void 0;
const auth_1 = require("../services/auth");
const config_1 = __importDefault(require("../../config/config"));
const custom_http_1 = require("../services/custom-http");
const page_type_1 = require("../types/page.type");
class Form {
    constructor(page) {
        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                valid: false
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false
            },
        ];
        this.passwordElement = null;
        this.rePasswordElement = null;
        this.processElement = null;
        this.remCheckElement = null;
        this.page = page;
        this.remCheck = null;
        const accessToken = localStorage.getItem(auth_1.Auth.accessTokenKey);
        if (accessToken) {
            location.href = '#/';
            return;
        }
        if (this.page === 'signup') {
            this.fields.unshift({
                name: 'fullName',
                id: 'fullName',
                element: null,
                regex: /^[A-ZА-ЯЁ][a-zа-яё]+(\s+[A-ZА-ЯЁ][a-zа-яё]+)(\s+[A-ZА-ЯЁ][a-zа-яё]+)?/,
                valid: false
            });
            this.fields.push({
                name: 'rePassword',
                id: 'rePassword',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false
            });
        }
        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validateField.call(that, item, this);
            };
        });
        this.rePasswordElement = document.getElementById('rePassword');
        this.passwordElement = document.getElementById('password');
        this.processElement = document.getElementById('process');
        if (this.processElement) {
            this.processElement.onclick = function () {
                that.processForm();
            };
        }
        if (this.page === page_type_1.PageType.login) {
            this.remCheckElement = document.getElementById('remCheck');
        }
    }
    validateField(field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            element.parentNode.style.border = '1px solid red';
            field.valid = false;
        }
        else {
            element.parentNode.removeAttribute('style');
            field.valid = true;
        }
        this.validateForm();
    }
    validateForm() {
        if (this.page === page_type_1.PageType.signup) {
            if (this.passwordElement && this.rePasswordElement) {
                if (!this.passwordElement.value
                    || !this.rePasswordElement.value
                    || this.passwordElement.value !== this.rePasswordElement.value
                    || !this.rePasswordElement.value.match(this.fields.filter(el => el.name === 'rePassword')[0].regex)
                    || !this.passwordElement.value.match(this.fields.filter(el => el.name === 'password')[0].regex)) {
                    this.rePasswordElement.parentNode.style.border = '1px solid red';
                }
                else {
                    this.passwordElement.parentNode.removeAttribute('style');
                    this.rePasswordElement.parentNode.removeAttribute('style');
                }
            }
        }
        const validForm = this.fields.every(item => item.valid);
        const isValid = this.rePasswordElement ? this.passwordElement.value === this.rePasswordElement.value && validForm : validForm;
        if (this.processElement) {
            if (isValid) {
                this.processElement.removeAttribute('disabled');
            }
            else {
                this.processElement.setAttribute('disabled', 'disabled');
            }
        }
        return isValid;
    }
    processForm() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            if (this.validateForm()) {
                const email = (_b = (_a = this.fields.find(item => item.name === 'email')) === null || _a === void 0 ? void 0 : _a.element) === null || _b === void 0 ? void 0 : _b.value;
                const password = (_d = (_c = this.fields.find(item => item.name === 'password')) === null || _c === void 0 ? void 0 : _c.element) === null || _d === void 0 ? void 0 : _d.value;
                if (this.page === page_type_1.PageType.login) {
                    if (this.remCheckElement)
                        this.remCheck = this.remCheckElement.checked;
                }
                if (this.page === page_type_1.PageType.signup) {
                    try {
                        const result = yield custom_http_1.CustomHttp.request(config_1.default.host + '/signup', 'POST', {
                            name: (_f = (_e = this.fields.find(item => item.name === 'fullName')) === null || _e === void 0 ? void 0 : _e.element) === null || _f === void 0 ? void 0 : _f.value.split(' ')[0],
                            lastName: (_h = (_g = this.fields.find(item => item.name === 'fullName')) === null || _g === void 0 ? void 0 : _g.element) === null || _h === void 0 ? void 0 : _h.value.split(' ').slice(1).toString().replace(',', ' '),
                            email: email,
                            password: password,
                            passwordRepeat: (_k = (_j = this.fields.find(item => item.name === 'rePassword')) === null || _j === void 0 ? void 0 : _j.element) === null || _k === void 0 ? void 0 : _k.value
                        });
                        if (result) {
                            if (result.error) {
                                throw new Error(result.message);
                            }
                        }
                    }
                    catch (e) {
                        console.log(e);
                        return;
                    }
                }
                try {
                    const result = yield custom_http_1.CustomHttp.request(config_1.default.host + '/login', 'POST', {
                        email: email,
                        password: password,
                        rememberMe: this.remCheck
                    });
                    if (result) {
                        if (result.error) {
                            throw new Error(result.message);
                        }
                        auth_1.Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                        auth_1.Auth.setUserInfo({
                            name: result.user.name,
                            lastName: result.user.lastName,
                            userId: result.user.id,
                            email: email
                        });
                        location.href = '#/';
                    }
                }
                catch (e) {
                    console.log(e);
                }
            }
        });
    }
}
exports.Form = Form;
//# sourceMappingURL=form.js.map