document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const fullName = this.fullName.value;
    const email = this.email.value;
    const password = this.password.value;
    const confirmPassword = this.confirmPassword.value; // Используйте правильный id
    // Валидация полей
    if (password !== confirmPassword) {
        alert('Пароли не совпадают!');
        return;
    }
    // Отправка данных на сервер
    // ...
});

// Псевдокод для обработчиков событий
document.addEventListener('DOMContentLoaded', () => {
});

