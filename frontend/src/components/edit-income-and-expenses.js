export class EditIncomeAndExpenses {
    constructor() {
        this.canselButtonElement = null;
        this.editButtonElement = null;
        this.init()
    }

    init() {
        this.canselButtonElement = document.getElementsByClassName('btn-danger')[0];
        this.canselButtonElement.addEventListener('click', () => {
            window.location = '#/income-and-expenses'
        })
    }
}