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
exports.IncomeAndExpenses = void 0;
const createModal_1 = require("./createModal");
const filter_1 = require("./filter");
const custom_http_1 = require("../services/custom-http");
const config_1 = __importDefault(require("../../config/config"));
const updateBalance_1 = require("../utils/updateBalance");
const page_type_1 = require("../types/page.type");
class IncomeAndExpenses {
    constructor() {
        this.tableElement = null;
        this.createButtonElements = null;
        this.idDeletingOperation = null;
        //this.data = null;
        this.periodString = null;
        this.init();
    }
    init() {
        this.periodString = sessionStorage.getItem('queryPeriodString');
        this.tableElement = document.getElementById('table');
        this.createButtonElements = document.getElementsByName('create-button');
        this.createButtonElements.forEach(button => {
            button.addEventListener('click', () => location.href = '#/create-income-and-expenses');
        });
        if (this.periodString) {
            new filter_1.Filter(this.drawRows.bind(this), this.periodString);
        }
        else {
            new filter_1.Filter(this.drawRows.bind(this), null);
        }
        new createModal_1.CreateModal(page_type_1.PageType.incomeAndExpenses, this.idDeletingOperation, this.updateTable.bind(this));
    }
    updateTable() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield custom_http_1.CustomHttp.request(config_1.default.host + '/operations?' + this.periodString);
                if (results) {
                    this.drawRows(results);
                    const balance = yield updateBalance_1.UpdateBalance.getBalance();
                    if (balance) {
                        const balanceElement = document.getElementById('balance');
                        if (balanceElement)
                            balanceElement.innerText = `${balance}$`;
                    }
                }
                else {
                    throw new Error('На данный период данных нет');
                }
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    drawRows(data) {
        if (this.tableElement)
            this.tableElement.replaceChildren();
        if (data && data.length > 0) {
            data.forEach((operation, index) => {
                this.createTrElement(operation, index);
            });
        }
    }
    createTrElement(operation, index) {
        const that = this;
        const trElement = document.createElement('tr');
        const thElement = document.createElement('th');
        thElement.setAttribute('scope', 'row');
        thElement.innerText = (index + 1).toString();
        trElement.appendChild(thElement);
        const tdElementType = document.createElement('td');
        tdElementType.className = operation.type === 'income' ? 'text-success' : 'text-danger';
        tdElementType.innerText = operation.type === 'income' ? 'доход' : 'расход';
        trElement.appendChild(tdElementType);
        const tdElementCategory = document.createElement('td');
        if (operation.category) {
            tdElementCategory.innerText = operation.category.toLowerCase();
        }
        trElement.appendChild(tdElementCategory);
        const tdElementAmount = document.createElement('td');
        tdElementAmount.innerText = `${operation.amount}$`;
        trElement.appendChild(tdElementAmount);
        const tdElementDate = document.createElement('td');
        tdElementDate.innerText = operation.date.split('-').reverse().join('.');
        trElement.appendChild(tdElementDate);
        const tdElementComment = document.createElement('td');
        tdElementComment.innerText = operation.comment;
        trElement.appendChild(tdElementComment);
        const tdActionsElement = document.createElement('td');
        const wrapActionsElement = document.createElement('div');
        wrapActionsElement.className = 'd-flex align-items-center';
        const buttonDeleteElement = document.createElement('button');
        buttonDeleteElement.className = 'btn  btn_icon me-2';
        buttonDeleteElement.setAttribute('type', 'button');
        buttonDeleteElement.setAttribute('data-bs-toggle', 'modal');
        buttonDeleteElement.setAttribute('data-bs-target', '#staticBackdrop');
        buttonDeleteElement.setAttribute('id', `delete-${operation.id}`);
        const imageDeleteElement = document.createElement('img');
        imageDeleteElement.setAttribute('src', 'images/delete.svg');
        imageDeleteElement.setAttribute('alt', 'корзина');
        buttonDeleteElement.appendChild(imageDeleteElement);
        wrapActionsElement.appendChild(buttonDeleteElement);
        const buttonEditElement = document.createElement('button');
        buttonEditElement.className = 'btn btn_icon';
        buttonEditElement.setAttribute('type', 'button');
        buttonEditElement.setAttribute('id', `edit-${operation.id}`);
        const imageEditElement = document.createElement('img');
        imageEditElement.setAttribute('src', 'images/edit.svg');
        imageEditElement.setAttribute('alt', 'карандаш');
        buttonEditElement.appendChild(imageEditElement);
        wrapActionsElement.appendChild(buttonEditElement);
        tdActionsElement.appendChild(wrapActionsElement);
        trElement.appendChild(tdActionsElement);
        buttonDeleteElement.addEventListener('click', function () {
            new createModal_1.CreateModal(page_type_1.PageType.incomeAndExpenses, operation.id, that.updateTable.bind(that));
        });
        buttonEditElement.addEventListener('click', function () {
            location.href = '#/edit-income-and-expenses?id=' + operation.id;
        });
        if (this.tableElement)
            this.tableElement.appendChild(trElement);
    }
}
exports.IncomeAndExpenses = IncomeAndExpenses;
//# sourceMappingURL=income-and-expenses.js.map