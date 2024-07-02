import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

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
        this.balance = null;
        this.balanceElement = null;
        this.fullNameElement = null;

        this.init()
    }

    async init() {

        try {
            const result = await CustomHttp.request(config.host + '/balance');
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }
                this.balance = result.balance;
                this.drawSidebar()

            }
        } catch (e) {
            return console.log(e)
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
        this.fullNameElement = document.getElementById('full-name');
        this.balanceElement.innerText = `${this.balance}$`
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

        if (this.urlRoute === '#/expenses'
            || this.urlRoute === '#/income'
            || this.urlRoute === '#/create-expenses'
            || this.urlRoute === '#/create-income'
            || this.urlRoute === '#/edit-expenses'
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

            if ((that.urlRoute === '#/create-expenses' && link.getAttribute('href') === '#/expenses')
                || (that.urlRoute === '#/edit-expenses' && link.getAttribute('href') === '#/expenses')
                || (that.urlRoute === '#/expenses' && link.getAttribute('href') === '#/expenses')) {
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
    }

}