$(function() {
	var pictureHolder = $("#pic-holder"),
		counter = $("#counter"),
		picTemplate = "<div class='pic-wrap' style='-webkit-transform:rotate(<%- rotate %>deg);'><img src='<%- src %>' /></div>";

	var filterControl = $("#filter-control");

	window.currentFilter = currentFilter = $.noop;
	window.currentFilterArgs = currentFilterArgs = {};

	var countdown = function (count, callback) {
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
	

	$("body").addClass("video-mode");

	window.camera = camera = new Camera({
		container: $("#video-container")
	});

	$("#take-pic").on('click', function(e) {
		e.preventDefault();
		var btn = $(this);
		if(btn.is(".disabled")) {
			return;
		}

		btn.addClass('disabled');
		counter.show();
		countdown(3, function() {
			counter.hide();
			btn.removeClass('disabled');
			camera.takePicture({}, function(picture) {
				var picOpts = {
					src: picture,
					rotate: Math.floor(Math.ceil(Math.random() * 30) * ((Math.random() * 2) - 1))
				};
				var pic = $(_.template(picTemplate, picOpts)).appendTo(pictureHolder);
			});
		})
	});

	window.applyFilter = applyFilter = function () {
		camera.applyFilter(currentFilter, currentFilterArgs);
	}

	$("#filter-toggle").on('click', function(e){
		e.preventDefault();
		$("#filter-wrapper").toggleClass("collapsed");
	});

	$("#pic-holder,#video-container").on('click', function(ev) {
		var isAlbumMode = $("body").is(".album-mode") && $(ev.target).closest('#video-container').length > 0;
		var isVideoMode = $("body").is(".video-mode") && $(ev.target).closest("#pic-holder").length > 0;

		$("body").toggleClass('video-mode', !isVideoMode).toggleClass('album-mode', !isAlbumMode);
	});

	FilterView.initialize();
	$(FilterView).on("filterChange", function(ev, filter) {
		currentFilter = filter.process;
		currentFilterArgs = {};
		applyFilter();
	});

	$(FilterView).on("filterValueChange", function(ev, args) {
		$.extend(currentFilterArgs, args);
		applyFilter();
	});
});
