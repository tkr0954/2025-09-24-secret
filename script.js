// Ключ 2: NUxzekFtdnQ=

// Подсказка: 0L7RgtC60YDQvtC5IGluZGV4Lmh0bWwg0Lgg0LLQstC10LTQuCDQtNCy0LAg0L3QsNC50LTQtdC90L3Ri9GFINC60LvRjtGH0LA=

// Функция для корректного декодирования Base64 с кириллицей
function decodeBase64(encodedStr) {
    try {
        // Декодируем Base64 в байты
        const binaryString = atob(encodedStr);

        // Конвертируем бинарную строку в байты
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // Декодируем байты в строку UTF-8
        const decoded = new TextDecoder('utf-8').decode(bytes);
        return decoded;

    } catch (error) {
        throw new Error('Ошибка декодирования Base64: неверный формат');
    }
}

// Альтернативная простая функция для латинских символов
function decodeBase64Simple(encodedStr) {
    try {
        return decodeURIComponent(escape(atob(encodedStr)));
    } catch (error) {
        // Если не сработало, пробуем простой atob
        try {
            return atob(encodedStr);
        } catch (e) {
            throw new Error('Ошибка декодирования Base64');
        }
    }
}

// Функция для первого этапа - декодирование ключей
function decodeKeys() {
    const key1Input = document.getElementById('key1').value.trim();
    const key2Input = document.getElementById('key2').value.trim();
    const resultDiv = document.getElementById('keys-result');

    resultDiv.innerHTML = '';

    if (!key1Input || !key2Input) {
        resultDiv.innerHTML = '<div class="result-error">❌ Введите оба ключа!</div>';
        return;
    }

    try {
        // Декодируем ключи (они на латинице, поэтому можно использовать atob)
        const decodedKey1 = atob(key1Input);
        const decodedKey2 = atob(key2Input);

        // Проверяем правильность ключей
        const isKey1Correct = decodedKey1 === 'pastebin.com/raw/';
        const isKey2Correct = decodedKey2 === '5LszAmvt';

        // Формируем результат
        let resultHTML = '<h4>🔍 Результат декодирования ключей:</h4>';
        resultHTML += `<p><strong>Ключ 1 декодирован:</strong> "${decodedKey1}" ${isKey1Correct ? '✅' : '❌'}</p>`;
        resultHTML += `<p><strong>Ключ 2 декодирован:</strong> "${decodedKey2}" ${isKey2Correct ? '✅' : '❌'}</p>`;

        // Собираем URL
        const assembledUrl = `https://${decodedKey1}${decodedKey2}`;
        resultHTML += `<p><strong>Собранный URL:</strong></p>`;
        resultHTML += `<p><a href="${assembledUrl}" target="_blank" class="pastebin-link">${assembledUrl}</a></p>`;
        resultHTML += `<p><small>💡 Нажми на ссылку чтобы перейти к сообщению</small></p>`;

        if (isKey1Correct && isKey2Correct) {
            resultHTML += '<div class="result-success">✅ Ключи верные! URL собран правильно.</div>';
            resultHTML += '<p>📝 Перейди по ссылке выше, скопируй ВЕСЬ текст (это Base64) и вставь в поле ниже.</p>';

            // Показываем второй этап
            document.getElementById('final-section').style.display = 'block';
        } else {
            resultHTML += '<div class="result-error">❌ Ключи неверные! Проверь, что правильно скопировал Base64 из файлов.</div>';
        }

        resultDiv.innerHTML = resultHTML;

    } catch (error) {
        resultDiv.innerHTML = `<div class="result-error">❌ ${error.message}</div>`;
        console.error('Ошибка декодирования:', error);
    }
}

// Функция для второго этапа - декодирование финального сообщения
function decodeFinalMessage() {
    const finalMessageInput = document.getElementById('finalMessage').value.trim();
    const resultDiv = document.getElementById('final-result');

    resultDiv.innerHTML = '';

    if (!finalMessageInput) {
        resultDiv.innerHTML = '<div class="result-error">❌ Введите финальное сообщение в Base64!</div>';
        return;
    }

    try {
        // Декодируем финальное сообщение с поддержкой кириллицы
        const decodedMessage = decodeBase64(finalMessageInput);

        // Формируем красивый вывод
        let resultHTML = '<h4>🎉 Финальное сообщение расшифровано:</h4>';
        resultHTML += `<div class="result-success" style="padding: 15px;">`;
        resultHTML += `<pre style="white-space: pre-wrap; margin: 0; font-family: Arial, sans-serif;">${decodedMessage}</pre>`;
        resultHTML += `</div>`;

        // Проверяем наличие флага
        if (decodedMessage.includes('CTF{')) {
            const flagMatch = decodedMessage.match(/CTF\{[^}]+\}/);
            if (flagMatch) {
                resultHTML += `<div class="result-success" style="margin-top: 10px; padding: 15px;">`;
                resultHTML += `<h4>🏁 Флаг найден:</h4>`;
                resultHTML += `<p style="font-size: 18px; font-weight: bold; color: #155724;">${flagMatch[0]}</p>`;
                resultHTML += `</div>`;
            }
        }

        resultDiv.innerHTML = resultHTML;

        // Выводим в консоль для CI
        console.log('FINAL_DECODED_MESSAGE:', decodedMessage);

    } catch (error) {
        // Пробуем альтернативный метод декодирования
        try {
            const decodedMessage = decodeBase64Simple(finalMessageInput);

            let resultHTML = '<h4>🎉 Финальное сообщение расшифровано (альтернативный метод):</h4>';
            resultHTML += `<div class="result-success" style="padding: 15px;">`;
            resultHTML += `<pre style="white-space: pre-wrap; margin: 0; font-family: Arial, sans-serif;">${decodedMessage}</pre>`;
            resultHTML += `</div>`;

            resultDiv.innerHTML = resultHTML;
            console.log('FINAL_DECODED_MESSAGE:', decodedMessage);

        } catch (secondError) {
            resultDiv.innerHTML = `<div class="result-error">❌ Ошибка декодирования: ${error.message}</div>`;
            console.error('Ошибка декодирования:', error);
        }
    }
}