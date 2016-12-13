<?php
    /*
        Returns fileboard data, saves fileboard data, basically all interactions between the JavaScript
        code and server-side code go through here (except logins). Check for session data to make sure
        only authenticated users get data.

        Current only allows one fileboard per user.
    */
require_once "database.php";

session_start();

//header("Content-Type: application/json");

if ($_SESSION["valid"] && isset($_POST["action"])) {
    if ($_POST["action"] === "saveNew") {
        $stmt = $conn->prepare("INSERT INTO `fileboards` (`userid`, `name`, `data`) VALUES (?, ?, ?)");
        if ($stmt->execute( array($_SESSION['userid'], $_POST['name'], $_POST['data']) )) {
            echo 1;
        } else {
            echo 0;
        }
    }

    if ($_POST["action"] === "save") {
        $stmt = $conn->prepare("UPDATE `fileboards` SET `name` = ?, `data` = ? WHERE `fileboards`.`id` = ? and `fileboards`.`userid` = ?");
        if ($stmt->execute( array($_POST['name'], $_POST['data'], $_POST['fileboardID'], $_SESSION['userid']) )) {
            echo 1;
        } else {
            echo 0;
        }
    }

    if ($_POST["action"] === "getFileboards") {
        $stmt = $conn->prepare("SELECT id, name FROM `fileboards` WHERE userid = ?");
        if ($stmt->execute( array($_SESSION['userid']) )) {
            echo json_encode($stmt->fetchAll());
        } else {
            echo 0;
        }
    }

    if ($_POST["action"] === "loadFileboard") {
        $stmt = $conn->prepare("SELECT * FROM `fileboards` WHERE userid = ? and id = ?");
        if ($stmt->execute( array($_SESSION['userid'], $_POST['fileboardID']) )) {
            echo json_encode($stmt->fetch());
        } else {
            echo 0;
        }
    }


    if ($_POST["action"] === "deleteFileboard") {
        $stmt = $conn->prepare("DELETE FROM `fileboards` WHERE `fileboards`.`userid` = ? AND `fileboards`.`id` = ?");
        if ($stmt->execute( array($_SESSION['userid'], $_POST['fileboardID']) )) {
            echo json_encode($stmt->fetch());
        } else {
            echo 0;
        }
    }

    if ($_POST["action"] === "renameFileboard") {
        $stmt = $conn->prepare("UPDATE `fileboards` SET `name` = ? WHERE `fileboards`.`id` = ? and `fileboards`.`userid` = ?");
        if ($stmt->execute( array($_POST['name'], $_POST['fileboardID'], $_SESSION['userid']) )) {
            echo 1;
        } else {
            echo 0;
        }
    }

}

if ($_SESSION["valid"] && $_SESSION["userid"] && !empty($_FILES)) {
    print_r($_FILES);
    $fileName = $_FILES['file']['name'];
    $fileType = $_FILES['file']['type'];
    $fileError = $_FILES['file']['error'];
    $fileTempName = $_FILES['file']['tmp_name'];

    $userid = $_SESSION['userid'];

    if($fileError == UPLOAD_ERR_OK){
        $path = $_SERVER["DOCUMENT_ROOT"] . dirname($_SERVER['PHP_SELF']) . "/userfiles/$userid";
        if ( ! is_dir($path)) {
            mkdir($path, 0777, true);
        }
        move_uploaded_file($fileTempName, $path."/$fileName");
    }
}


?>
