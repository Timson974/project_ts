const incomeCtx = document.getElementById('incomeChart').getContext('2d');
const expensesCtx = document.getElementById('expensesChart').getContext('2d');

const incomeChart = new Chart(incomeCtx, {
    type: 'pie',
    data: {
        labels: ['Категория 1', 'Категория 2', 'Категория 3'], // Примерные данные
        datasets: [{
            data: [10, 20, 30], // Примерные данные
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        }]
    },
    options: {
        responsive: true
    }
});

const expensesChart = new Chart(expensesCtx, {
    // Аналогичная структура для расходов
});
