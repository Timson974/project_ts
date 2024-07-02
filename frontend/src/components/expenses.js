import {CreateModal} from "../utils/createModal.js";

export class Expenses {
    constructor() {
        this.editButtonElements = null;
        this.init();
    }

    init() {
        new CreateModal('expenses');
        this.editButtonElements = document.getElementsByClassName('btn-primary');
        [].forEach.call(this.editButtonElements, function (button) {
            button.addEventListener('click', () => {
                window.location = '#/edit-expenses';
            })
        });

    }
}