<?php
require_once 'database.php';

session_start();

if (!isset($_SESSION["valid"]) || !$_SESSION["isAdmin"]) {
    echo 'Error: Not Admin';
    exit();
}

if (isset($_POST["deleteUser"])) {
    $stmt = $conn->prepare("DELETE FROM `users` WHERE `users`.`userid` = ?");
    $stmt->execute(array($_POST["deleteUser"]));
}

if (isset($_POST["deleteFileboard"])) {
    $stmt = $conn->prepare("DELETE FROM `fileboards` WHERE `fileboards`.`id` = ?");
    $stmt->execute(array($_POST["deleteFileboard"]));
}

$users = $conn->prepare("SELECT userid, email, type FROM `users`");
$users->execute();

$fileboards = $conn->prepare("SELECT id, userid, name, LENGTH(data) FROM `fileboards` ORDER BY LENGTH(data) DESC");
$fileboards->execute();

?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Admin Panel - FileBoard</title>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
        <script src="http://code.jquery.com/jquery-3.1.0.min.js" integrity="sha256-cCueBR6CsyA4/9szpPfrX3s49M9vUU5BgtiJj06wt/s=" crossorigin="anonymous"></script>
        <link rel="stylesheet" href="admin_style.css">
    </head>
    <body>
        <pre><?php //print_r($fileboards->fetchAll()) ?></pre>
        <div class="container">
            <div class="row">
                <div class="col-sm-1">
                </div>
                <div class="col-sm-10">
                    <div id="go-back">
                        <a href=".">Back to FileBoard</a>
                    </div>
                    <h1>Admin Panel</h1>
                    <h3>Users</h3>
                    <form action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" method="post">
                        <table id="user-table">
                            <tbody>
                                <tr>
                                    <th>Email</th>
                                    <th>User ID</th>
                                    <th>Type</th>
                                    <th>Actions</th>
                                </tr>
                                <?php
                                while ($row = $users->fetch(PDO::FETCH_ASSOC)) {
                                    echo "<tr>";
                                    echo "<td>" . $row["email"] . "</td>";
                                    echo "<td>" . $row["userid"] . "</td>";
                                    echo "<td>" . $row["type"] . "</td>";
                                    echo "<td><button name='deleteUser' value=" . $row["userid"] . ">Delete</button></td>";
                                    echo "</tr>";
                                }
                                ?>
                            </tbody>
                        </table>
                    </form>

                    <h3>Fileboards</h3>
                    <form action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" method="post">
                        <table id="fileboard-table">
                            <tbody>
                                <tr>
                                    <th>Fileboard ID</th>
                                    <th>User ID</th>
                                    <th>Fileboard Name</th>
                                    <th>Size (bytes)</th>
                                    <th>Action</th>
                                </tr>
                                <?php
                                while ($row = $fileboards->fetch(PDO::FETCH_ASSOC)) {
                                    echo "<tr>";
                                    echo "<td>" . $row["id"] . "</td>";
                                    echo "<td>" . $row["userid"] . "</td>";
                                    echo "<td>" . $row["name"] . "</td>";
                                    echo "<td>" . $row["LENGTH(data)"] . "</td>";
                                    echo "<td><button name='deleteFileboard' value=" . $row["id"] . ">Delete</button></td>";
                                    echo "</tr>";
                                }
                                ?>
                            </tbody>
                        </table>
                    </form>
                </div>
                <div class="col-sm-1">
                </div>
            </div>
        </div>
    </body>
</html>
