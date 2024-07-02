import {CreateModal} from "../utils/createModal.js";

export class Income {
    constructor() {
        this.editButtonElements = null;
        this.init();
    }

    init() {
        new CreateModal('income');
        this.editButtonElements = document.getElementsByClassName('btn-primary');
        [].forEach.call(this.editButtonElements, function (button) {
            button.addEventListener('click', ()=> {
                window.location = '#/edit-income';
            })
        });

    }
}