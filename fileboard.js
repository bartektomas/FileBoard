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

var mode = 0;
//mode 0: none (edit)
//mode 1: pencil
//mode 2: text

$(document).ready(function() {
	// create new fileboard on tab click
	$('#fileboardAdd').click(function(event) {
		var button = $("<button></button>").addClass('btn btn-default btn-fileboard').html("New").insertBefore('#fileboardAdd');
		fileboardID = null;
		fileboardName = "New";
		saveFileboard();
	});

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
	});

	//initialize canvas to window size
	canvas.setHeight(window.innerHeight);
	canvas.setWidth(window.innerWidth);
	canvas.renderAll();

	getFileboards();
});
