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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const sidebar_1 = require("./components/sidebar");
const main_1 = require("./components/main");
const income_and_expenses_1 = require("./components/income-and-expenses");
const form_1 = require("./components/form");
const auth_1 = require("./services/auth");
const categories_1 = require("./components/categories");
const create_edit_income_and_expenses_1 = require("./components/create-edit-income-and-expenses");
const edit_create_category_1 = require("./components/edit-create-category");
const actions_categories_type_1 = require("./types/actions-categories.type");
const page_type_1 = require("./types/page.type");
const url_route_type_1 = require("./types/url-route.type");
class Router {
    constructor() {
        this.layoutElement = document.getElementById('content');
        this.mainContentElement = null;
        this.titleElement = document.getElementById('title');
        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/layout.html',
                content: 'templates/main.html',
                load: () => {
                    new main_1.Main();
                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/registration.html',
                load: () => {
                    new form_1.Form(page_type_1.PageType.signup);
                }
            },
            {
                route: '#/login',
                title: 'Авторизация',
                template: 'templates/login.html',
                load: () => {
                    new form_1.Form(page_type_1.PageType.login);
                }
            },
            {
                route: '#/expense',
                title: 'Расходы',
                template: 'templates/layout.html',
                content: 'templates/categories.html',
                load: () => {
                    new categories_1.Categories(page_type_1.PageType.expense);
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: 'templates/layout.html',
                content: 'templates/categories.html',
                load: () => {
                    new categories_1.Categories(page_type_1.PageType.income);
                }
            },
            {
                route: '#/create-expense',
                title: 'Создать категорию расходов',
                template: 'templates/layout.html',
                content: 'templates/edit-create-category.html',
                load: () => {
                    new edit_create_category_1.EditCreateCategory(page_type_1.PageType.expense);
                }
            },
            {
                route: '#/edit-expense',
                title: 'Редактировать категорию расходов',
                template: 'templates/layout.html',
                content: 'templates/edit-create-category.html',
                load: () => {
                    new edit_create_category_1.EditCreateCategory(page_type_1.PageType.expense);
                }
            },
            {
                route: '#/create-income',
                title: 'Создать категорию дохода',
                template: 'templates/layout.html',
                content: 'templates/edit-create-category.html',
                load: () => {
                    new edit_create_category_1.EditCreateCategory(page_type_1.PageType.income);
                }
            },
            {
                route: '#/edit-income',
                title: 'Редактировать категорию дохода',
                template: 'templates/layout.html',
                content: 'templates/edit-create-category.html',
                load: () => {
                    new edit_create_category_1.EditCreateCategory(page_type_1.PageType.income);
                }
            },
            {
                route: '#/income-and-expenses',
                title: 'Доходы и расходы',
                template: 'templates/layout.html',
                content: 'templates/income-and-expenses.html',
                load: () => {
                    new income_and_expenses_1.IncomeAndExpenses();
                }
            },
            {
                route: '#/edit-income-and-expenses',
                title: 'Редактирование дохода/расхода',
                template: 'templates/layout.html',
                content: 'templates/create-edit-income-and-expenses.html',
                load: () => {
                    new create_edit_income_and_expenses_1.CreateEditIncomeAndExpenses(actions_categories_type_1.ActionsCategoriesType.edit);
                }
            },
            {
                route: '#/create-income-and-expenses',
                title: 'Создание дохода/расхода',
                template: 'templates/layout.html',
                content: 'templates/create-edit-income-and-expenses.html',
                load: () => {
                    new create_edit_income_and_expenses_1.CreateEditIncomeAndExpenses(actions_categories_type_1.ActionsCategoriesType.create);
                }
            },
        ];
    }
    openRoute() {
        return __awaiter(this, void 0, void 0, function* () {
            document.body.style.overflow = 'auto';
            const urlRoute = window.location.hash.split('?')[0];
            if (urlRoute === url_route_type_1.UrlRouteType.logout) {
                yield auth_1.Auth.logout();
                window.location.href = '#/login';
                return;
            }
            const newRoute = this.routes.find(item => {
                return item.route === urlRoute;
            });
            if (!newRoute) {
                window.location.href = '#/login';
                return;
            }
            if (this.layoutElement) {
                this.layoutElement.innerHTML = yield fetch(newRoute.template).then(response => response.text());
            }
            if (urlRoute !== url_route_type_1.UrlRouteType.login && urlRoute !== url_route_type_1.UrlRouteType.signup) {
                const accessTokenKey = localStorage.getItem(auth_1.Auth.accessTokenKey);
                if (!accessTokenKey) {
                    window.location.href = '#/login';
                    return;
                }
                else {
                    new sidebar_1.Sidebar(urlRoute);
                }
            }
            if (newRoute.content) {
                this.mainContentElement = document.getElementById('main-content');
                if (this.mainContentElement) {
                    this.mainContentElement.innerHTML = yield fetch(newRoute.content).then(response => response.text());
                }
            }
            if (this.titleElement) {
                this.titleElement.innerText = newRoute.title;
            }
            newRoute.load();
        });
    }
}
exports.Router = Router;
//# sourceMappingURL=router.js.map