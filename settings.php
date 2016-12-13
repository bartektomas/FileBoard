<?php
/*
    Jeremy: This file should display the login form. One possibility is to display the form in HTML
            and then submit the form via POST to this same page and authenticate there.
            That way all the login code is in one file.

            Can probably draw from some PHP login page example for most of this.
*/

// auto logout on page load
session_start();
//session_destroy();
//session_start();
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "fileboard";

// Create connection
$db = new mysqli($servername, $username, $password, $dbname);
// start database connection with PDO object $conn
//require_once 'database.php';

$msg = '';


// check login info if posted
if (!empty($_POST['oldpw']) && !empty($_POST['newpw']) && !empty($_POST['cnfnewpw'])) {
    //echo "something ";
    //echo $_SESSION['userid'];
    $result = $db->query("SELECT * FROM `users` WHERE userid = ".$_SESSION['userid']);
    //$stmt = $stmt->execute( array($_SESSION['userid']));
    //$result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $row = $result->fetch_assoc();
    //echo $row['userid'];
            if( password_verify($_POST['oldpw'], $row['password'])||$_POST['oldpw']===$row['password']){
                if($_POST['newpw'] === $_POST['cnfnewpw']){
                    $sql = "UPDATE users SET password = '".password_hash($_POST['newpw'], PASSWORD_DEFAULT)."' WHERE userid = ".$_SESSION['userid'];
                    //echo $sql;
                    if($db->query($sql) === true)
                    {
                        $msg = "Password changed successfully.";
                    }
                }
                else{
                    $msg = "Passwords don't match.";
                }
            }
            else{
                $msg = "Error Changing Password.";//echo "Broke";
            }




    if (!isset($_SESSION['valid'])) {
        $msg = "An error occured.";
    }
}

?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Settings</title>
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
                        Change Password
                    </h1>
                    <div class="row">
                        <div class="col-sm-1">
                        </div>
                        <div class="col-sm-10">
                            <h4 class = "form-signin-heading"><?php echo $msg; ?></h4>
                            <input type = "password" class = "form-control"
                                    name = "oldpw" placeholder = "Current Password"
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
                                name = "newpw" placeholder = "New Password" required>
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
                                name = "cnfnewpw" placeholder = "Confirm New Password" required>
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
                                name = "login" id = "login-button">Change Password</button>
                        </div>
                        <div class="col-sm-1">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-1">
                        </div>
                        <div class="col-sm-10">
                            <button class = "btn btn-lg btn-primary btn-block" onclick="window.location.href='fileboard.php'">Return to Fileboard</button>
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
