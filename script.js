$(function() {
	
	var video = $("#video-element"),
		pictureHolder = $("#pic-holder"),
		camstream;

	function init(stream){
		video.attr("src", window.URL.createObjectURL(stream));
		camstream = stream;
	};

	var camera = new Camera({
		init: init
	});

  var picTemplate = "<div class='pic-wrap' style='-webkit-transform:rotate(<%- rotate %>deg);'><img src='<%- src %>' /></div>";

	$("#take-pic").click(function(e){
		e.preventDefault();
		var picture = camera.takePicture(video[0], Filters.mustache);

		var picOpts = {
            src: picture,
            rotate: Math.floor(Math.ceil(Math.random() * 30) * ((Math.random() * 2) - 1))
          };
      var pic = $(_.template(picTemplate, picOpts)).appendTo(pictureHolder);

	});
	$("#add-mustache").click(function() {
		$("#mustache").toggle();
    });
});
