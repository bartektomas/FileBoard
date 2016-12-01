<?php
	session_start();
?>

<!DOCTYPE html>
<html>
<head lang="en">
	<meta charset="utf-8"/>
	<title>FileBoard</title>
	<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
	<script src="http://code.jquery.com/jquery-3.1.0.min.js" integrity="sha256-cCueBR6CsyA4/9szpPfrX3s49M9vUU5BgtiJj06wt/s=" crossorigin="anonymous"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>

	<?php
		if (isset($_SESSION["valid"]) && $_SESSION["valid"]) {
			echo '<script type="text/javascript">var loggedIn = true;</script>';
		} else {
			echo '<script type="text/javascript">var loggedIn = false;</script>';
		}

	 ?>

	<link href="fileboard_style.css" rel="stylesheet">
</head>
<body>
	<div id="header-div" class="well well-sm">
		<nav class="navbar navbar-inverse">
			<div class="container-fluid">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
					<a class="navbar-brand" href="#">FileBoard</a>
				</div>
				<div class="collapse navbar-collapse" id="myNavbar">
					<ul class="nav navbar-nav">
						<?php
							if (isset($_SESSION["valid"])) {
								echo '<li><a href="#" id="btn-save">Save</a></li>';
								echo '<li><a href="#" id="btn-rename">Rename</a></li>';
								echo '<li><a href="#" id="btn-delete">Delete</a></li>';
							}
						?>
					</ul>
					<!--<a class="navbar-right navbar-brand" href="#">Something Completely Different</a> -->
					<?php
						if (isset($_SESSION["valid"])) {
							echo '<a class="navbar-right navbar-brand" href="logout.php">Logout</a>';
						} else {
							echo '<a class="navbar-right navbar-brand" href="login.php">Login</a>';
							echo '<a class="navbar-right navbar-brand" href="signup.php">Signup</a>';
						}
					?>
				</div>
			</div>
		</nav>

		<?php
			if (isset($_SESSION["valid"]) && $_SESSION["valid"]) {
				echo '<button type="button" id="fileboardAdd" class="btn btn-default"><span class="glyphicon glyphicon-plus"></span></button>';
			} else {
				echo '<button type="button" class="btn btn-default btn-primary">Demo</button>';
			}

		 ?>


	</div>

	<div id="canvas-div">
		<canvas id="canvas"></canvas>
	</div>

	<div id="footer-div" class="well well-sm">
		<button id="pencil" type="button" class="btn btn-default"><span class="glyphicon glyphicon-pencil"></span> Pencil</button>
		<button id="text" type="button" class="btn btn-default"><span class="glyphicon glyphicon-font"></span> Text</button>
		<button id="shapes" type="button" class="btn btn-default" data-toggle="popover" data-placement="top" title="Shape Type" data-content="" data-html=true data-trigger="manual"><span class="glyphicon glyphicon-star"></span> Shapes</button>
	</div>

	<script src="http://cdnjs.cloudflare.com/ajax/libs/fabric.js/1.6.7/fabric.min.js" type="text/javascript"></script>
	<script src="fileboard.js" type="text/javascript"></script>
</body>
</html>
