<?php
session_start();
session_unset();     // Clear variables
session_destroy();   // Destroy session ID

// Redirect back to login page
header("Location: ../../login.html");
exit();
?>