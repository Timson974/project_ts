import {Auth} from "../services/auth.js";
import config from "../../config/config.js";
import {CustomHttp} from "../services/custom-http.js";

export class Form {
    constructor(page) {
        this.passwordElement = null;
        this.rePasswordElement = null;
        this.processElement = null;
        this.remCheckElement = null;
        this.page = page;

        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (accessToken) {
            location.href = '#/';
            return;
        }
        this.fields = [

            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
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

        if (this.page === 'signup') {
            this.fields.unshift({
                    name: 'fullName',
                    id: 'fullName',
                    element: null,
                    regex: /^[A-ZА-ЯЁ][a-zа-яё]+(\s+[A-ZА-ЯЁ][a-zа-яё]+)(\s+[A-ZА-ЯЁ][a-zа-яё]+)?/,
                    valid: false
                })
            this.fields.push({
                name: 'rePassword',
                id: 'rePassword',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false
            })
        }


        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validateField.call(that, item, this)
            }
        })
        this.rePasswordElement = document.getElementById('rePassword');
        this.passwordElement = document.getElementById('password');
        this.processElement = document.getElementById('process');
        this.processElement.onclick = function () {
            that.processForm()
        }

        if (this.page === 'login') {
            this.remCheckElement = document.getElementById('remCheck');
        }
    }


    validateField(field, element) {

        if (!element.value || !element.value.match(field.regex)) {
            element.parentNode.style.border = '1px solid red';
            field.valid = false;
        } else {
            element.parentNode.removeAttribute('style');
            field.valid = true;
        }

        this.validateForm()
    }

    validateForm() {
        if (this.page === 'signup') {
            if (this.passwordElement.value !== this.rePasswordElement.value) {
                this.rePasswordElement.parentNode.style.border = '2px solid red';
            } else {
                this.passwordElement.parentNode.removeAttribute('style');
                this.rePasswordElement.parentNode.removeAttribute('style');
            }
        }

        const validForm = this.fields.every(item => item.valid);
        const isValid = this.rePasswordElement ? this.passwordElement.value === this.rePasswordElement.value && validForm : validForm;
        if (isValid) {
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'disabled')
        }
        return isValid
    }

    async processForm() {
        if (this.validateForm()) {
            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;
            let remCheck;
            if (this.page === 'login') {
                remCheck = this.remCheckElement.checked;
            }
            if (this.page === 'signup') {
                try {
                    const result = await CustomHttp.request(config.host + '/signup', 'POST', {
                        name: this.fields.find(item => item.name === 'fullName').element.value.split(' ')[0],
                        lastName: this.fields.find(item => item.name === 'fullName').element.value.split(' ').slice(1).toString().replace(',', ' '),
                        email: email,
                        password: password,
                        passwordRepeat: this.fields.find(item => item.name === 'rePassword').element.value
                    })
                    if(result) {
                        if (result.error || !result.user) {
                            throw new Error(result.message);
                        }
                    }
                } catch (error) {
                    return console.log(error)
                }
            }

            try {
                const result = await CustomHttp.request(config.host + '/login', 'POST', {
                    email: email,
                    password: password,
                    rememberMe: remCheck
                })

                if (result) {
                    if (result.error || !result.tokens.accessToken || !result.tokens.refreshToken
                        ||  !result.user.id || !result.user.name || !result.user.lastName) {
                        throw new Error(result.message);
                    }

                    Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    Auth.setUserInfo({
                        name: result.user.name,
                        lastName: result.user.lastName,
                        userId: result.user.id,
                        email: email
                    })
                    location.href = '#/';
                }
            } catch (e) {
                console.log(e)
            }

        }
    }
}


//continue
// import {Auth} from "../services/auth.js";
// import config from "../../config/config.js";
// import {CustomHttp} from "../services/custom-http.js";
//
// export class Form {
//     constructor(page) {
//         this.passwordElement = null;
//         this.rePasswordElement = null;
//         this.processElement = null;
//         this.remCheckElement = null;
//         this.page = page;
//
//         const accessToken = localStorage.getItem(Auth.accessTokenKey);
//         if (accessToken) {
//             location.href = '#/';
//             return;
//         }
//         this.fields = [
//
//             {
//                 name: 'email',
//                 id: 'email',
//                 element: null,
//                 regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
//                 valid: false
//             },
//             {
//                 name: 'password',
//                 id: 'password',
//                 element: null,
//                 regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
//                 valid: false
//             },
//         ];
//
//         if (this.page === 'signup') {
//             this.fields.unshift({
//                 name: 'fullName',
//                 id: 'fullName',
//                 element: null,
//                 regex: /^[A-ZА-ЯЁ][a-zа-яё]+(\s+[A-ZА-ЯЁ][a-zа-яё]+)(\s+[A-ZА-ЯЁ][a-zа-яё]+)?/,
//                 valid: false
//             })
//             this.fields.push({
//                 name: 'rePassword',
//                 id: 'rePassword',
//                 element: null,
//                 regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
//                 valid: false
//             })
//         }
//
//
//         const that = this;
//         this.fields.forEach(item => {
//             item.element = document.getElementById(item.id);
//             item.element.onchange = function () {
//                 that.validateField.call(that, item, this)
//             }
//         })
//         this.rePasswordElement = document.getElementById('rePassword');
//         this.passwordElement = document.getElementById('password');
//         this.processElement = document.getElementById('process');
//         this.processElement.onclick = function () {
//             that.processForm()
//         }
//
//         if (this.page === 'login') {
//             this.remCheckElement = document.getElementById('remCheck');
//         }
//     }
//
//
//     validateField(field, element) {
//
//         if (!element.value || !element.value.match(field.regex)) {
//             element.parentNode.style.border = '1px solid red';
//             field.valid = false;
//         } else {
//             element.parentNode.removeAttribute('style');
//             field.valid = true;
//         }
//
//         this.validateForm()
//     }
//
//     validateForm() {
//         if (this.page === 'signup') {
//             if (!this.passwordElement.value
//                 || !this.rePasswordElement.value
//                 || this.passwordElement.value !== this.rePasswordElement.value
//                 || !this.rePasswordElement.value.match(this.fields.filter( el => el.name === 'rePassword')[0].regex)
//                 || !this.passwordElement.value.match(this.fields.filter( el => el.name === 'password')[0].regex)) {
//                 this.rePasswordElement.parentNode.style.border = '1px solid red';
//             } else {
//                 this.passwordElement.parentNode.removeAttribute('style');
//                 this.rePasswordElement.parentNode.removeAttribute('style');
//             }
//         }
//
//         const validForm = this.fields.every(item => item.valid);
//         const isValid = this.rePasswordElement ? this.passwordElement.value === this.rePasswordElement.value && validForm : validForm;
//         if (isValid) {
//             this.processElement.removeAttribute('disabled');
//         } else {
//             this.processElement.setAttribute('disabled', 'disabled')
//         }
//         return isValid
//     }
//
//     async processForm() {
//         if (this.validateForm()) {
//             const email = this.fields.find(item => item.name === 'email').element.value;
//             const password = this.fields.find(item => item.name === 'password').element.value;
//             let remCheck;
//             if (this.page === 'login') {
//                 remCheck = this.remCheckElement.checked;
//             }
//             if (this.page === 'signup') {
//                 try {
//                     const result = await CustomHttp.request(config.host + '/signup', 'POST', {
//                         name: this.fields.find(item => item.name === 'fullName').element.value.split(' ')[0],
//                         lastName: this.fields.find(item => item.name === 'fullName').element.value.split(' ').slice(1).toString().replace(',', ' '),
//                         email: email,
//                         password: password,
//                         passwordRepeat: this.fields.find(item => item.name === 'rePassword').element.value
//                     })
//                     if(result) {
//                         if (result.error || !result.user) {
//                             throw new Error(result.message);
//                         }
//                     }
//                 } catch (error) {
//                     return console.log(error)
//                 }
//             }
//
//             try {
//                 const result = await CustomHttp.request(config.host + '/login', 'POST', {
//                     email: email,
//                     password: password,
//                     rememberMe: remCheck
//                 })
//
//                 if (result) {
//                     if (result.error || !result.tokens.accessToken || !result.tokens.refreshToken
//                         ||  !result.user.id || !result.user.name || !result.user.lastName) {
//                         throw new Error(result.message);
//                     }
//
//                     Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
//                     Auth.setUserInfo({
//                         name: result.user.name,
//                         lastName: result.user.lastName,
//                         userId: result.user.id,
//                         email: email
//                     })
//                     location.href = '#/';
//                 }
//             } catch (error) {
//                 console.log(error)
//             }
//
//         }
//     }
// }