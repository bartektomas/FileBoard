var canvas;
var fileboardID = null;
var fileboardName = "";
var numBoards = 0;

function saveFileboard() {
	if (!loggedIn) {
		return;
	}

	if (fileboardID && fileboardName) {
		// save
		var data = {"action" : "save", "fileboardID" : fileboardID, "name" : fileboardName, "data" : JSON.stringify(canvas)};
	}

	$.post('api.php', data, function (d) {
		console.log(d);
	});
}

function saveNewFileboard(name) {
	if (!loggedIn) {
		return;
	}

	var data = {"action" : "saveNew", "name" : name, "data" : JSON.stringify(canvas)};

	$.post('api.php', data, function (d) {
		console.log(d);
		getFileboards();
	});
}

function getFileboards() {
	if (!loggedIn) {
		return;
	}

	var data = {"action" : "getFileboards"};
	$.post('api.php', data, function (d) {
		console.log(d);
		$(".btn-fileboard").remove();
		var json = JSON.parse(d);
		numBoards = json.length;
		for (var i = 0; i < json.length; i++) {
			(function (json, i) {
				var button = $("<button></button>").addClass('btn btn-default btn-fileboard').html(json[i]["name"]).insertBefore('#fileboardAdd');
				button.click(function(event) {
					saveFileboard();
					$(".btn-fileboard").removeClass("btn-primary");
					button.addClass("btn-primary");
					fileboardID = json[i]["id"];
					fileboardName = json[i]["name"];
					loadFileboard();
				});
				if (i === json.length - 1) {
					button.addClass("btn-primary");
					fileboardID = json[i]["id"];
					fileboardName = json[i]["name"];
					loadFileboard();
				}
			})(json, i)
		}
	});
}

function loadFileboard() {
	if (!loggedIn) {
		return;
	}

	var data = {"action" : "loadFileboard", "fileboardID" : fileboardID};
	$.post('api.php', data, function (d) {
		var json = JSON.parse(d);
		canvas.loadFromJSON(json["data"]);
		canvas.setBackgroundColor({source: "grid_1.png", repeat: 'repeat'}, function () {
			canvas.renderAll();
		});
	});
}

var mode = 0;
//mode 0: none (edit)
//mode 1: pencil
//mode 2: text
//mode 3: shapes

$(document).ready(function() {
	// create new fileboard on tab click
	$('#fileboardAdd').click(function(event) {
		canvas.clear();
		canvas.setBackgroundColor({source: "grid_1.png", repeat: 'repeat'}, function () {
			canvas.renderAll();
		});
		saveNewFileboard("Board " + String(numBoards+1));
	});

	$('#btn-save').click(saveFileboard);

	if(loggedIn) getFileboards();

	canvas = new fabric.Canvas('canvas');

	//grid background
	canvas.setBackgroundColor({source: "grid_1.png", repeat: 'repeat'}, function () {
		canvas.renderAll();
	});

	//rudimentary scaling when an object moves past right/bottom edges
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

	function modeSwitch(newMode) {
		//handle exiting whatever mode we were in
		if (mode == 0) {

		}
		else if (mode == 1) {
			canvas.isDrawingMode = false;
			$("#pencil").addClass("btn-default");
			$("#pencil").removeClass("btn-primary");
		}
		else if (mode == 2) {
			$("#text").addClass("btn-default");
			$("#text").removeClass("btn-primary");
		}
		else if (mode == 3) {
			$("#shapes").addClass("btn-default");
			$("#shapes").removeClass("btn-primary");
			$("#shapes").popover("hide");
		}

		mode = newMode;

		//enter new mode
		if (mode == 0) {

		}
		else if (mode == 1) {
			canvas.isDrawingMode = true;
			$("#pencil").removeClass("btn-default");
			$("#pencil").addClass("btn-primary");
		}
		else if (mode == 2) {
			$("#text").removeClass("btn-default");
			$("#text").addClass("btn-primary");
		}
		else if (mode == 3) {
			$("#shapes").removeClass("btn-default");
			$("#shapes").addClass("btn-primary");
			$("#shapes").popover("show");
		}
	}

	//pencil button
	$("#pencil").on("click", function() {
		if (mode == 1) {
			modeSwitch(0);
		}
		else {
			modeSwitch(1);
		}
	});

	//text button
	$("#text").on("click", function() {
		if (mode == 2) {
			modeSwitch(0);
		}
		else {
			modeSwitch(2);
		}
	});
	
	//shapes button
	$("#shapes").on("click", function() {
		if (mode == 3) {
			modeSwitch(0);
		}
		else {
			modeSwitch(3);
		}
	});

	//deleting fabric objects
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

	canvas.on("mouse:down", function(options) {
		if(mode == 0) {

		}
		else if (mode == 1) {

		}
		else if (mode == 2) {
			modeSwitch(0);
			var iText = new fabric.IText("",{
				top : options.e.clientY,
				left : options.e.clientX,
				width : 50,
				height : 50,
				strokeWidth : 0
			});
			iText.lockUniScaling = true;
			canvas.add(iText);
			canvas.setActiveObject(iText);
			iText.enterEditing();
		}
		else if (mode == 3) {
			var selected = $("#shape-form input[type='radio']:checked").val();
			
			if (selected == 1) { //rectangle
				var shape = new fabric.Rect({
					top : options.e.clientY,
					left : options.e.clientX,
					width : 50,
					height : 50,
					strokeWidth : 0
				});
				canvas.add(shape);
			}
			else if (selected == 2) { //circle
				var shape = new fabric.Circle({
					top : options.e.clientY,
					left : options.e.clientX,
					radius : 25,
					strokeWidth : 0
				});
				canvas.add(shape);
			}
			else if (selected == 3) { //triangle
				var shape = new fabric.Triangle({
					top : options.e.clientY,
					left : options.e.clientX,
					width : 50,
					height : 50,
					strokeWidth : 0
				});
				canvas.add(shape);
			}
		}
	});

	//initialize canvas to window size
	canvas.setHeight(window.innerHeight);
	canvas.setWidth(window.innerWidth);
	canvas.renderAll();

	$("#shapes").popover();
	$("#shapes").attr("data-content", '\
	<form id="shape-form">\
	<div class="radio">\
		<label><input type="radio" name="optradio" value="1">Rectangle</label>\
	</div>\
	<div class="radio">\
		<label><input type="radio" name="optradio" value="2">Circle</label>\
	</div>\
	<div class="radio">\
		<label><input type="radio" name="optradio" value="3">Triangle</label>\
	</div>\
	</form>\
	');
});
