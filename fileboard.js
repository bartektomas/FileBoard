var canvas;
var fileboardID = null;
var fileboardName = "";

function saveFileboard() {
	if (fileboardID) {
		// save
		var data = {"action" : "save", "fileboardID" : fileboardID, "name" : fileboardName, "data" : JSON.stringify(canvas)};
	} else {
		// create new
		var data = {"action" : "saveNew", "name" : fileboardName, "data" : JSON.stringify(canvas)};
	}

	$.post('api.php', data, function (d) {
		console.log(d);
	});
}

function getFileboards() {
	var data = {"action" : "getFileboards"};
	$.post('api.php', data, function (d) {
		console.log(d);
		var json = JSON.parse(d);
		for (var i = 0; i < json.length; i++) {
			(function (json, i) {
				var button = $("<button></button>").addClass('btn btn-default btn-fileboard').html(json[i]["name"]).insertBefore('#fileboardAdd');
				button.click(function(event) {
					fileboardID = json[i]["id"];
					fileboardName = json[i]["name"];
					loadFileboard();
				});
			})(json, i)
		}
	});
}

function loadFileboard() {
	var data = {"action" : "loadFileboard", "fileboardID" : fileboardID};
	$.post('api.php', data, function (d) {
		console.log(d);
		var json = JSON.parse(d);
		canvas.loadFromJSON(json);
	});
}

$(document).ready(function() {
	// create new fileboard on tab click
	$('#fileboardAdd').click(function(event) {
		var button = $("<button></button>").addClass('btn btn-default btn-fileboard').html("New").insertBefore('#fileboardAdd');
		fileboardID = null;
		fileboardName = "New";
		saveFileboard();
	});

	canvas = new fabric.Canvas('canvas');

	canvas.setBackgroundColor({source: "grid_1.png", repeat: 'repeat'}, function () {
		canvas.renderAll();
	});

	var rect = new fabric.Rect({
		top : 500,
		left : 500,
		width : 50,
		height : 50,
		fill : 'red',
		strokeWidth : 0
	});

	canvas.add(rect);

	canvas.renderAll();

	canvas.on("object:moving", function(e) {
		var currentCanvasHeight = canvas.height;
		var currentCanvasWidth = canvas.width;
		if (e.target.left + e.target.width * e.target.scaleX > currentCanvasWidth) {
			canvas.setWidth(currentCanvasWidth+50);
			$("canvas-div").scrollLeft(e.target.left);
			$("canvas-div").on("scroll", canvas.calcOffset.bind(canvas));
		}
		if (e.target.top + e.target.height * e.target.scaleY > currentCanvasHeight) {
			canvas.setHeight(currentCanvasHeight+50);
			$("canvas-div").scrollTop(e.target.top);
			$("canvas-div").on("scroll", canvas.calcOffset.bind(canvas));
		}
	});


	// resize the canvas to fill browser window dynamically
	//$(window).resize(resizeCanvas); //TODO: debounce this

	//pencil
	$("#pencil").on("click", function() {
		if (canvas.isDrawingMode) {
			canvas.isDrawingMode = false;
			$("#pencil").addClass("btn-default");
			$("#pencil").removeClass("btn-primary");
			}
		else {
			canvas.isDrawingMode = true;
			$("#pencil").removeClass("btn-default");
			$("#pencil").addClass("btn-primary");
		}
	});

	$("#text").on("click", function() {
		var iText = new fabric.IText("hi",{
			top : 500,
			left : 500,
			width : 50,
			height : 50,
			strokeWidth : 0
		});
		canvas.add(iText);
	});

	//deleting
	$("html").keyup(function(e) {
		if(e.keyCode == 8 || e.keyCode == 46) {
			if (canvas.getActiveObject() instanceof fabric.IText) {
				if (canvas.getActiveObject().isEditing) {
					//do nothing
				}
				else {
					canvas.remove(canvas.getActiveObject());
				}
			}
			else {
				canvas.remove(canvas.getActiveObject());
			}
		}
	});

	//initialize canvas to window size
	canvas.setHeight(window.innerHeight);
	canvas.setWidth(window.innerWidth);
	canvas.renderAll();

	getFileboards();
});
