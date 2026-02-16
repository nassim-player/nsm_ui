<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once 'config.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['parentId']) || !isset($input['status'])) {
    echo json_encode(['success' => false, 'error' => 'بيانات غير مكتملة']);
    exit;
}

$parentId = intval($input['parentId']);
$status = $input['status'];
$rejectionReason = isset($input['rejectionReason']) ? $input['rejectionReason'] : null;

// Validate status
$allowedStatuses = ['pending', 'scheduled', 'in_review', 'rejected', 'approved'];
if (!in_array($status, $allowedStatuses)) {
    echo json_encode(['success' => false, 'error' => 'حالة غير صالحة']);
    exit;
}

// Start transaction
$conn->begin_transaction();

try {
    // Update reg_parent status
    $stmt = $conn->prepare("UPDATE reg_parent SET status = ?, rejection_reason = ? WHERE id = ?");
    $stmt->bind_param("ssi", $status, $rejectionReason, $parentId);

    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }

    $conn->commit();
    echo json_encode(['success' => true]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$conn->close();
?>