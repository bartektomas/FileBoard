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

$msg = '';


// check login info if posted
if (isset($_POST['login']) && !empty($_POST['email']) && !empty($_POST['password'])) {
    foreach ($conn->query("SELECT * FROM users") as $row) {
        if ($row['email'] === $_POST['email'] && ( $row['password'] === $_POST['password'] || password_verify($_POST['password'], $row['password']) )) {
            $_SESSION['valid'] = true;
            $_SESSION['userid'] = $row['userid'];

            if ($row['type'] === "admin") {
                $_SESSION['isAdmin'] = true;
            } else {
                $_SESSION['isAdmin'] = false;
            }

            // add hashing
            if ($row['password'] === $_POST['password']) {
                $stmt = $conn->prepare("UPDATE `users` SET `password` = ? WHERE `users`.`userid` = ?");
                $stmt->execute(array(password_hash($_POST['password'], PASSWORD_DEFAULT), $row['userid']));
            }



            header('Location: fileboard.php');
            break;
        }
    }
    if (!isset($_SESSION['valid'])) {
        $msg = "Login failed. Please try again.";
    }
}

?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Login - FileBoard</title>
		<link rel="icon" href="favicon.ico" />
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
                        Sign in to FileBoard
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
                            <button class = "btn btn-lg btn-primary btn-block" type = "submit"
                                name = "login" id = "login-button">Login</button>
                        </div>
                        <div class="col-sm-1">
                        </div>
                    </div>
                    </form>
                </div>
                        <div class="col-sm-1">
                </div>
            </div>
        </div>
    </body>
</html>
