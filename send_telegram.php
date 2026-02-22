<?php
// send_telegram.php
$botToken = '8569305455:AAGYHve7l3tetUsOcOakn-O4CijldLoQBKg'; // Твой токен
$chatId = '-1003740262089'; // Твой chat_id

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $message = "
📬 Новая заявка с сайта!

👤 Имя: {$data['name']}
📧 Email: {$data['email']}
📝 Тема: {$data['subject']}
💬 Сообщение: {$data['message']}
    ";
    
    $url = "https://api.telegram.org/bot{$botToken}/sendMessage";
    $postData = [
        'chat_id' => $chatId,
        'text' => $message,
        'parse_mode' => 'HTML'
    ];
    
    $options = [
        'http' => [
            'header'  => "Content-type: application/json\r\n",
            'method'  => 'POST',
            'content' => json_encode($postData)
        ]
    ];
    
    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    
    header('Content-Type: application/json');
    echo json_encode(['success' => true]);
}
?>