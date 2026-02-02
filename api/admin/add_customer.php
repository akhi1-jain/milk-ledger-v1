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

try {

    $stmt = $conn->query("SELECT MAX(id) as max_id FROM users");
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    $nextId = $row['max_id'] ? $row['max_id'] + 1 : 1; 

    $reg_no = "UID" . $nextId;

    $sql = "INSERT INTO users (reg_no, name, address, phone, join_date, password) 
            VALUES (:reg_no, :name, :address, :phone, :join_date, :password)";
    
    $stmt = $conn->prepare($sql);
    
    $stmt->execute([
        ':reg_no'   => $reg_no, 
        ':name'     => $data['name'],
        ':address'  => $data['address'],
        ':phone'    => $data['phone'],
        ':join_date' => $data['join_date'], 
        ':password' => $data['password']
    ]);

    echo json_encode([
        "status" => "success", 
        "new_reg_no" => $reg_no
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>