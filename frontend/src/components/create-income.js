export class CreateIncome {
    constructor() {
        this.canselButtonElement = null;
        this.createButtonElement = null;
        this.init();
    }

    init() {
        this.canselButtonElement = document.getElementsByClassName('btn-danger')[0];
        this.createButtonElement = document.getElementsByClassName('btn-success')[0];

        this.canselButtonElement.addEventListener('click', () => {
            window.location = '#/income';
        });
    }
}