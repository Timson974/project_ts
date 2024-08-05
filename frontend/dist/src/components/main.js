"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main = void 0;
const auto_1 = require("chart.js/auto");
const filter_1 = require("./filter");
class Main {
    constructor() {
        this.wrapChartsElement = null;
        this.messageEmptyData = null;
        this.incomeData = null;
        this.expenseData = null;
        // this.data = null;
        this.wrapCanvasIncomeElement = null;
        this.wrapCanvasExpenseElement = null;
        this.init();
    }
    init() {
        this.messageEmptyData = document.getElementById('messageEmptyData');
        this.wrapChartsElement = document.getElementById('wrap-charts');
        this.wrapCanvasIncomeElement = document.getElementById('wrap-chart-income');
        this.wrapCanvasExpenseElement = document.getElementById('wrap-chart-expense');
        new filter_1.Filter(this.drawCharts.bind(this), null);
    }
    filterData(data, type) {
        return data.filter(obj => obj.type === type).reduce((acc, obj) => {
            if (acc.findIndex((el) => el.category === obj.category) !== -1) {
                acc.find((item) => item.category === obj.category).amount += obj.amount;
            }
            else {
                acc.push({
                    category: obj.category,
                    amount: obj.amount
                });
            }
            return acc;
        }, new Array);
    }
    drawCharts(data) {
        if (data && data.length > 0) {
            this.incomeData = this.filterData(data, 'income');
            this.expenseData = this.filterData(data, 'expense');
            this.wrapCanvasIncomeElement && this.wrapCanvasIncomeElement.classList.remove('visually-hidden');
            this.wrapCanvasExpenseElement && this.wrapCanvasExpenseElement.classList.remove('visually-hidden');
            this.closeMessageEmptyData();
            this.drawChart('chart-income');
            this.drawChart('chart-expense');
        }
        else {
            this.wrapCanvasIncomeElement && this.wrapCanvasIncomeElement.classList.add('visually-hidden');
            this.wrapCanvasExpenseElement && this.wrapCanvasExpenseElement.classList.add('visually-hidden');
            this.showMessageEmptyData();
        }
    }
    drawChart(idElement) {
        const wrapChartElement = idElement === 'chart-income' ? document.getElementById('block-chart-income') : document.getElementById('block-chart-expense');
        const canvasElement = document.createElement('canvas');
        canvasElement.setAttribute('id', idElement === 'chart-income' ? "chart-income" : "chart-expense");
        if (wrapChartElement && canvasElement && wrapChartElement.firstChild) {
            wrapChartElement.replaceChild(canvasElement, wrapChartElement.firstChild);
        }
        let data;
        if (this.incomeData && this.expenseData) {
            data = {
                labels: idElement === 'chart-income' ? this.incomeData.map(obj => obj.category) : this.expenseData.map(obj => obj.category),
                datasets: [{
                        data: idElement === 'chart-income' ? this.incomeData.map(obj => obj.amount) : this.expenseData.map(obj => obj.amount)
                    }]
            };
        }
        else {
            data = {};
        }
        const chartElement = document.getElementById(idElement);
        const optionIncomeChart = {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        };
        new auto_1.Chart(chartElement, optionIncomeChart);
    }
    showMessageEmptyData() {
        if (this.messageEmptyData) {
            this.messageEmptyData.remove();
        }
        this.messageEmptyData = document.createElement('div');
        this.messageEmptyData.className = 'fs-5 text-danger position-absolute bg-white p-2 ';
        this.messageEmptyData.setAttribute('id', 'messageEmptyData');
        this.messageEmptyData.innerText = 'На выбранный период нет данных';
        this.wrapChartsElement && this.wrapChartsElement.insertBefore(this.messageEmptyData, this.wrapChartsElement.firstChild);
    }
    closeMessageEmptyData() {
        if (this.messageEmptyData) {
            this.messageEmptyData.remove();
        }
    }
}
exports.Main = Main;
//# sourceMappingURL=main.js.map