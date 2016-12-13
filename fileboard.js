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

function displayDownload(link) {
	var text = 'Click here to download.'
	$(".alert-dismissible").remove();
	var msg = $('<div role="alert">').addClass('alert alert-info alert-dismissible')
	.html('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Do you want to download file?</strong> <a href="' + link + '" target="_blank" class="alert-link" download>'+ text + '</a>');

	$('nav.navbar').after(msg);

	$(".alert-dismissible a").click(function(event) {
		$(".alert-dismissible").remove();
	});
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
		canvas.setBackgroundColor({source: "grid_1.png", repeat: 'repeat'}, function () {
			canvas.renderAll();
		});
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
//mode 5: file

$(document).ready(function() {
	//canvas = new fabric.Canvas('canvas');
	canvas = new fabric.CanvasEx('canvas');

	// create new fileboard on tab click
	$('#fileboardAdd').click(function(event) {
		saveFileboard();
		canvas.clear();
		canvas.setBackgroundColor({source: "grid_1.png", repeat: 'repeat'}, function () {
			canvas.renderAll();
		});
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
    $('#btn-download').click(function () {
        var url = canvas.toDataURL('png');
        var contain = document.getElementById("download-image");
        contain.setAttribute("href", url);
        contain.click();
	});
	if(loggedIn) getFileboards();


	//grid background
	canvas.setBackgroundColor({source: "grid_1.png", repeat: 'repeat'}, function () {
		canvas.renderAll();
	});

	// load a default fileboard for guests
	if (!loggedIn) {
		var data = '{"objects":[{"type":"i-text","originX":"left","originY":"top","left":41,"top":163,"width":377.66,"height":45.2,"fill":"#00dbbe","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1.73,"scaleY":1.73,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"text":"Welcome to FileBoard!","fontSize":40,"fontWeight":"normal","fontFamily":"Times New Roman","fontStyle":"","lineHeight":1.16,"textDecoration":"","textAlign":"left","textBackgroundColor":"","charSpacing":0,"styles":{"0":{"1":{},"2":{},"3":{},"4":{},"5":{},"6":{},"7":{},"8":{},"9":{},"10":{},"11":{},"12":{},"13":{},"14":{},"15":{},"16":{},"17":{},"18":{},"19":{},"20":{},"21":{}}}},{"type":"path","originX":"center","originY":"center","left":369.75,"top":270,"width":636.5,"height":40,"fill":null,"stroke":"#00dbbe","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"round","strokeLineJoin":"round","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"pathOffset":{"x":369.75,"y":270},"path":[["M",51.5,284],["Q",51.5,284,52,284],["Q",52.5,284,54.75,282.5],["Q",57,281,57.5,281],["Q",58,281,61,279],["Q",64,277,65,276.5],["Q",66,276,69.5,273.5],["Q",73,271,74,270.5],["Q",75,270,78.5,268],["Q",82,266,83,265.5],["Q",84,265,88.5,264],["Q",93,263,94,263],["Q",95,263,103,261.5],["Q",111,260,112.5,260],["Q",114,260,123.5,258],["Q",133,256,134.5,255.5],["Q",136,255,146,253.5],["Q",156,252,158,252],["Q",160,252,169,251.5],["Q",178,251,179.5,250.5],["Q",181,250,191.5,250],["Q",202,250,203.5,250],["Q",205,250,215,250],["Q",225,250,227,250],["Q",229,250,240.5,251],["Q",252,252,254,252.5],["Q",256,253,266.5,254],["Q",277,255,278.5,255.5],["Q",280,256,291.5,257],["Q",303,258,305,258],["Q",307,258,317.5,259.5],["Q",328,261,330,261.5],["Q",332,262,342,264],["Q",352,266,353,266],["Q",354,266,364,269],["Q",374,272,376,272.5],["Q",378,273,389,276.5],["Q",400,280,401.5,280.5],["Q",403,281,415.5,282.5],["Q",428,284,430,284],["Q",432,284,444.5,285.5],["Q",457,287,459,287],["Q",461,287,471.5,288],["Q",482,289,484,289],["Q",486,289,498,289.5],["Q",510,290,512,290],["Q",514,290,524,290],["Q",534,290,536,290],["Q",538,290,548,289.5],["Q",558,289,560,288.5],["Q",562,288,573.5,287],["Q",585,286,587,285.5],["Q",589,285,600,283],["Q",611,281,613,281],["Q",615,281,624.5,279],["Q",634,277,634.5,276.5],["Q",635,276,641,274.5],["Q",647,273,648,272.5],["Q",649,272,658.5,270],["Q",668,268,669,267.5],["Q",670,267,671.5,266.5],["Q",673,266,673.5,266],["Q",674,266,675.5,265.5],["Q",677,265,677,264.5],["Q",677,264,678.5,263.5],["Q",680,263,680.5,263],["Q",681,263,682,262.5],["Q",683,262,683.5,261.5],["Q",684,261,685,260.5],["Q",686,260,686.5,260],["Q",687,260,687.5,260],["L",688,260]]},{"type":"i-text","originX":"left","originY":"top","left":146,"top":367,"width":383.28,"height":45.2,"fill":"#00d9b5","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"text":"Try out the tools below.","fontSize":40,"fontWeight":"normal","fontFamily":"Times New Roman","fontStyle":"","lineHeight":1.16,"textDecoration":"","textAlign":"left","textBackgroundColor":"","charSpacing":0,"styles":{"0":{"1":{},"2":{},"3":{},"4":{},"5":{},"6":{},"7":{},"8":{},"9":{},"10":{},"11":{},"12":{},"13":{},"14":{},"15":{},"16":{},"17":{},"18":{},"19":{},"20":{},"21":{},"22":{},"23":{},"24":{}}}},{"type":"i-text","originX":"left","originY":"top","left":282,"top":402,"width":2,"height":45.2,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"text":"","fontSize":40,"fontWeight":"normal","fontFamily":"Times New Roman","fontStyle":"","lineHeight":1.16,"textDecoration":"","textAlign":"left","textBackgroundColor":"","charSpacing":0,"styles":{}},{"type":"polygon","originX":"left","originY":"top","left":714,"top":174,"width":142,"height":134,"fill":"#00edce","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.38,"scaleY":0.38,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"points":[{"x":172,"y":206},{"x":228,"y":206},{"x":245,"y":154},{"x":263,"y":206},{"x":314,"y":206},{"x":272,"y":236},{"x":289,"y":288},{"x":245,"y":255},{"x":201,"y":287},{"x":218,"y":237}]}]}';
		canvas.loadFromJSON(JSON.parse(data), canvas.renderAll.bind(canvas));
	}

	/*
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
	*/

	//set color to color of selected object
	canvas.on("object:selected", function(e) {
		if (canvas.getActiveObject()) {
			if (typeof canvas.getActiveObject().fill === "string") {
				$("#color")[0].jscolor.fromString(canvas.getActiveObject().fill);
			}
		}
	});

	canvas.on('mouse:dblclick', function (options) {
		//console.log(options.target._objects);
		if (options.target._objects[1]) {
			var fileName = options.target._objects[1].text;
			var path = "userfiles/" + String(userid) + "/" + fileName;
			console.log(path);
			displayDownload(path);
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
		else if (mode == 5) {
			$("#file").addClass("btn-default");
			$("#file").removeClass("btn-primary");
			$("#file").popover("hide");
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
							top: 150
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
		else if (mode == 5) {
			$("#file").removeClass("btn-default");
			$("#file").addClass("btn-primary");
			$("#file").popover("show");
			$("#fileLoader").change(function(e) {
				var imgObj = new Image();
				imgObj.src = "file_image.png";

				var image = new fabric.Image(imgObj, {
					left : 0,
					top : 0,
					width : 111,
					height : 150
				});
				var text = new fabric.Text(e.target.files[0].name, {
					left : 0,
					top : 150
				});
				var group = new fabric.Group([ image, text ], {
					left : 150,
					top : 150
				});

				canvas.add(group);

				var formData = new FormData();
				formData.append('file', $('#fileLoader')[0].files[0]);

				$.ajax({
				       url : 'api.php',
				       type : 'POST',
				       data : formData,
				       processData: false,  // tell jQuery not to process the data
				       contentType: false,  // tell jQuery not to set contentType
				       success : function(data) {
				           console.log(data);
				       }
				});
				$("#fileLoader").val(null);

				modeSwitch(0);
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

	//file button
	$("#file").on("click", function() {
		if (mode == 5) {
			modeSwitch(0);
		}
		else {
			modeSwitch(5);
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
				top : options.e.layerY,
				left : options.e.layerX,
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
					top : options.e.layerY,
					left : options.e.layerX,
					width : 50,
					height : 50,
					strokeWidth : 0,
					fill : color
				});
				canvas.add(shape);
			}
			else if (selected == 2) { //circle
				var shape = new fabric.Circle({
					top : options.e.layerY,
					left : options.e.layerX,
					radius : 25,
					strokeWidth : 0,
					fill : color
				});
				canvas.add(shape);
			}
			else if (selected == 3) { //triangle
				var shape = new fabric.Triangle({
					top : options.e.layerY,
					left : options.e.layerX,
					width : 50,
					height : 50,
					strokeWidth : 0,
					fill : color
				});
				canvas.add(shape);
			}
			else if (selected == 4) { //star
				var shape = new fabric.Polygon(
                    [
                        {x: 172, y: 206},
                        {x: 228, y: 206},
                        {x: 245, y: 154},
                        {x: 263, y: 206},
                        {x: 314, y: 206},
                        {x: 272, y: 236},
                        {x: 289, y: 288},
                        {x: 245, y: 255},
                        {x: 201, y: 287},
                        {x: 218, y: 237},
                    ],
                    {
					top : options.e.layerY,
					left : options.e.layerX,
					width : 50,
					height : 50,
					strokeWidth : 0,
					fill : color
				});
				canvas.add(shape);
			}
		}
		else if (mode == 4) {

		}
		else if (mode == 5) {

		}
	});

	//initialize canvas to window size
	//canvas.setHeight(window.innerHeight);
	canvas.setHeight(5000);
	//canvas.setWidth(window.innerWidth);
	canvas.setWidth(5000);
	canvas.renderAll();

	//block right mouse menu
	$(document).contextmenu(function() {
		return false;
	});

	//mouse scrolling
	var curDown = false,
	curYPos = 0,
	curXPos = 0;

	$(window).mousemove(function(m) {
		if(curDown === true){
			$("#canvas-div").scrollTop($("#canvas-div").scrollTop() + (curYPos - m.pageY));
			$("#canvas-div").scrollLeft($("#canvas-div").scrollLeft() + (curXPos - m.pageX));
			curYPos = m.pageY;
			curXPos = m.pageX;
		}
	});

	$(window).mousedown(function(m) {
		if (m.button == 2) {
			curDown = true;
			curYPos = m.pageY;
			curXPos = m.pageX;
		}
	});

	$(window).mouseup(function() {
		curDown = false;
	});

	$('#canvas-div').bind('mousewheel DOMMouseScroll', function (e) { return false; });

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
	<div class="radio">\
		<label><input type="radio" name="optradio" value="4">Star</label>\
	</div>\
	</form>\
	');

	$("#image").popover();
	$("#image").attr("data-content", '<input type="file" id="imgLoader">');

	$("#file").popover();
	$("#file").attr("data-content", '<input type="file" id="fileLoader">');

	// save every 20 seconds
	setInterval(saveFileboard, 20000);
});
