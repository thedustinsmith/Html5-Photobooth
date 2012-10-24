$(function() {

	var camera = new Camera({
		container: $("#video-container")
	});


	var pictureHolder = $("#pic-holder"),
  		picTemplate = "<div class='pic-wrap' style='-webkit-transform:rotate(<%- rotate %>deg);'><img src='<%- src %>' /></div>";

	var counter = $("#counter");
	function countdown (count, callback) {
		if (count === 0){
			callback();
			return;
		}

		counter.html(count);
		count--;
		setTimeout(function() {
			countdown(count, callback);
		}, 1000)
	};

	$("#take-pic").on('click', function(e) {
		e.preventDefault();

		counter.show();
		countdown(3, function() {
			counter.hide();
			camera.takePicture({}, function(picture) {
				var picOpts = {
					src: picture,
					rotate: Math.floor(Math.ceil(Math.random() * 30) * ((Math.random() * 2) - 1))
				};
				var pic = $(_.template(picTemplate, picOpts)).appendTo(pictureHolder);
			});
		})
	});
});
