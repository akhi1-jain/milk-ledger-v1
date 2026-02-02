<?php
// api/login.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
session_start();

include '../db_connect.php'; // Adjust path as needed

$data = json_decode(file_get_contents("php://input"), true);

try {
    // 1. One query to find the user (regardless of role)
    $stmt = $conn->prepare("SELECT * FROM users WHERE reg_no = :reg_no");
    $stmt->execute([':reg_no' => $data['reg_no']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // 2. Verify Password
    if ($user && $data['password'] === $user['password']) {
        
        // 3. Set Session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['role'] = $user['role']; // 'admin' or 'user'
        $_SESSION['reg_no']  = $user['reg_no']; // <--- Add this line
        $_SESSION['name']    = $user['name'];   // <--- Add this line

        // 4. Send the ROLE back to the frontend
        echo json_encode([
            "status" => "success", 
            "message" => "Login Successful",
            "role" => $user['role'],  // <--- This is the key!
            "reg_no" => $user['reg_no'],
            "name" => $user['name']
        ]);

    } else {
        echo json_encode(["status" => "error", "message" => "Invalid ID or Password"]);
    }

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database Error"]);
}
?>