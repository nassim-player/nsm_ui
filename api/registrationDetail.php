<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php';

try {
    $conn->set_charset("utf8mb4");

    $parentId = isset($_GET['id']) ? intval($_GET['id']) : 0;

    if ($parentId <= 0) {
        throw new Exception("معرّف الطلب غير صالح");
    }

    // Fetch parent data
    $parentQuery = "SELECT * FROM reg_parent WHERE id = ?";
    $stmt = $conn->prepare($parentQuery);
    $stmt->bind_param("i", $parentId);
    $stmt->execute();
    $parentResult = $stmt->get_result();
    $parent = $parentResult->fetch_assoc();

    if (!$parent) {
        throw new Exception("لم يتم العثور على الطلب");
    }

    // Fetch students
    $studentQuery = "SELECT * FROM reg_student WHERE parent_id = ? ORDER BY id ASC";
    $stmt2 = $conn->prepare($studentQuery);
    $stmt2->bind_param("i", $parentId);
    $stmt2->execute();
    $studentResult = $stmt2->get_result();

    $students = [];
    while ($row = $studentResult->fetch_assoc()) {
        $students[] = [
            'id' => $row['id'],
            'firstName' => $row['first_name'] ?? '',
            'firstNameLat' => $row['first_name_lat'] ?? '',
            'lastName' => $row['last_name'] ?? '',
            'lastNameLat' => $row['last_name_lat'] ?? '',
            'birthday' => $row['birthday'] ?? '',
            'birthCity' => $row['birth_city'] ?? '',
            'birthWilaya' => $row['birth_wilaya'] ?? '',
            'gender' => $row['gender'] ?? '',
            'nationality' => $row['nationality'] ?? '',
            'currentGrade' => $row['current_grade'] ?? '',
            'requestedGrade' => $row['requested_grade'] ?? '',
            'repeater' => $row['repeater'] ?? '',
            'previousSchool' => $row['previous_school'] ?? '',
            'term1Result' => $row['term_1_result'] ?? '',
            'term2Result' => $row['term_2_result'] ?? '',
            'term3Result' => $row['term_3_result'] ?? '',
            'studiedElsewhere' => $row['studied_elsewhere'] ?? '',
            'studiedHereBefore' => $row['studied_here_before'] ?? '',
            'medicalStatus' => $row['medical_status'] ?? '',
            'medicalSpecial' => $row['medical_special'] ?? '',
            'medicalSurgery' => $row['medical_surgery'] ?? '',
            'surgeryYear' => $row['surgery_year'] ?? '',
            'surgeryDetails' => $row['surgery_details'] ?? '',
            'foodAllergy' => $row['food_allergy'] ?? '',
            'foodAllergyDetails' => $row['food_allergy_details'] ?? '',
            'bloodType' => $row['blood_type'] ?? '',
            'weight' => $row['weight'] ?? '',
            'height' => $row['height'] ?? '',
            'needsSpecialCare' => $row['needs_special_care'] ?? '',
            'takesMedication' => $row['takes_medication'] ?? '',
            'needsBus' => $row['needs_bus'] ?? '',
            'busLine' => $row['bus_line'] ?? '',
            'notes' => $row['notes'] ?? ''
        ];
    }

    // Build response
    $response = [
        'applicationNumber' => $parent['application_number'] ?? '',
        'primaryRole' => $parent['primary_role'] ?? '',
        'father' => [
            'status' => $parent['father_status'] ?? '',
            'firstNameAr' => $parent['father_first_name_ar'] ?? '',
            'firstNameLat' => $parent['father_first_name_lat'] ?? '',
            'lastNameAr' => $parent['father_last_name_ar'] ?? '',
            'lastNameLat' => $parent['father_last_name_lat'] ?? '',
            'job' => $parent['father_job'] ?? '',
            'phone' => $parent['father_phone'] ?? '',
            'email' => $parent['father_email'] ?? ''
        ],
        'mother' => [
            'status' => $parent['mother_status'] ?? '',
            'firstNameAr' => $parent['mother_first_name_ar'] ?? '',
            'firstNameLat' => $parent['mother_first_name_lat'] ?? '',
            'lastNameAr' => $parent['mother_last_name_ar'] ?? '',
            'lastNameLat' => $parent['mother_last_name_lat'] ?? '',
            'job' => $parent['mother_job'] ?? '',
            'phone' => $parent['mother_phone'] ?? '',
            'email' => $parent['mother_email'] ?? ''
        ],
        'guardian' => [
            'relation' => $parent['guardian_relation'] ?? '',
            'relationOther' => $parent['guardian_relation_other'] ?? '',
            'isUnknownParentage' => $parent['is_unknown_parentage'] ?? '',
            'firstNameAr' => $parent['guardian_first_name_ar'] ?? '',
            'firstNameLat' => $parent['guardian_first_name_lat'] ?? '',
            'lastNameAr' => $parent['guardian_last_name_ar'] ?? '',
            'lastNameLat' => $parent['guardian_last_name_lat'] ?? '',
            'job' => $parent['guardian_job'] ?? '',
            'phone' => $parent['guardian_phone'] ?? '',
            'email' => $parent['guardian_email'] ?? ''
        ],
        'family' => [
            'members' => $parent['family_members'] ?? '',
            'status' => $parent['family_status'] ?? '',
            'address' => $parent['address'] ?? ''
        ],
        'survey' => [
            'discoverySource' => $parent['discovery_source'] ?? '',
            'reasonForChoice' => $parent['reason_for_choice'] ?? '',
            'additionalRequests' => $parent['additional_requests'] ?? ''
        ],
        'status' => $parent['status'] ?? 'pending',
        'rejectionReason' => $parent['rejection_reason'] ?? '',
        'parentId' => $parent['id'],
        'students' => $students
    ];

    echo json_encode([
        'success' => true,
        'data' => $response
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
