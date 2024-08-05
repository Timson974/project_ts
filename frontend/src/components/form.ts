import {Auth} from "../services/auth";
import config from "../../config/config";
import {CustomHttp} from "../services/custom-http";
import {PageType} from "../types/page.type";
import {FormFieldsType} from "../types/form-fields.type";
import {DefaultResponseType} from "../types/responses/default-response.type";
import {UserInfoType} from "../types/user-info.type";
import {LoginResponseType} from "../types/responses/login-response.type";

export class Form {
    readonly passwordElement: HTMLInputElement | null;
    readonly rePasswordElement: HTMLInputElement | null;
    readonly remCheckElement: HTMLInputElement | null;
    readonly processElement: HTMLElement | null;
    readonly page: PageType;
    private remCheck: boolean | null;
    private fields: FormFieldsType[] = [

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

    constructor(page: PageType) {
        this.passwordElement = null;
        this.rePasswordElement = null;
        this.processElement = null;
        this.remCheckElement = null;
        this.page = page;
        this.remCheck = null;

        const accessToken: string | null = localStorage.getItem(Auth.accessTokenKey);
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
                })
            this.fields.push({
                name: 'rePassword',
                id: 'rePassword',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false
            })
        }


        const that: Form = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id) as HTMLInputElement;
            item.element.onchange = function () {
                that.validateField.call(that, item, <HTMLInputElement>this)
            }
        })
        this.rePasswordElement = document.getElementById('rePassword') as HTMLInputElement;
        this.passwordElement = document.getElementById('password') as HTMLInputElement;
        this.processElement = document.getElementById('process');
        if (this.processElement) {
            this.processElement.onclick = function () {
                that.processForm()
            }
        }


        if (this.page === PageType.login ) {
            this.remCheckElement = document.getElementById('remCheck') as HTMLInputElement;
        }
    }

    private validateField(field: FormFieldsType, element: HTMLInputElement): void {

        if (!element.value || !element.value.match(field.regex)) {
            (element.parentNode as HTMLElement).style.border = '1px solid red';
            field.valid = false;
        } else {
            (element.parentNode as HTMLElement).removeAttribute('style');
            field.valid = true;
        }
        this.validateForm()
    }

    private validateForm(): boolean {
        if (this.page === PageType.signup) {
            if (this.passwordElement && this.rePasswordElement) {
                if (!this.passwordElement.value
                    || !this.rePasswordElement.value
                    || this.passwordElement.value !== this.rePasswordElement.value
                    || !this.rePasswordElement.value.match(this.fields.filter( el => el.name === 'rePassword')[0].regex)
                    || !this.passwordElement.value.match(this.fields.filter( el => el.name === 'password')[0].regex)) {
                    (this.rePasswordElement.parentNode as HTMLElement).style.border = '1px solid red';
                } else {
                    (this.passwordElement.parentNode as HTMLElement).removeAttribute('style');
                    (this.rePasswordElement.parentNode as HTMLElement).removeAttribute('style');
                }
            }
        }
        const validForm: boolean = this.fields.every(item => item.valid);
        const isValid = this.rePasswordElement ? this.passwordElement!.value === this.rePasswordElement.value && validForm : validForm;
        if (this.processElement) {
            if (isValid) {
                this.processElement.removeAttribute('disabled');
            } else {
                this.processElement.setAttribute('disabled', 'disabled')
            }
        }
        return isValid
    }

    private async processForm(): Promise<void> {
        if (this.validateForm()) {
            const email: string | undefined = this.fields.find(item => item.name === 'email')?.element?.value;
            const password: string | undefined = this.fields.find(item => item.name === 'password')?.element?.value;

            if (this.page === PageType.login) {
                if (this.remCheckElement) this.remCheck = this.remCheckElement.checked;
            }
            if (this.page === PageType.signup) {
                try {
                    const result: DefaultResponseType | UserInfoType = await CustomHttp.request(config.host + '/signup', 'POST', {
                        name: this.fields.find(item => item.name === 'fullName')?.element?.value.split(' ')[0],
                        lastName: this.fields.find(item => item.name === 'fullName')?.element?.value.split(' ').slice(1).toString().replace(',', ' '),
                        email: email,
                        password: password,
                        passwordRepeat: this.fields.find(item => item.name === 'rePassword')?.element?.value
                    })
                    if(result) {
                        if ((result as DefaultResponseType).error) {
                            throw new Error((result as DefaultResponseType).message);
                        }
                    }
                } catch (error) {
                    console.log(error)
                    return
                }
            }

            try {
                const result: DefaultResponseType | LoginResponseType= await CustomHttp.request(config.host + '/login', 'POST', {
                    email: email,
                    password: password,
                    rememberMe: this.remCheck
                })

                if (result) {
                    if ((result as DefaultResponseType).error) {
                        throw new Error((result as DefaultResponseType).message);
                    }

                    Auth.setTokens((result as LoginResponseType).tokens.accessToken, (result as LoginResponseType).tokens.refreshToken);
                    Auth.setUserInfo({
                        name: (result as LoginResponseType).user.name,
                        lastName: (result as LoginResponseType).user.lastName,
                        userId: (result as LoginResponseType).user.id!,
                        email: email as string
                    })
                    location.href = '#/';
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
}

