<?php
    /*
        Returns fileboard data, saves fileboard data, basically all interactions between the JavaScript
        code and server-side code go through here (except logins). Check for session data to make sure
        only authenticated users get data.

        Current only allows one fileboard per user.
    */
require_once "database.php";

session_start();

if ($_SESSION["valid"]) {
    if ($_POST["action"] === "save") {
        $stmt = $conn->prepare("INSERT INTO `fileboards` (`userid`, `data`) VALUES (?, ?) ON DUPLICATE KEY UPDATE data=?");
        if ($stmt->execute( array($_SESSION['userid'], $_POST['data'], $_POST['data']) )) {
            return 1;
        } else {
            return 0;
        }
    }
}


?>
