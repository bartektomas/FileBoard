<?php
/*
    Jeremy: This file should display the login form. One possibility is to display the form in HTML
            and then submit the form via POST to this same page and authenticate there.
            That way all the login code is in one file.

            Can probably draw from some PHP login page example for most of this.
*/

session_start();

// start database connection with PDO object $conn
require_once 'database.php';

// check if GET logout=true
if (isset($_GET['logout']) && $_GET['logout']) {
    session_destroy();
}
// check login info if posted
elseif (isset($_POST['login']) && !empty($_POST['email']) && !empty($_POST['password'])) {
    foreach ($conn->query("SELECT * FROM users") as $row) {
        if ($row['email'] === $_POST['email'] && $row['password'] === $_POST['password']) {
            $_SESSION['valid'] = true;
            $_SESSION['userid'] = $row['userid'];
            break;
        }
    }
}

?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Login - Fileboard</title>
    </head>
    <body>
        <?php print_r($_POST); ?>
        <div class="container">
            <form class = "form-signin" role = "form" action = "<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" method = "post">
                <h4 class = "form-signin-heading"><?php echo ''; ?></h4>
                <input type = "text" class = "form-control"
                    name = "email" placeholder = "test@test.com"
                    required autofocus></br>
                <input type = "password" class = "form-control"
                    name = "password" placeholder = "pass" required>
                <button class = "btn btn-lg btn-primary btn-block" type = "submit"
                    name = "login">Login</button>
           </form>
        </div>
    </body>
</html>
