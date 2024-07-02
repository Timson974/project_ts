import {Expenses} from "./components/expenses.js";
import {Income} from "./components/income.js";
import {CreateExpenses} from "./components/create-expenses.js";
import {EditExpenses} from "./components/edit-expenses.js";
import {CreateIncome} from "./components/create-income.js";
import {EditIncome} from "./components/edit-income.js";
import {Sidebar} from "./components/sidebar.js";
import {Main} from "./components/main.js";
import {IncomeAndExpenses} from "./components/income-and-expenses.js";
import {EditIncomeAndExpenses} from "./components/edit-income-and-expenses.js";
import {CreateIncomeAndExpenses} from "./components/create-income-and-expenses.js";
import {Form} from "./components/form.js";
import {Auth} from "./services/auth.js";

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
                content: 'templates/expenses.html',
                load: () => {
                    new Expenses();
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: 'templates/layout.html',
                content: 'templates/income.html',
                load: () => {
                    new Income();
                }
            },
            {
                route: '#/create-expenses',
                title: 'Создать категорию расходов',
                template: 'templates/layout.html',
                content: 'templates/create-expenses.html',
                load: () => {
                    new CreateExpenses();
                }
            },
            {
                route: '#/edit-expenses',
                title: 'Редактировать категорию расходов',
                template: 'templates/layout.html',
                content: 'templates/edit-expenses.html',
                load: () => {
                    new EditExpenses();
                }
            },
            {
                route: '#/create-income',
                title: 'Создать категорию дохода',
                template: 'templates/layout.html',
                content: 'templates/create-income.html',
                load: () => {
                    new CreateIncome();
                }
            },
            {
                route: '#/edit-income',
                title: 'Редактировать категорию дохода',
                template: 'templates/layout.html',
                content: 'templates/edit-income.html',
                load: () => {
                    new EditIncome();
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
                content: 'templates/edit-income-and-expenses.html',
                load: () => {
                    new EditIncomeAndExpenses();
                }
            },
            {
                route: '#/create-income-and-expenses',
                title: 'Доходы и расходы',
                template: 'templates/layout.html',
                content: 'templates/create-income-and-expenses.html',
                load: () => {
                    new CreateIncomeAndExpenses();
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

        if (!newRoute) {
            window.location.href = '#/login';
            return
        }
        this.layoutElement.innerHTML = await fetch(newRoute.template).then(response => response.text());
        if (urlRoute !== '#/login' && urlRoute !== '#/signup' ) {
            new Sidebar(urlRoute)
        }

        if (newRoute.content) {
            this.mainContentElement = document.getElementById('main-content');
            this.mainContentElement.innerHTML = await fetch(newRoute.content).then(response => response.text());
        }
        this.titleElement.innerText = newRoute.title;

        newRoute.load();
    }
}