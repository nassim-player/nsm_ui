<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection
require_once 'config.php';

try {
    $conn->set_charset("utf8mb4");

    // Query parent data with student count - fetch all useful fields
    $query = "
        SELECT 
            p.*,
            (SELECT COUNT(*) FROM reg_student WHERE parent_id = p.id) as student_count
        FROM reg_parent p
        ORDER BY p.id DESC
    ";

    $stmt = $conn->prepare($query);

    if (!$stmt) {
        throw new Exception("Failed to prepare statement: " . $conn->error);
    }

    if (!$stmt->execute()) {
        throw new Exception("Query execution failed: " . $stmt->error);
    }

    $result = $stmt->get_result();

    if (!$result) {
        throw new Exception("Failed to get result: " . $conn->error);
    }

    $requests = [];

    while ($row = $result->fetch_assoc()) {
        // Determine parent name and phone based on primary_role
        $parentName = '';
        $phone = '';

        switch ($row['primary_role']) {
            case 'father':
                $parentName = trim(($row['father_first_name_ar'] ?? '') . ' ' . ($row['father_last_name_ar'] ?? ''));
                $phone = $row['father_phone'] ?? '';
                break;
            case 'mother':
                $parentName = trim(($row['mother_first_name_ar'] ?? '') . ' ' . ($row['mother_last_name_ar'] ?? ''));
                $phone = $row['mother_phone'] ?? '';
                break;
            case 'guardian':
                $parentName = trim(($row['guardian_first_name_ar'] ?? '') . ' ' . ($row['guardian_last_name_ar'] ?? ''));
                $phone = $row['guardian_phone'] ?? '';
                break;
        }

        // Map primary_role to Arabic label
        $roleLabel = '';
        switch ($row['primary_role']) {
            case 'father':
                $roleLabel = 'أب';
                break;
            case 'mother':
                $roleLabel = 'أم';
                break;
            case 'guardian':
                $roleLabel = 'ولي';
                break;
            default:
                $roleLabel = '-';
                break;
        }

        // Build father full name
        $fatherName = trim(($row['father_first_name_ar'] ?? '') . ' ' . ($row['father_last_name_ar'] ?? ''));
        $motherName = trim(($row['mother_first_name_ar'] ?? '') . ' ' . ($row['mother_last_name_ar'] ?? ''));
        $guardianName = trim(($row['guardian_first_name_ar'] ?? '') . ' ' . ($row['guardian_last_name_ar'] ?? ''));

        $requests[] = [
            'id' => $row['application_number'],
            'parentId' => (int) $row['id'],
            'parentName' => $parentName ?: 'غير محدد',
            'role' => $roleLabel,
            'phone' => $phone ?: '-',
            'address' => $row['address'] ?? '-',
            'studentCount' => (int) $row['student_count'],
            'submissionDate' => $row['created_at'] ?? date('Y-m-d'),
            'status' => $row['status'] ?? 'pending',
            // Father details
            'fatherName' => $fatherName ?: '-',
            'fatherPhone' => $row['father_phone'] ?? '-',
            'fatherEmail' => $row['father_email'] ?? '-',
            'fatherJob' => $row['father_job'] ?? '-',
            'fatherStatus' => $row['father_status'] ?? '-',
            // Mother details
            'motherName' => $motherName ?: '-',
            'motherPhone' => $row['mother_phone'] ?? '-',
            'motherEmail' => $row['mother_email'] ?? '-',
            'motherJob' => $row['mother_job'] ?? '-',
            'motherStatus' => $row['mother_status'] ?? '-',
            // Guardian details
            'guardianName' => $guardianName ?: '-',
            'guardianPhone' => $row['guardian_phone'] ?? '-',
            'guardianEmail' => $row['guardian_email'] ?? '-',
            'guardianJob' => $row['guardian_job'] ?? '-',
            'guardianRelation' => $row['guardian_relation'] ?? '-',
            // Family info
            'familyMembers' => $row['family_members'] ?? '-',
            'familyStatus' => $row['family_status'] ?? '-',
            // Survey
            'discoverySource' => $row['discovery_source'] ?? '-',
            'reasonForChoice' => $row['reason_for_choice'] ?? '-',
            'additionalRequests' => $row['additional_requests'] ?? '-',
            // Meta
            'rejectionReason' => $row['rejection_reason'] ?? '-',
        ];
    }

    echo json_encode([
        'success' => true,
        'data' => $requests,
        'count' => count($requests)
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
