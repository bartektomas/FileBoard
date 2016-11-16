<?php
/*
    Jeremy: This file should display the login form. One possibility is to display the form in HTML
            and then submit the form via POST to this same page and authenticate there.
            That way all the login code is in one file.

            Can probably draw from some PHP login page example for most of this.
*/

// auto logout on page load
session_start();
session_destroy();
session_start();

// start database connection with PDO object $conn
require_once 'database.php';
$result = false;
$msg = '';
$stmt = $conn->prepare("INSERT INTO `users` (`email`, `password`) VALUES (?, ?);");

// check login info if posted
if (isset($_POST['createaccount'])) {
    if (!empty($_POST['email']) && !empty($_POST['password'])) {
        if (filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
            if (strlen($_POST['email']) < 100 && strlen($_POST['password']) < 200) {
                if ($_POST['email'] === $_POST['confirmEmail'] && $_POST['password'] === $_POST['confirmPassword']) {
                    if($stmt->execute(array($_POST['email'], $_POST['password']))) {
                        $_SESSION['valid'] = true;
                        //$stmt = $conn->prepare("SELECT `userid` FROM users WHERE email = ?");
                        //$_SESSION['userid'] = $conn->query("SELECT `userid` FROM users WHERE");
                        header('Location: fileboard.php');
                    }
                    else {
                        $msg = "Database error."
                    }
                } else {
                    $msg = "Your usernames or passwords do not match."
                }
            } else {
                $msg = "Please enter a email less than 100 characters or a password less than 200."
            }
        } else {
            $msg = "Please enter a correct email."
        }
    }
    else {
        $msg = "Please fill out the form completely."
    }
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Account Creation</title>
</head>

<body>
    <form action="createaccount" method="post">
        <div>
            Email: <input type="email" name="email"><br>
        </div>
        <div>
            Confirm Email: <input type="email" name="confirmEmail"><br>
        </div>
        <div>
            Password: <input type="password" name="password"><br>
        </div>
        <div>
            Confirm Password: <input type="password" name="confirmPassword"><br>
        </div>
        <button class = "btn btn-lg btn-primary btn-block" type = "submit"
            name = "createaccount" id = "create-button">Create Account</button>
    </form>
</body>

</html>
