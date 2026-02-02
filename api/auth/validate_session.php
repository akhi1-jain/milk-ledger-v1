<?php
// api/get_session.php
header("Content-Type: application/json");
session_start(); // Resume the existing session
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

if (isset($_SESSION['user_id'])) {
    // User is logged in
    echo json_encode([
        "status" => "active", 
        "role" => $_SESSION['role'],
        "reg_no" => $_SESSION['reg_no'] ?? "", // Using null coalescing operator in case it's empty
        "name" => $_SESSION['name'] ?? ""
    ]);
} else {
    // User is NOT logged in
    echo json_encode(["status" => "expired"]);
}
?>