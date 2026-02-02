<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

session_start(); // 1. Start Session

// 2. CHECK IF ADMIN
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(["status" => "error", "message" => "Unauthorized Access"]);
    exit(); // Stop the script immediately
}

include '../db_connect.php'; 

$data = json_decode(file_get_contents("php://input"), true);

if (is_null($data)) {
    echo json_encode(["status" => "error", "message" => "No JSON data received"]);
    exit();
}

try {
    $sql = "INSERT INTO milk_entries (reg_no, tally, snf, milk_type, log_date, total_amount, status) 
            VALUES (:reg_no, :tally, :snf, :milk_type, :date, :total_amount, :status)";
    
    $stmt = $conn->prepare($sql);

    $stmt->execute([
        ':reg_no'       => $data['reg_no'],
        ':tally'        => $data['tally'],
        ':snf'          => $data['snf'],
        ':milk_type'    => $data['milk_type'],
        ':date'         => $data['date'],
        ':total_amount' => $data['total_amount'],
        ':status'       => $data['status'],
    ]);

    echo json_encode(["status" => "success"]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>