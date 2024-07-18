import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class CreateModal {
    constructor(page, idDeleting, callback) {

        this.page = page;
        this.modalElement = null;
        this.idDeleting = idDeleting;
        this.callback = callback;
        this.init()
    }

    init() {
        this.modalElement = document.getElementById('staticBackdrop');
        console.log(this.modalElement); // Check if it is null
        if (this.modalElement) {
            this.modalElement.replaceChildren();
            this.addModal(this.page);
        } else {
            console.error('Modal element not found');
        }
    }


    init() {
        this.modalElement = document.getElementById('staticBackdrop');
        this.modalElement.replaceChildren();
        this.addModal(this.page)
    }
    addModal (page) {

        const that = this;
        if (page === 'income' || page === 'expense' || page === 'income-and-expenses') {

            const modalDialogElement = document.createElement('div');
            modalDialogElement.className = "modal-dialog modal-dialog-centered";

            const modalContentElement = document.createElement('div');
            modalContentElement.className = "modal-content p-2";

            const modalBodyElement = document.createElement('div');
            modalBodyElement.className = "modal-body align-content-center";

            const modalTitleElement = document.createElement('div');
            modalTitleElement.className = "fs-4 text-center mb-4";
            if (page === 'income') {
                modalTitleElement.innerText = 'Вы действительно хотите удалить категорию? Связанные доходы будут удалены навсегда.';
            } else if (page === 'expense') {
                modalTitleElement.innerText = 'Вы действительно хотите удалить категорию?';
            } else {
                modalTitleElement.innerText = 'Вы действительно хотите удалить операцию?';
            }

            const wrapButtonElement = document.createElement('div');
            wrapButtonElement.className = "d-flex align-items-center justify-content-around";

            const successButtonElement = document.createElement('button');
            successButtonElement.className = "btn btn-success";
            successButtonElement.setAttribute('type', 'button');
            successButtonElement.setAttribute('data-bs-dismiss', 'modal');
            successButtonElement.innerText = 'Да, удалить';
            successButtonElement.addEventListener('click', async function () {
                let queryString;
                if (page === 'income') {
                    queryString = config.host + '/categories/income/';
                } else if (page === 'expense') {
                    queryString = config.host + '/categories/expense/';
                } else {
                    queryString = config.host + '/operations/';
                }
                try {
                    const results = await CustomHttp.request(queryString + that.idDeleting, 'DELETE');
                    if (results) {
                        if (results.error) {
                            throw new Error(results.error);
                        }
                        that.callback()
                    } else {
                        throw new Error('Элемент не удален');
                    }
                } catch (error) {
                    console.log(error)
                }
            })

            const cancelButtonElement = document.createElement('button');
            cancelButtonElement.className = "btn btn-danger";
            cancelButtonElement.setAttribute('type', 'button');
            cancelButtonElement.setAttribute('data-bs-dismiss', 'modal');
            cancelButtonElement.innerText = 'Не удалять';

            wrapButtonElement.appendChild(successButtonElement);
            wrapButtonElement.appendChild(cancelButtonElement);

            modalBodyElement.appendChild(modalTitleElement);
            modalBodyElement.appendChild(wrapButtonElement);

            modalContentElement.appendChild(modalBodyElement);

            modalDialogElement.appendChild(modalContentElement);

            this.modalElement.appendChild(modalDialogElement);

        } else {
            return null
        }
    }
}