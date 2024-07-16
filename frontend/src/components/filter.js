import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";

export class Filter {
    _filterTemplate = '../templates/filter.html';

    constructor(callback, queryPeriodString) {
        this.today = new Date().toISOString().slice(0, 10);
        this.filterContentElement = null;
        this.data = null;
        this.dataFromInputElement = null;
        this.dataToInputElement = null;
        this.filterButtonElements = null;
        this.btnIntervalElement = null;
        this.activeFilterButton = null;
        this.callback = callback;
        this.queryPeriodString = queryPeriodString;
        this.init();
    }

    async init() {
        sessionStorage.removeItem('queryPeriodString');
        if (this.queryPeriodString) {
            if (this.queryPeriodString === `period=interval&dateFrom=${this.today}&dateTo=${this.today}`) {
                this.activeFilterButton = 'today'
            } else {
                this.activeFilterButton = this.queryPeriodString.split('=')[1].split('&')[0];
            }
        } else {
            this.activeFilterButton = 'today'
        }
        this.filterContentElement = document.getElementById('filter-content');
        this.filterContentElement.innerHTML = await fetch(this._filterTemplate).then(response => response.text());
        this.dataFromInputElement = document.getElementById('dateFrom');
        this.dataToInputElement = document.getElementById('dateTo');
        this.filterButtonElements = document.getElementsByClassName('btn-outline-secondary');
        this.btnIntervalElement = document.getElementById('interval');
        this.btnTodayElement = document.getElementById('today');

        const that = this;
        if (this.queryPeriodString && this.activeFilterButton === 'interval') {
            const dateFrom = this.queryPeriodString.match(/(dateFrom=([\d-]+))/)[2]
            const dateTo = this.queryPeriodString.match(/(dateTo=([\d-]+))/)[2]
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
            } else {
                button.classList.remove('active_button_period');
            }
            button.addEventListener('click', function () {
                that.activeFilterButton = button.id;
                that.getData(`period=${button.id}`);
                [].forEach.call(that.filterButtonElements, function (button) {
                    if (button.id === that.activeFilterButton) {
                        button.classList.add('active_button_period');
                    } else {
                        button.classList.remove('active_button_period');
                    }
                })
            })
        })
        if (this.queryPeriodString) {
            await this.getData(this.queryPeriodString);
        } else {
            await this.getData('period=today');
        }
    }

    async getData(periodString, callback = this.callback) {
        let queryString;
        if (periodString === 'period=interval') {
            if (this.dataFromInputElement.value && this.dataToInputElement.value) {
                queryString = `/operations?period=interval&dateFrom=${this.dataFromInputElement.value}&dateTo=${this.dataToInputElement.value}`;
            } else {
                queryString = '/operations?period=all';
            }
        } else if (periodString === 'period=today') {
            queryString = `/operations?period=interval&dateFrom=${this.today}&dateTo=${this.today}`;
        } else {
            queryString = '/operations?' + periodString;
        }
        sessionStorage.setItem('queryPeriodString', queryString.split('?')[1]);
        try {
            const results = await CustomHttp.request(config.host + queryString);
            if (results) {
                if (results.error) {
                    throw new Error(results.error);
                }
                if (callback) {
                    callback(results);
                }

            } else {
                throw new Error('На данный период данных нет');
            }
        } catch (e) {
            console.log(e)
        }
    }

    changeInputsData() {
        if (this.dataFromInputElement.value && this.dataToInputElement.value) {
            this.btnIntervalElement.removeAttribute('disabled')
        } else {
            this.btnIntervalElement.setAttribute('disabled', 'disabled')
        }
    }
}