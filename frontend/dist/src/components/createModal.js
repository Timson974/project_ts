"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateModal = void 0;
const custom_http_1 = require("../services/custom-http");
const config_1 = __importDefault(require("../../config/config"));
const page_type_1 = require("../types/page.type");
class CreateModal {
    constructor(page, idDeleting, callback) {
        this.page = page;
        this.modalElement = null;
        this.idDeleting = idDeleting;
        this.callback = callback;
        this.init();
    }
    init() {
        this.modalElement = document.getElementById('staticBackdrop');
        if (this.modalElement)
            this.modalElement.replaceChildren();
        this.addModal(this.page);
    }
    addModal(page) {
        const that = this;
        if (page === page_type_1.PageType.income || page === page_type_1.PageType.expense || page === page_type_1.PageType.incomeAndExpenses) {
            const modalDialogElement = document.createElement('div');
            modalDialogElement.className = "modal-dialog modal-dialog-centered";
            const modalContentElement = document.createElement('div');
            modalContentElement.className = "modal-content p-2";
            const modalBodyElement = document.createElement('div');
            modalBodyElement.className = "modal-body align-content-center";
            const modalTitleElement = document.createElement('div');
            modalTitleElement.className = "fs-4 text-center mb-4";
            if (page === page_type_1.PageType.income) {
                modalTitleElement.innerText = 'Вы действительно хотите удалить категорию? Связанные доходы будут удалены навсегда.';
            }
            else if (page === page_type_1.PageType.expense) {
                modalTitleElement.innerText = 'Вы действительно хотите удалить категорию?';
            }
            else {
                modalTitleElement.innerText = 'Вы действительно хотите удалить операцию?';
            }
            const wrapButtonElement = document.createElement('div');
            wrapButtonElement.className = "d-flex align-items-center justify-content-around";
            const successButtonElement = document.createElement('button');
            successButtonElement.className = "btn btn-success";
            successButtonElement.setAttribute('type', 'button');
            successButtonElement.setAttribute('data-bs-dismiss', 'modal');
            successButtonElement.innerText = 'Да, удалить';
            successButtonElement.addEventListener('click', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    let queryString;
                    if (page === page_type_1.PageType.income) {
                        queryString = config_1.default.host + '/categories/income/';
                    }
                    else if (page === page_type_1.PageType.expense) {
                        queryString = config_1.default.host + '/categories/expense/';
                    }
                    else {
                        queryString = config_1.default.host + '/operations/';
                    }
                    try {
                        const results = yield custom_http_1.CustomHttp.request(queryString + that.idDeleting, 'DELETE');
                        if (results) {
                            if (results.error) {
                                throw new Error(results.message);
                            }
                            that.callback();
                        }
                        else {
                            throw new Error('Элемент не удален');
                        }
                    }
                    catch (e) {
                        console.log(e);
                    }
                });
            });
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
            if (this.modalElement)
                this.modalElement.appendChild(modalDialogElement);
        }
        else {
            return;
        }
    }
}
exports.CreateModal = CreateModal;
//# sourceMappingURL=createModal.js.map