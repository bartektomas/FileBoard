<?php
if (isset($_POST['login'])) {
        $_SESSION['valid'] = true;
        header('Location: fileboard.html');
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Account Creation</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <link rel="stylesheet" href="login_style.css">
</head>

<body>
    <div class="container">
        <div class="row">
            <div class="col-sm-1">
            </div>
            <div class="col-sm-10">
                <form class = "form-create-account" role="form" action = "<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" method="post">
                    <h1 class = "text-center">
                        Sign up for Fileboard
                    </h1>
                    <div class="row">
                        <div class="col-sm-1">
                        </div>
                        <div class="col-sm-10">
                            <input type="email" name="email"  class = "form-control" placeholder = "Email"><br>
                        </div>
                        <div class="col-sm-1">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-1">
                        </div>
                        <div class="col-sm-10">
                            <input type="text" name="usern" class = "form-control" placeholder = "Username"><br>
                        </div>
                        <div class="col-sm-1">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-1">
                        </div>
                        <div class="col-sm-10">
                            <input type="password" name="pword" class = "form-control" placeholder = "Password"><br>
                        </div>
                        <div class="col-sm-1">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-1">
                        </div>
                        <div class="col-sm-10">
                            <input type="password" name="confirmPword" class = "form-control" placeholder = "Confirm password"><br>
                        </div>
                        <div class="col-sm-1">
                        </div>
                    </div>
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
