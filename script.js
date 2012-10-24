$(function() {
	

	var camera = new Camera({
		container: $("#video-container")
	});




	/*
	var video = $("#video-element"),
		pictureHolder = $("#pic-holder"),
		pictureSource = video;

	function init(stream){
		camstream = stream;
	};

	function videoPlaceholder(){
		var replacementImg = $("<img />").attr("src", "me.jpg").css({
			width: 500,
			height: 400
		});
		video.replaceWith(replacementImg);
		pictureSource = replacementImg;
	}

	var camera = new Camera({
		onInit: init,
		onInitError: videoPlaceholder
	});

  var picTemplate = "<div class='pic-wrap' style='-webkit-transform:rotate(<%- rotate %>deg);'><img src='<%- src %>' /></div>";

	$("#take-pic").click(function(e){
		e.preventDefault();
		var source = pictureSource[0];

		camera.takePicture(pictureSource[0], Filters.mustache, function(picture) {
		var picOpts = {
			src: picture,
			rotate: Math.floor(Math.ceil(Math.random() * 30) * ((Math.random() * 2) - 1))
		};
		var pic = $(_.template(picTemplate, picOpts)).appendTo(pictureHolder);
		});
	});
	$("#add-mustache").click(function() {
		$("#mustache").toggle();
	});
*/
});
