import {CreateModal} from "../utils/createModal.js";

export class IncomeAndExpenses {
    constructor() {
        this.createButtonElements = null;
        this.init()
    }

    init() {
        new CreateModal('income-and-expenses');
        this.createButtonElements = document.getElementsByName('create-button')
        this.createButtonElements.forEach(button => {
            button.addEventListener('click', () => window.location = '#/create-income-and-expenses')
        })
    }
}