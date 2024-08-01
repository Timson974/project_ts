import {Sidebar} from "./components/sidebar.ts";
import {Main} from "./components/main.ts";
import {IncomeAndExpenses} from "./components/income-and-expenses.ts";
import {Form} from "./components/form.ts";
import {Auth} from "./services/auth.ts";
import {Categories} from "./components/categories.ts";
import {CreateEditIncomeAndExpenses} from "./components/create-edit-income-and-expenses";
import {EditCreateCategoryCategory} from "./components/edit-create-category";

export class Router {
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
                    new Main()
                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/registration.html',
                load: () => {
                    new Form('signup');
                }
            },
            {
                route: '#/login',
                title: 'Авторизация',
                template: 'templates/login.html',
                load: () => {
                    new Form('login');
                }
            },
            {
                route: '#/expenses',
                title: 'Расходы',
                template: 'templates/layout.html',
                content: 'templates/categories.html',
                load: () => {
                    new Categories('expense');
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: 'templates/layout.html',
                content: 'templates/categories.html',
                load: () => {
                    new Categories('income');
                }
            },
            {
                route: '#/create-expense',
                title: 'Создать категорию расходов',
                template: 'templates/layout.html',
                content: 'templates/edit-create-category.html',
                load: () => {
                    new EditCreateCategoryCategory('expense');
                }
            },
            {
                route: '#/edit-expense',
                title: 'Редактировать категорию расходов',
                template: 'templates/layout.html',
                content: 'templates/edit-create-category.html',
                load: () => {
                    new EditCreateCategoryCategory('expense');
                }
            },
            {
                route: '#/create-income',
                title: 'Создать категорию дохода',
                template: 'templates/layout.html',
                content: 'templates/edit-create-category.html',
                load: () => {
                    new EditCreateCategoryCategory('income');
                }
            },
            {
                route: '#/edit-income',
                title: 'Редактировать категорию дохода',
                template: 'templates/layout.html',
                content: 'templates/edit-create-category.html',
                load: () => {
                    new EditCreateCategoryCategory('income');
                }
            },
            {
                route: '#/income-and-expenses',
                title: 'Доходы и расходы',
                template: 'templates/layout.html',
                content: 'templates/income-and-expenses.html',
                load: () => {
                    new IncomeAndExpenses();
                }
            },
            {
                route: '#/edit-income-and-expenses',
                title: 'Редактирование дохода/расхода',
                template: 'templates/layout.html',
                content: 'templates/create-edit-income-and-expenses.html',
                load: () => {
                    new CreateEditIncomeAndExpenses('edit');
                }
            },
            {
                route: '#/create-income-and-expenses',
                title: 'Создание дохода/расхода',
                template: 'templates/layout.html',
                content: 'templates/create-edit-income-and-expenses.html',
                load: () => {
                    new CreateEditIncomeAndExpenses('create');
                }
            },
        ]
    }

    async openRoute() {

        document.body.style.overflow = 'auto'
        const urlRoute = window.location.hash.split('?')[0];
        if (urlRoute === '#/logout') {
            await Auth.logout();
            window.location.href = '#/login';
            return;
        }

        const newRoute = this.routes.find(item => {
            return item.route === urlRoute;
        })

        if (!newRoute ) {
            window.location.href = '#/login';
            return
        }
        this.layoutElement.innerHTML = await fetch(newRoute.template).then(response => response.text());

        if (urlRoute !== '#/login' && urlRoute !== '#/signup' ) {
            const accessTokenKey = localStorage.getItem(Auth.accessTokenKey);
            if (!accessTokenKey) {
                window.location.href = '#/login';
            } else {
                new Sidebar(urlRoute)
            }

        }

        if (newRoute.content) {
            this.mainContentElement = document.getElementById('main-content');
            this.mainContentElement.innerHTML = await fetch(newRoute.content).then(response => response.text());
        }
        this.titleElement.innerText = newRoute.title;

        newRoute.load();
    }
}