function updateAction(event) {
    event.preventDefault(); // Предотвращаем отправку формы

    const publicKey = document.getElementById('public_key').value.trim();
    let path = document.getElementById('path').value.trim();

    // Если path не указан, устанавливаем значение по умолчанию
    if (!path) {
        path = '/'; // Или любой другой дефолтный путь
    }

    // Кодируем в base64
    const encodedPublicKey = btoa(encodeURIComponent(publicKey));
    const encodedPath = btoa(encodeURIComponent(path));

    // Формируем новый URL с параметрами в пути
    const actionUrlTemplate = staticUrl
    const actionUrl = actionUrlTemplate.replace('public_key_placeholder', encodeURIComponent(encodedPublicKey)).replace('path_placeholder', encodeURIComponent(encodedPath));
    // Перенаправляем на сформированный URL
    window.location.href = actionUrl;
}