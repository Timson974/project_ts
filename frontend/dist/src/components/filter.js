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
exports.Filter = void 0;
const custom_http_1 = require("../services/custom-http");
const config_1 = __importDefault(require("../../config/config"));
class Filter {
    constructor(callback, queryPeriodString) {
        this.filterTemplate = '../templates/filter.html';
        this.today = new Date().toISOString().slice(0, 10);
        this.filterContentElement = null;
        //this.data = null;
        this.dataFromInputElement = null;
        this.dataToInputElement = null;
        this.filterButtonElements = null;
        this.btnIntervalElement = null;
        this.activeFilterButton = null;
        this.callback = callback;
        this.queryPeriodString = queryPeriodString;
        this.queryString = null;
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            sessionStorage.removeItem('queryPeriodString');
            if (this.queryPeriodString) {
                if (this.queryPeriodString === `period=interval&dateFrom=${this.today}&dateTo=${this.today}`) {
                    this.activeFilterButton = 'today';
                }
                else {
                    this.activeFilterButton = this.queryPeriodString.split('=')[1].split('&')[0];
                }
            }
            else {
                this.activeFilterButton = 'today';
            }
            this.filterContentElement = document.getElementById('filter-content');
            if (this.filterContentElement) {
                this.filterContentElement.innerHTML = yield fetch(this.filterTemplate).then(response => response.text());
            }
            this.dataFromInputElement = document.getElementById('dateFrom');
            this.dataToInputElement = document.getElementById('dateTo');
            this.filterButtonElements = document.getElementsByClassName('btn-outline-secondary');
            this.btnIntervalElement = document.getElementById('interval');
            //this.btnTodayElement = document.getElementById('today');
            const that = this;
            if (this.queryPeriodString && this.activeFilterButton === 'interval') {
                const dateFrom = this.queryPeriodString.match(/(dateFrom=([\d-]+))/)[2];
                const dateTo = this.queryPeriodString.match(/(dateTo=([\d-]+))/)[2];
                this.dataFromInputElement.value = dateFrom.split('-').reverse().join('.');
                this.dataToInputElement.value = dateTo.split('-').reverse().join('.');
            }
            this.dataFromInputElement.addEventListener('change', () => {
                that.changeInputsData();
            });
            this.dataToInputElement.addEventListener('change', () => {
                that.changeInputsData();
            });
            [].forEach.call(that.filterButtonElements, function (button) {
                if (button.id === that.activeFilterButton) {
                    button.classList.add('active_button_period');
                }
                else {
                    button.classList.remove('active_button_period');
                }
                button.addEventListener('click', function () {
                    that.activeFilterButton = button.id;
                    that.getData(`period=${button.id}`);
                    [].forEach.call(that.filterButtonElements, function (button) {
                        if (button.id === that.activeFilterButton) {
                            button.classList.add('active_button_period');
                        }
                        else {
                            button.classList.remove('active_button_period');
                        }
                    });
                });
            });
            if (this.queryPeriodString) {
                yield this.getData(this.queryPeriodString);
            }
            else {
                yield this.getData('period=today');
            }
        });
    }
    getData(periodString_1) {
        return __awaiter(this, arguments, void 0, function* (periodString, callback = this.callback) {
            if (periodString === 'period=interval') {
                if (this.dataFromInputElement && this.dataToInputElement) {
                    if (this.dataFromInputElement.value && this.dataToInputElement.value) {
                        this.queryString = `/operations?period=interval&dateFrom=${this.dataFromInputElement.value}&dateTo=${this.dataToInputElement.value}`;
                    }
                    else {
                        this.queryString = '/operations?period=all';
                    }
                }
            }
            else if (periodString === 'period=today') {
                this.queryString = `/operations?period=interval&dateFrom=${this.today}&dateTo=${this.today}`;
            }
            else {
                this.queryString = '/operations?' + periodString;
            }
            sessionStorage.setItem('queryPeriodString', this.queryString.split('?')[1]);
            try {
                const results = yield custom_http_1.CustomHttp.request(config_1.default.host + this.queryString);
                if (results) {
                    if (callback) {
                        callback(results);
                    }
                }
                else {
                    throw new Error('На данный период данных нет');
                }
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    changeInputsData() {
        if (this.dataFromInputElement && this.dataToInputElement && this.btnIntervalElement) {
            if (this.dataFromInputElement.value && this.dataToInputElement.value) {
                this.btnIntervalElement.removeAttribute('disabled');
            }
            else {
                this.btnIntervalElement.setAttribute('disabled', 'disabled');
            }
        }
    }
}
exports.Filter = Filter;
//# sourceMappingURL=filter.js.map