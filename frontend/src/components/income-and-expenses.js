import {CreateModal} from "./createModal.js";
import {Filter} from "./filter";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {UpdateBalance} from "../utils/updateBalance.js";

export class IncomeAndExpenses {
    constructor() {
        this.tableElement = null;
        this.createButtonElements = null;
        this.idDeletingOperation = null;
        this.data = null;
        this.periodString = null;
        this.init()
    }

    init() {
        this.periodString = sessionStorage.getItem('queryPeriodString');
        this.tableElement = document.getElementById('table');

        this.createButtonElements = document.getElementsByName('create-button')
        this.createButtonElements.forEach(button => {
            button.addEventListener('click', () => location.href = '#/create-income-and-expenses')
        })
        if (this.periodString) {
            new Filter(this.drawRows.bind(this), this.periodString);
        } else {
            new Filter(this.drawRows.bind(this));
        }
        new CreateModal('income-and-expenses', this.idDeletingOperation, this.updateTable.bind(this));
    }

    async updateTable() {
        try {
            const results = await CustomHttp.request(config.host + '/operations?' + this.periodString);
            if (results) {
                if (results.error) {
                    throw new Error(results.error);
                }
                this.drawRows(results)
                const balance = await UpdateBalance.getBalance();
                if (balance) {
                    document.getElementById('balance').innerText = `${balance}$`;
                }
            } else {
                throw new Error('На данный период данных нет');
            }
        } catch (e) {
            console.log(e)
        }
    }
    drawRows(data) {
        this.tableElement.replaceChildren();
        if (data && data.length > 0) {
            data.forEach((operation, index) => {
                this.createTrElement(operation, index)
            })
        }
    }

    createTrElement(operation, index) {
        const that = this;
        const trElement = document.createElement('tr');
        const thElement = document.createElement('th');
        thElement.setAttribute('scope','row');
        thElement.innerText = index + 1;
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
        tdElementAmount.innerText = `${operation.amount}$`
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
            new CreateModal('income-and-expenses', operation.id, that.updateTable.bind(that));
        })

        buttonEditElement.addEventListener('click', function () {
            location.href = '#/edit-income-and-expenses?id=' + operation.id;
        });

        this.tableElement.appendChild(trElement);
    }
}