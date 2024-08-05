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
exports.Sidebar = void 0;
const bootstrap_1 = require("bootstrap");
const auth_1 = require("../services/auth");
const custom_http_1 = require("../services/custom-http");
const config_1 = __importDefault(require("../../config/config"));
const updateBalance_1 = require("../utils/updateBalance");
const url_route_type_1 = require("../types/url-route.type");
class Sidebar {
    constructor(urlRoute) {
        this.sidebarTemplate = '../templates/sidebar.html';
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
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const accessTokenKey = localStorage.getItem(auth_1.Auth.accessTokenKey);
            if (!accessTokenKey) {
                window.location.href = '#/login';
                return;
            }
            try {
                const result = yield custom_http_1.CustomHttp.request(config_1.default.host + '/balance');
                if (result) {
                    this.balance = result.balance;
                    yield this.drawSidebar();
                }
            }
            catch (e) {
                console.log(e);
                return;
            }
        });
    }
    drawSidebar() {
        return __awaiter(this, void 0, void 0, function* () {
            const that = this;
            const userInfo = auth_1.Auth.getUserInfo();
            const sidebar = document.createElement('div');
            sidebar.className = "col-sm-4 col-md-3 col-xxl-2 d-flex flex-column flex-shrink-0 p-0 bg-white justify-content-between border-end sidebar_wrap";
            sidebar.setAttribute('id', 'sidebar_wrap');
            sidebar.innerHTML = yield fetch(this.sidebarTemplate).then(response => response.text());
            this.contentsWrapElement && this.contentsWrapElement.insertBefore(sidebar, this.contentsWrapElement.firstChild);
            this.accordionButtonElement = document.getElementById('accordion-button');
            this.flushCollapseOneElement = document.getElementById('flush-collapseOne');
            this.headerBtnMenuButtonElement = document.getElementById('header__menu-btn');
            this.menuMobileElement = document.getElementById('sidebar_wrap');
            this.balanceElement = document.getElementById('balance');
            if (this.balanceElement) {
                this.balanceElement.innerText = `${this.balance}$`;
                this.balanceElement.addEventListener('click', function () {
                    that.editBalance();
                });
            }
            this.fullNameElement = document.getElementById('full-name');
            if (this.fullNameElement && userInfo) {
                this.fullNameElement.innerText = `${userInfo.name}`;
            }
            if (this.headerBtnMenuButtonElement) {
                this.headerBtnMenuButtonElement.addEventListener('click', () => {
                    that.headerBtnMenuButtonElement && that.headerBtnMenuButtonElement.classList.toggle('active');
                    that.menuMobileElement && that.menuMobileElement.classList.toggle('active');
                    if (that.menuMobileElement && that.menuMobileElement.classList.contains('active')) {
                        document.body.style.overflow = 'hidden';
                    }
                    else {
                        document.body.style.overflow = 'auto';
                    }
                });
            }
            if (this.urlRoute === url_route_type_1.UrlRouteType.expense
                || this.urlRoute === url_route_type_1.UrlRouteType.income
                || this.urlRoute === url_route_type_1.UrlRouteType.createExpense
                || this.urlRoute === url_route_type_1.UrlRouteType.createIncome
                || this.urlRoute === url_route_type_1.UrlRouteType.editExpense
                || this.urlRoute === url_route_type_1.UrlRouteType.editIncome) {
                this.accordionButtonElement && this.accordionButtonElement.classList.remove('collapsed');
                this.flushCollapseOneElement && this.flushCollapseOneElement.classList.add('show');
            }
            else {
                this.accordionButtonElement && this.accordionButtonElement.classList.add('collapsed');
                this.flushCollapseOneElement && this.flushCollapseOneElement.classList.remove('show');
            }
            this.navLinksElements = document.getElementsByClassName('nav-link');
            [].forEach.call(that.navLinksElements, function (link) {
                if (link.getAttribute('href') === that.urlRoute) {
                    if (link.getAttribute('meta-name') === 'main') {
                        link.classList.remove('link-dark');
                    }
                    link.classList.add('active');
                }
                else {
                    if (link.getAttribute('meta-name') === 'main') {
                        link.classList.add('link-dark');
                    }
                    link.classList.remove('active');
                }
                if ((that.urlRoute === url_route_type_1.UrlRouteType.createExpense && link.getAttribute('href') === '#/expense')
                    || (that.urlRoute === url_route_type_1.UrlRouteType.editExpense && link.getAttribute('href') === '#/expense')
                    || (that.urlRoute === url_route_type_1.UrlRouteType.expense && link.getAttribute('href') === '#/expense')) {
                    link.classList.add('active');
                }
                if ((that.urlRoute === url_route_type_1.UrlRouteType.createIncome && link.getAttribute('href') === '#/income')
                    || (that.urlRoute === url_route_type_1.UrlRouteType.editIncome && link.getAttribute('href') === '#/income')
                    || (that.urlRoute === url_route_type_1.UrlRouteType.income && link.getAttribute('href') === '#/income')) {
                    link.classList.add('active');
                }
                if ((that.urlRoute === url_route_type_1.UrlRouteType.incomeAndExpenses && link.getAttribute('href') === '#/income-and-expenses')
                    || (that.urlRoute === url_route_type_1.UrlRouteType.createIncomeAndExpenses && link.getAttribute('href') === '#/income-and-expenses')
                    || (that.urlRoute === url_route_type_1.UrlRouteType.editIncomeAndExpenses && link.getAttribute('href') === '#/income-and-expenses')) {
                    link.classList.add('active');
                    link.classList.remove('link-dark');
                }
            });
            [...document.querySelectorAll('[data-bs-toggle="tooltip"]')]
                .forEach(el => new bootstrap_1.Tooltip(el));
        });
    }
    editBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            const that = this;
            this.wrapBalanceElement = document.getElementById('wrapBalance');
            this.parentBalanceElement = document.getElementById('parentBalance');
            this.editBalanceInputElement = document.createElement('input');
            this.editBalanceInputElement.className = 'form-control';
            this.editBalanceInputElement.setAttribute('type', 'number');
            this.editBalanceInputElement.setAttribute('name', 'editBalanceInput');
            this.editBalanceInputElement.setAttribute('id', 'editBalanceInput');
            this.editBalanceInputElement.setAttribute('patern', 'editBalanceInput');
            this.editBalanceInputElement.value = (yield updateBalance_1.UpdateBalance.getBalance()).toString();
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
            if (this.wrapBalanceElement) {
                this.wrapBalanceElement.appendChild(this.editBalanceInputElement);
                this.wrapBalanceElement.appendChild(this.saveBalanceButtonElement);
                this.wrapBalanceElement.appendChild(this.canselBalanceButtonElement);
            }
            this.canselBalanceButtonElement.addEventListener('click', () => that.canselSaveBalance());
            this.saveBalanceButtonElement.addEventListener('click', () => that.saveBalance());
        });
    }
    canselSaveBalance() {
        this.parentBalanceElement && this.parentBalanceElement.removeAttribute('style');
        this.editBalanceInputElement && this.editBalanceInputElement.remove();
        this.saveBalanceButtonElement && this.saveBalanceButtonElement.remove();
        this.canselBalanceButtonElement && this.canselBalanceButtonElement.remove();
    }
    saveBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            this.editBalanceInput = document.getElementById('editBalanceInput');
            try {
                const response = yield custom_http_1.CustomHttp.request(config_1.default.host + '/balance', 'PUT', {
                    newBalance: this.editBalanceInput.value
                });
                if (response && response.balance) {
                    this.balance = response.balance;
                    this.canselSaveBalance();
                    this.balanceElement.innerText = `${this.balance}$`;
                }
            }
            catch (e) {
                throw new Error(e);
            }
        });
    }
}
exports.Sidebar = Sidebar;
//# sourceMappingURL=sidebar.js.map