function logout() {
  fetch('/logout', {
    method: 'GET',
  }).then(function(response) {
    if (response.redirected) {
      window.location.href = '/'; // Перенаправление на страницу входа
    }
  }).catch(function(error) {
    console.error('Ошибка при выходе:', error);
  });
}
