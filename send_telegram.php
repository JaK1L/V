<?php
// send_telegram.php
$botToken = '8569305455:AAGYHve7l3tetUsOcOakn-O4CijldLoQBKg'; // Твой токен
$chatId = '-1003740262089'; // Твой chat_id

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Получаем данные из запроса
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data']);
        exit;
    }
    
    // Формируем сообщение
    $message = "📬 Новая заявка с сайта!\n\n" .
               "👤 Имя: {$data['name']}\n" .
               "📧 Email: {$data['email']}\n" .
               "📱 Telegram: @{$data['telegram']}\n" .
               "📝 Тема: {$data['subject']}\n" .
               "💬 Сообщение: {$data['message']}\n" .
               "⚡️ Предпочитает: " . ($data['prefer_telegram'] ? 'Telegram' : 'Email');
    
    // Отправляем в Telegram
    $url = "https://api.telegram.org/bot{$botToken}/sendMessage";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'chat_id' => $chatId,
        'text' => $message,
        'parse_mode' => 'HTML'
    ]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Telegram API error']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
