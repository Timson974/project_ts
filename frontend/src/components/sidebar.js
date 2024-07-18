import {Tooltip} from 'bootstrap';
import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {UpdateBalance} from "../utils/updateBalance.js";

export class Sidebar {
    _sidebarTemplate = '../templates/sidebar.html';

    constructor(urlRoute) {
        this.contentsWrapElement = document.getElementById('contents-wrap');
        this.urlRoute = urlRoute;
        this.accordionButtonElement = null;
        this.flushCollapseOneElement = null;
        this.navLinksElements = null;
        this.headerBtnMenuButtonElement = null;
        this.menuMobileElement = null;
        this.parentBalanceElement = null;
        this.balance = null;
        this.balanceElement = null;
        this.editBalanceInput = null;
        this.wrapBalanceElement = null;
        this.fullNameElement = null;
        this.editBalanceInputElement = null;
        this.saveBalanceButtonElement = null;
        this.canselBalanceButtonElement = null;


        this.init()
    }

    async init() {
        const accessTokenKey = localStorage.getItem(Auth.accessTokenKey);
        if (!accessTokenKey) {
            return window.location.href = '#/login';
        }
        try {
            const result = await CustomHttp.request(config.host + '/balance');
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }
                this.balance = result.balance;
                this.drawSidebar();

            }
        } catch (error) {
            return console.log(error)
        }
    }

    async drawSidebar() {
        const that = this;
        const userInfo = Auth.getUserInfo()
        const sidebar = document.createElement('div');
        sidebar.className = "col-sm-4 col-md-3 col-xxl-2 d-flex flex-column flex-shrink-0 p-0 bg-white justify-content-between border-end sidebar_wrap";
        sidebar.setAttribute('id', 'sidebar_wrap');
        sidebar.innerHTML = await fetch(this._sidebarTemplate).then(response => response.text());
        this.contentsWrapElement.insertBefore(sidebar, this.contentsWrapElement.firstChild)

        this.accordionButtonElement = document.getElementById('accordion-button');
        this.flushCollapseOneElement = document.getElementById('flush-collapseOne');

        this.headerBtnMenuButtonElement = document.getElementById('header__menu-btn');
        this.menuMobileElement = document.getElementById('sidebar_wrap');
        this.balanceElement = document.getElementById('balance');
        if (this.balanceElement) {
            this.balanceElement.innerText = `${this.balance}$`;
            this.balanceElement.addEventListener('click', function () {
                that.editBalance();
            })
        }


        this.fullNameElement = document.getElementById('full-name');
        this.fullNameElement.innerText = `${userInfo.name}`;

        this.headerBtnMenuButtonElement.addEventListener('click', () => {
            that.headerBtnMenuButtonElement.classList.toggle('active');
            that.menuMobileElement.classList.toggle('active');
            if (that.menuMobileElement.classList.contains('active')) {
                document.body.style.overflow = 'hidden'
            } else {
                document.body.style.overflow = 'auto'
            }
        })

        if (this.urlRoute === '#/expense'
            || this.urlRoute === '#/income'
            || this.urlRoute === '#/create-expense'
            || this.urlRoute === '#/create-income'
            || this.urlRoute === '#/edit-expense'
            || this.urlRoute === '#/edit-income'
        ) {
            this.accordionButtonElement.classList.remove('collapsed');
            this.flushCollapseOneElement.classList.add('show');
        } else {
            this.accordionButtonElement.classList.add('collapsed');
            this.flushCollapseOneElement.classList.remove('show');
        }

        this.navLinksElements = document.getElementsByClassName('nav-link');

        [].forEach.call(that.navLinksElements, function (link) {

            if (link.getAttribute('href') === that.urlRoute) {
                if (link.getAttribute('meta-name') === 'main') {
                    link.classList.remove('link-dark');
                }
                link.classList.add('active');
            } else {
                if (link.getAttribute('meta-name') === 'main') {
                    link.classList.add('link-dark');
                }
                link.classList.remove('active');
            }

            if ((that.urlRoute === '#/create-expense' && link.getAttribute('href') === '#/expense')
                || (that.urlRoute === '#/edit-expense' && link.getAttribute('href') === '#/expense')
                || (that.urlRoute === '#/expense' && link.getAttribute('href') === '#/expense')) {
                link.classList.add('active');
            }
            if ((that.urlRoute === '#/create-income' && link.getAttribute('href') === '#/income')
                || (that.urlRoute === '#/edit-income' && link.getAttribute('href') === '#/income')
                || (that.urlRoute === '#/income' && link.getAttribute('href') === '#/income')) {
                link.classList.add('active');
            }
            if ((that.urlRoute === '#/income-and-expenses' && link.getAttribute('href') === '#/income-and-expenses')
                || (that.urlRoute === '#/create-income-and-expenses' && link.getAttribute('href') === '#/income-and-expenses')
                || (that.urlRoute === '#/edit-income-and-expenses' && link.getAttribute('href') === '#/income-and-expenses')) {
                link.classList.add('active');
                link.classList.remove('link-dark')
            }
        });
        [...document.querySelectorAll('[data-bs-toggle="tooltip"]')]
            .forEach(el => new Tooltip(el));
    }

    async editBalance() {
        const that = this;
        this.wrapBalanceElement = document.getElementById('wrapBalance');
        this.parentBalanceElement = document.getElementById('parentBalance');
        this.editBalanceInputElement = document.createElement('input');
        this.editBalanceInputElement.className = 'form-control';
        this.editBalanceInputElement.setAttribute('type', 'number');
        this.editBalanceInputElement.setAttribute('name', 'editBalanceInput');
        this.editBalanceInputElement.setAttribute('id', 'editBalanceInput');
        this.editBalanceInputElement.setAttribute('patern', 'editBalanceInput');

        this.editBalanceInputElement.value = await UpdateBalance.getBalance();

        this.saveBalanceButtonElement = document.createElement('button');
        this.saveBalanceButtonElement.className = 'btn';
        this.saveBalanceButtonElement.setAttribute('id', 'saveBalance');
        const saveImageElement = document.createElement('img');
        saveImageElement.setAttribute('src', 'images/check2.svg');
        saveImageElement.setAttribute('alt', 'подтвердить');
        this.saveBalanceButtonElement.appendChild(saveImageElement);

        this.canselBalanceButtonElement = document.createElement('button');
        this.canselBalanceButtonElement.className = 'btn';
        this.canselBalanceButtonElement.setAttribute('id', 'canselEditBalance');
        const canselImageElement = document.createElement('img');
        canselImageElement.setAttribute('src', 'images/x.svg');
        canselImageElement.setAttribute('alt', 'отменить');
        this.canselBalanceButtonElement.appendChild(canselImageElement);
        this.parentBalanceElement.style.display = 'none';
        this.wrapBalanceElement.appendChild(this.editBalanceInputElement);
        this.wrapBalanceElement.appendChild(this.saveBalanceButtonElement);
        this.wrapBalanceElement.appendChild(this.canselBalanceButtonElement);

        this.canselBalanceButtonElement.addEventListener('click', function () {
            that.canselSaveBalance()
        })

        this.saveBalanceButtonElement.addEventListener('click', () => {
            that.saveBalance();
        })
    }

    cancelSaveBalance() {
        this.parentBalanceElement.removeAttribute('style')
        this.editBalanceInputElement.remove();
        this.saveBalanceButtonElement.remove();
        this.canselBalanceButtonElement.remove();
    }

    async saveBalance() {
        this.editBalanceInput = document.getElementById('editBalanceInput');
        try {
            const response = await CustomHttp.request(config.host + '/balance', 'PUT', {
                newBalance: this.editBalanceInput.value
            });
            if (response && response.balance) {
                this.balance = response.balance;
                this.canselSaveBalance();
                this.balanceElement.innerText = `${this.balance}$`;
            }
        } catch (error) {
            throw new Error(error);
        }
    }
}