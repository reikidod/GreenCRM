// Авторизация
async function handleLogin(e) {
    e.preventDefault();
    const login = document.getElementById('loginLogin').value; // Изменено имя переменной
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({login, password}) // Отправляем логин вместо email
        });

        if (response.ok) {
            window.location.href = '/main';
        }
    } catch (error) {
        console.error('Ошибка авторизации:', error);
    }
}

// Выход (остается без изменений)
async function logout() {
    try {
        await fetch('/logout');
        window.location.href = '/';
    } catch (error) {
        console.error('Ошибка выхода:', error);
    }
}