export class EditIncomeAndExpenses {
    constructor() {
        this.cancelButtonElement = null;
        this.editButtonElement = null;
        this.init()
    }

    init() {
        this.cancelButtonElement = document.getElementsByClassName('btn-danger')[0];
        this.cancelButtonElement.addEventListener('click', () => {
            window.location = '#/income-and-expenses'
        })
    }
}