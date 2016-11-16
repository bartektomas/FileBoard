<!DOCTYPE html>
<html>
<head lang="en">
	<meta charset="utf-8"/>
	<title>FileBoard</title>
	<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
	<script src="http://code.jquery.com/jquery-3.1.0.min.js" integrity="sha256-cCueBR6CsyA4/9szpPfrX3s49M9vUU5BgtiJj06wt/s=" crossorigin="anonymous"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
	<link href="fileboard_style.css" rel="stylesheet">
</head>
<body>
	<div id="header" class="well well-sm">
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
						<li class="active"><a href="#">Something</a></li>
						<li><a href="#">Something Else</a></li>
					</ul>
					<a class="navbar-right navbar-brand" href="#">Something Completely Different</a>
				</div>
			</div>
		</nav>
		<button type="button" class="btn btn-default">Tab 1</button>
		<button type="button" class="btn btn-default">Tab 2</button>
		<button type="button" class="btn btn-default"><span class="glyphicon glyphicon-plus"></span></button>
	</div>
	
	<div id="canvas-div">
		<canvas id="canvas"></canvas>
	</div>
	
	<div id="footer" class="well well-sm">
		<button id="pencil" type="button" class="btn btn-default"><span class="glyphicon glyphicon-pencil"></span> Pencil</button>
		<button type="button" class="btn btn-default"><span class="glyphicon glyphicon-text-color"></span> Text</button>
		<button type="button" class="btn btn-default">Tool 3</button>
		<button type="button" class="btn btn-default">Tool 4</button>
		<button type="button" class="btn btn-default">Tool 5</button>
		<button type="button" class="btn btn-default">Tool 6</button>
		<button type="button" class="btn btn-default">Tool 7</button>
		<button type="button" class="btn btn-default">Tool 8</button>
		<button type="button" class="btn btn-default">Tool 9</button>
	</div>
	
	<script src="http://cdnjs.cloudflare.com/ajax/libs/fabric.js/1.6.7/fabric.min.js" type="text/javascript"></script>
	<script src="fileboard.js" type="text/javascript"></script>
</body>
</html>