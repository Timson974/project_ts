import Chart from 'chart.ts/auto';
import { Filter } from "./filter.ts";

export class Main {
    constructor() {
        this.chartArea = null;
        this.noDataMessage = null;
        this.incomeDataset = null;
        this.expenseDataset = null;
        this.chartWrapperIncome = null;
        this.chartWrapperExpense = null;
        this.setup();
    }

    setup() {
        this.noDataMessage = document.getElementById('messageEmptyData');
        this.chartArea = document.getElementById('wrap-charts');
        this.chartWrapperIncome = document.getElementById('wrap-chart-income');
        this.chartWrapperExpense = document.getElementById('wrap-chart-expense');
        new Filter(this.updateCharts.bind(this));
    }

    categorizeData(data, categoryType) {
        return data.filter(item => item.type === categoryType).reduce((accumulator, current) => {
            let categoryIndex = accumulator.findIndex(item => item.category === current.category);
            if (categoryIndex !== -1) {
                accumulator[categoryIndex].amount += current.amount;
            } else {
                accumulator.push({
                    category: current.category,
                    amount: current.amount
                });
            }
            return accumulator;
        }, []);
    }

    updateCharts(data) {
        if (data && data.length > 0) {
            this.incomeDataset = this.categorizeData(data, 'income');
            this.expenseDataset = this.categorizeData(data, 'expense');
            this.chartWrapperIncome.classList.remove('visually-hidden');
            this.chartWrapperExpense.classList.remove('visually-hidden');
            this.hideNoDataMessage();
            this.plotChart('chart-income', this.incomeDataset);
            this.plotChart('chart-expense', this.expenseDataset);
        } else {
            this.chartWrapperIncome.classList.add('visually-hidden');
            this.chartWrapperExpense.classList.add('visually-hidden');
            this.displayNoDataMessage();
        }
    }

    plotChart(chartId, dataset) {
        const chartContainer = document.getElementById(chartId === 'chart-income' ? 'block-chart-income' : 'block-chart-expense');
        const canvas = document.createElement('canvas');
        canvas.id = chartId;
        chartContainer.replaceChild(canvas, chartContainer.firstChild);

        const chartData = {
            labels: dataset.map(item => item.category),
            datasets: [{
                data: dataset.map(item => item.amount)
            }]
        };

        new Chart(canvas, {
            type: 'pie',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            },
        });
    }

    displayNoDataMessage() {
        if (this.noDataMessage) {
            this.noDataMessage.remove();
        }
        this.noDataMessage = document.createElement('div');
        this.noDataMessage.className = 'fs-5 text-danger position-absolute bg-white p-2';
        this.noDataMessage.id = 'messageEmptyData';
        this.noDataMessage.innerText = 'На выбранный период нет данных';
        this.chartArea.insertBefore(this.noDataMessage, this.chartArea.firstChild);
    }

    hideNoDataMessage() {
        if (this.noDataMessage) {
            this.noDataMessage.remove();
        }
    }
}
