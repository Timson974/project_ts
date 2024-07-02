export class EditExpenses {
    constructor() {
        this.canselButtonElement = null;
        this.editButtonElement = null;
        this.init();
    }

    init() {

        this.canselButtonElement = document.getElementsByClassName('btn-danger')[0];
        this.editButtonElement = document.getElementsByClassName('btn-success')[0];
        this.canselButtonElement.addEventListener('click', () => {
            window.location = '#/expenses'
        });
    }
}