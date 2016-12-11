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
                    if($stmt->execute(array($_POST['email'], password_hash($_POST['password'], PASSWORD_DEFAULT)))) {
                        $_SESSION['valid'] = true;
                        $_SESSION['isAdmin'] = false;
                        $stmt2 = $conn->prepare("SELECT `userid` FROM users WHERE email = ?");
                        $stmt2->execute(array($_POST['email']));
                        $_SESSION['userid'] = $stmt2->fetchColumn();
                        header('Location: fileboard.php');
                    }
                    else {
                        $msg = "Database error: email already used.";
                    }
                } else {
                    $msg = "Your usernames or passwords do not match.";
                }
            } else {
                $msg = "Please enter a email less than 100 characters or a password less than 200.";
            }
        } else {
            $msg = "Please enter a correct email.";
        }
    }
    else {
        $msg = "Please fill out the form completely.";
    }
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Signup - Fileboard</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <link rel="stylesheet" href="login_style.css">
</head>

<body>
    <div class="container">
        <div class="row">
            <div class="col-sm-1">
            </div>
            <div class="col-sm-10">
                <form class = "form-signin" role = "form" action = "<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" method = "post">
                <h1 class = "text-center">
                    Create an account with FileBoard
                </h1>
                <div class="row">
                    <div class="col-sm-1">
                    </div>
                    <div class="col-sm-10">
                        <h4 class = "form-signin-heading"><?php echo $msg; ?></h4>
                        <input type = "text" class = "form-control"
                                name = "email" placeholder = "Email"
                                required autofocus>
                    </div>
                    <div class="col-sm-1">
                    </div>
                </div>
                </br>
                <div class="row">
                    <div class="col-sm-1">
                    </div>
                    <div class="col-sm-10">
                        <input type = "text" class = "form-control"
                                name = "confirmEmail" placeholder = "Confirm Email"
                                required autofocus>
                    </div>
                    <div class="col-sm-1">
                    </div>
                </div>
                </br>
                <div class="row">
                    <div class="col-sm-1">
                    </div>
                    <div class="col-sm-10">
                        <input type = "password" class = "form-control"
                            name = "password" placeholder = "Password" required>
                    </div>
                    <div class="col-sm-1">
                    </div>
                </div>
                </br>
                <div class="row">
                    <div class="col-sm-1">
                    </div>
                    <div class="col-sm-10">
                        <input type = "password" class = "form-control"
                            name = "confirmPassword" placeholder = "Confirm Password" required>
                    </div>
                    <div class="col-sm-1">
                    </div>
                </div>
                </br>
                <div class="row">
                    <div class="col-sm-1">
                    </div>
                    <div class="col-sm-10">
                        <button class = "btn btn-lg btn-primary btn-block" type = "submit"
                            name = "createaccount" id = "login-button">Create Account</button>
                    </div>
                    <div class="col-sm-1">
                    </div>
                </div>
                <div class="col-sm-1">
                </div>
            </form>
        </div>
    </div>
</body>

</html>
