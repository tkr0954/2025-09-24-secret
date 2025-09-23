// Ключ 2: 0JrQu9GO0YcgMjogNUxzekFtdnQ=

function decodeMessage() {
    const key1 = document.getElementById('key1').value.trim();
    const key2 = document.getElementById('key2').value.trim();

    if (!key1 || !key2) {
        alert('Введите оба ключа!');
        return;
    }

    const url = `https://${key1}${key2}`;
    console.log('Собранный URL:', url);

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Ошибка сети');
            return response.text();
        })
        .then(base64Data => {
            const decodedMessage = atob(base64Data);

            document.getElementById('output').innerHTML =
                '<p style="color: green;">✅ Сообщение успешно расшифровано! Проверьте консоль браузера.</p>';

            console.log('🔐 Расшифрованное сообщение:');
            console.log(decodedMessage);

            console.log('DECODED_MESSAGE:', decodedMessage);
        })
        .catch(error => {
            document.getElementById('output').innerHTML =
                `<p style="color: red;">❌ Ошибка: ${error.message}</p>`;
            console.error('Ошибка:', error.message);
        });
}