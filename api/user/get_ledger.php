<?php
// api/user/get_ledger.php
header("Content-Type: application/json");
session_start();

// 1. SECURITY: Ensure user is logged in
if (!isset($_SESSION['user_id']) || !isset($_SESSION['reg_no'])) {
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit();
}

include '../db_connect.php'; 

$reg_no = $_SESSION['reg_no'];
$data = json_decode(file_get_contents("php://input"), true);

// 2. DATE LOGIC: Use provided dates OR default to last 30 days
if (isset($data['start_date']) && isset($data['end_date']) && !empty($data['start_date'])) {
    $startDate = $data['start_date'];
    $endDate = $data['end_date'];
} else {
    // Default: Today and 30 days ago
    $endDate = date('Y-m-d');
    $startDate = date('Y-m-d', strtotime('-30 days'));
}

try {
    // 3. FETCH DATA
    $sql = "SELECT * FROM milk_entries 
            WHERE reg_no = :reg_no 
            AND log_date BETWEEN :start_date AND :end_date 
            ORDER BY log_date DESC";
            
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':reg_no' => $reg_no,
        ':start_date' => $startDate,
        ':end_date' => $endDate
    ]);

    $entries = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success", 
        "data" => $entries,
        "range" => ["start" => $startDate, "end" => $endDate]
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>