$(document).ready(function() {
	var canvas = new fabric.Canvas('canvas');
	
	canvas.backgroundColor = new fabric.Pattern({source: "grid_1.png"});
	
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
		if (e.target.left < 0) {
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
	$("button").on("click", function() {
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
	
	//deleting
	$("html").keyup(function(e) {
		if(e.keyCode == 8 || e.keyCode == 46) {
			canvas.remove(canvas.getActiveObject());
		}
	});  
	
	function resizeCanvas() {
	canvas.setHeight(window.innerHeight);
	canvas.setWidth(window.innerWidth);
	canvas.renderAll();
	}
	
	resizeCanvas(); //init
});