<?php
/**
 * Students API
 * Fetches student data from the database
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php';

/**
 * Translate class_section code to Arabic
 * Format: (stage_number)(stage_code)(class_number) e.g. "1pr1", "3p2", "2m1"
 * Translations: pr = التحضيري, p = الإبتدائي, m = المتوسط
 */
function translateGrade($classSection)
{
    if (empty($classSection))
        return '';

    // Stage code translations
    $translations = [
        'pr' => 'التحضيري',
        'p' => 'الإبتدائي',
        'm' => 'المتوسط'
    ];

    // Pattern: (number)(letters)(number) - e.g. 1pr1, 3p2, 2m1
    if (preg_match('/^(\d+)(pr|p|m)(\d+)$/i', $classSection, $matches)) {
        $stageNum = $matches[1];
        $stageCode = strtolower($matches[2]);
        $classNum = $matches[3];

        $stageName = $translations[$stageCode] ?? $stageCode;

        // RTL format: class_number + stage_name + stage_number
        // In Arabic reading order (right to left): stage_number stage_name class_number
        return $stageNum . ' ' . $stageName . ' ' . $classNum;
    }

    // If pattern doesn't match, return original
    return $classSection;
}

try {
    $db = getDBConnection();

    // Fetch students with required fields
    $sql = "SELECT 
                id,
                first_name,
                father_name,
                last_name,
                class_section,
                gender,
                father_phone,
                reg_id
            FROM students
            ORDER BY id DESC";

    $stmt = $db->prepare($sql);
    $stmt->execute();
    $students = $stmt->fetchAll();

    // Format the response
    $formattedStudents = array_map(function ($student) {
        // Combine names for full name
        $fullName = trim(
            ($student['first_name'] ?? '') . ' ' .
            ($student['father_name'] ?? '') . ' ' .
            ($student['last_name'] ?? '')
        );

        return [
            'id' => (int) $student['id'],
            'studentId' => $student['reg_id'] ?? 'STU' . str_pad($student['id'], 3, '0', STR_PAD_LEFT),
            'name' => $fullName,
            'grade' => translateGrade($student['class_section'] ?? ''),
            'gender' => $student['gender'] ?? '',
            'parentPhone' => $student['father_phone'] ?? ''
        ];
    }, $students);

    echo json_encode([
        'success' => true,
        'data' => $formattedStudents,
        'count' => count($formattedStudents)
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}

