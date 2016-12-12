var canvas;
var fileboardID = null;
var fileboardName = "";
var numBoards = 0;

function displayError() {
	var text = 'Connection to server failed. Please check your internet connection.'
	$(".alert-dismissible").remove();
	var msg = $('<div role="alert">').addClass('alert alert-warning alert-dismissible')
	.html('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Warning!</strong> ' + text);

	$('nav.navbar').after(msg);
}

function displayGoodSave() {
	var text = 'You are good to go.'
	$(".alert-dismissible").remove();
	var msg = $('<div role="alert">').addClass('alert alert-success alert-dismissible')
	.html('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Fileboard Saved!</strong> ' + text);

	$('nav.navbar').after(msg);
}

function saveFileboard(showAlert = false) {
	if (!loggedIn) {
		return;
	}

	if (fileboardID && fileboardName) {
		// save
		var data = {"action" : "save", "fileboardID" : fileboardID, "name" : fileboardName, "data" : JSON.stringify(canvas)};
		$.post('api.php', data, function (d) {
			if(showAlert === true) {
				displayGoodSave();
			}
		}).fail(displayError);
	}


}

function saveNewFileboard(name) {
	if (!loggedIn) {
		return;
	}

	fileboardID = null;
	fileboardName = "";
	$(".btn-fileboard").removeClass("btn-primary");

	var data = {"action" : "saveNew", "name" : name, "data" : JSON.stringify(canvas)};

	$.post('api.php', data, function (d) {
		console.log(d);
		getFileboards();
	}).fail(displayError);
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
					if (button.hasClass('btn-primary')) {
						return;
					}
					saveFileboard();
					$(".btn-fileboard").removeClass("btn-primary");
					button.addClass("btn-primary");
					fileboardID = json[i]["id"];
					fileboardName = json[i]["name"];
					loadFileboard();
				});
				if (fileboardID === json[i]["id"] || (i === json.length - 1 && $(".btn-primary.btn-fileboard").length === 0) ) {
					button.addClass("btn-primary");
					fileboardID = json[i]["id"];
					fileboardName = json[i]["name"];
					loadFileboard();
				}
			})(json, i)
		}
		if (numBoards == 0) {
			saveNewFileboard("New Board");
		}
	}).fail(displayError);
}

function deleteFileboard(idToDelete) {
	if (!loggedIn) {
		return;
	}

	var data = {"action" : "deleteFileboard", "fileboardID" : idToDelete};
	$.post('api.php', data, getFileboards).fail(displayError);
}

function renameFileboard(idToRename, name) {
	if (!loggedIn) {
		return;
	}

	var data = {"action" : "renameFileboard", "fileboardID" : idToRename, "name" : name};
	$.post('api.php', data, getFileboards).fail(displayError);
}

function loadFileboard() {
	if (!loggedIn) {
		return;
	}

	var data = {"action" : "loadFileboard", "fileboardID" : fileboardID};
	$.post('api.php', data, function (d) {
		//console.log(d);
		var json = JSON.parse(d);
		canvas.loadFromJSON(json["data"], canvas.renderAll.bind(canvas));
	}).fail(displayError);
}

var color = "#000000";
function changeColor(jscolor) {
	color = "#" + jscolor;
	canvas.freeDrawingBrush.color = color;
	if (canvas.getActiveObject()) {
		if (typeof canvas.getActiveObject().fill === "string") {
			canvas.getActiveObject().fill = color;
		}
	}
	if (canvas.getActiveGroup()) {
		$.each(canvas.getActiveGroup().getObjects(), function(key, value) {
			if (typeof value.fill === "string") {
				value.fill = color;
			}
		});
	}
	canvas.renderAll();
}

var mode = 0;
//mode 0: none (edit)
//mode 1: pencil
//mode 2: text
//mode 3: shapes
//mode 4: image

$(document).ready(function() {
	// create new fileboard on tab click
	$('#fileboardAdd').click(function(event) {
		saveFileboard();
		canvas.clear();
		/*canvas.setBackgroundColor({source: "grid_1.png", repeat: 'repeat'}, function () {
			canvas.renderAll();
		});*/
		canvas.renderAll();
		saveNewFileboard("New Board");
	});

	$('#btn-save').click(function () {
		saveFileboard(true);
	});

	$('#btn-rename').click(function () {
		var input = $('<input type="text" size="10">').addClass('fileboard-rename-field');
		input.keyup(function(event) {
			event.stopPropagation();
			if (event.keyCode == 13) {
				var name = input.val();
				$(".btn-fileboard.btn-primary").first().html(name);
				renameFileboard(fileboardID, name);
			}
			else if (event.keyCode == 27) {
				$(".btn-fileboard.btn-primary").first().html(fileboardName);
			}
		});
		input.focusout(function(event) {
			$(".btn-fileboard.btn-primary").first().html(fileboardName);
		});
		$(".btn-fileboard.btn-primary").first().empty().append(input);
		input.val(fileboardName).focus();
	});

	$('#btn-delete').click(function () {
		deleteFileboard(fileboardID);
	});

	if(loggedIn) getFileboards();

	canvas = new fabric.Canvas('canvas');

	//grid background
	// Note from Jeremy: Made this a part of the body background instead. adjusts to window resizing better
	/*canvas.setBackgroundColor({source: "grid_1.png", repeat: 'repeat'}, function () {
		canvas.renderAll();
	});*/

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
	
	//set color to color of selected object
	canvas.on("object:selected", function(e) {
		if (canvas.getActiveObject()) {
			if (typeof canvas.getActiveObject().fill === "string") {
				$("#color")[0].jscolor.fromString(canvas.getActiveObject().fill);
			}
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
		else if (mode == 4) {
			$("#image").addClass("btn-default");
			$("#image").removeClass("btn-primary");
			$("#image").popover("hide");
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
		else if (mode == 4) {
			$("#image").removeClass("btn-default");
			$("#image").addClass("btn-primary");
			$("#image").popover("show");
			$("#imgLoader").change(function(e) {
				var reader = new FileReader();
		    	reader.onload = function (event) {
					console.log('fdsf');
			        var imgObj = new Image();
			        imgObj.src = event.target.result;
			        imgObj.onload = function () {
			            // start fabricJS stuff
			            var image = new fabric.Image(imgObj);
			            image.set({
			                left: 150,
			                top: 150,
			                angle: 0,
			                padding: 10,
			                cornersize: 10,
							height: 100,
							width: 100
			            });
			            //image.scale(getRandomNum(0.1, 0.25)).setCoords();
			            canvas.add(image);
			            // end fabricJS stuff
						$("#imgLoader").val(null);
						modeSwitch(0);

			        }
		    	}

		    	reader.readAsDataURL(e.target.files[0]);
			});
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

	//image button
	$("#image").on("click", function() {
		if (mode == 4) {
			modeSwitch(0);
		}
		else {
			modeSwitch(4);
		}
	});

	//deleting fabric objects
	$("html").keyup(function(e) {
		if(e.keyCode == 8 || e.keyCode == 46) {
			if (canvas.getActiveObject()) {
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
			if (canvas.getActiveGroup()) {
				$.each(canvas.getActiveGroup().getObjects(), function(key, value) {
					canvas.remove(value);
				});
				canvas.deactivateAll();
				canvas.renderAll();
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
					strokeWidth : 0,
					fill : color
				});
				canvas.add(shape);
			}
			else if (selected == 2) { //circle
				var shape = new fabric.Circle({
					top : options.e.clientY,
					left : options.e.clientX,
					radius : 25,
					strokeWidth : 0,
					fill : color
				});
				canvas.add(shape);
			}
			else if (selected == 3) { //triangle
				var shape = new fabric.Triangle({
					top : options.e.clientY,
					left : options.e.clientX,
					width : 50,
					height : 50,
					strokeWidth : 0,
					fill : color
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

	$("#image").popover();
	$("#image").attr("data-content", '<input type="file" id="imgLoader">');

	// save every 20 seconds
	setInterval(saveFileboard, 20000);
});
