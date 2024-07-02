export class CreateModal {
    constructor(page) {
        this.page = page;
        this.bodyElement = null;

        this.init()

    }

    init() {
        this.bodyElement = document.getElementsByTagName('body')[0];
        const oldModalElement = document.getElementById('staticBackdrop');
        if (oldModalElement) {
            this.bodyElement.removeChild(oldModalElement)
        }
        this.addModal(this.page)
    }
    addModal (page) {
        if (page === 'income' || page === 'expenses' || page === 'income-and-expenses') {
            const modalElement =  document.createElement('div');
            modalElement.className = "modal fade";
            modalElement.setAttribute('id', 'staticBackdrop');
            modalElement.setAttribute('data-bs-backdrop', 'static');
            modalElement.setAttribute('data-bs-keyboard', 'false');
            modalElement.setAttribute('daria-labelledby', 'staticBackdropLabel');
            modalElement.setAttribute('tabindex', '-1');

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
            } else if (page === 'expenses') {
                modalTitleElement.innerText = 'Вы действительно хотите удалить категорию?';
            } else {
                modalTitleElement.innerText = 'Вы действительно хотите удалить операцию?';
            }

            const wrapButtonElement = document.createElement('div');
            wrapButtonElement.className = "d-flex align-items-center justify-content-around";

            const successButtonElement = document.createElement('button');
            successButtonElement.className = "btn btn-success";
            successButtonElement.setAttribute('type', 'button');
            successButtonElement.innerText = 'Да, удалить';

            const canselButtonElement = document.createElement('button');
            canselButtonElement.className = "btn btn-danger";
            canselButtonElement.setAttribute('type', 'button');
            canselButtonElement.setAttribute('data-bs-dismiss', 'modal');
            canselButtonElement.innerText = 'Не удалять';

            wrapButtonElement.appendChild(successButtonElement);
            wrapButtonElement.appendChild(canselButtonElement);

            modalBodyElement.appendChild(modalTitleElement);
            modalBodyElement.appendChild(wrapButtonElement);

            modalContentElement.appendChild(modalBodyElement);

            modalDialogElement.appendChild(modalContentElement);

            modalElement.appendChild(modalDialogElement);

            this.bodyElement.appendChild(modalElement)
        } else {
            return null
        }

    }

}