$(function() {

	$("body").addClass("video-mode");
	window.camera = camera = new Camera({
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

	$("#filter-selector").on('click', 'button', function() {
		console.log($(this).data('filter'));
		var filter = Filters[$(this).data('filter')];
		
		camera.applyFilter(Filters[$(this).data("filter")]);
	});		


	$("#pic-holder,#video-container").on('click', function(ev) {
		var isAlbumMode = $("body").is(".album-mode") && $(ev.target).closest('#video-container').length > 0;
		var isVideoMode = $("body").is(".video-mode") && $(ev.target).closest("#pic-holder").length > 0;

		$("body").toggleClass('video-mode', !isVideoMode).toggleClass('album-mode', !isAlbumMode);
	});

	/* Video stuff 
	* I have it taking pictures for frames, and then I'm getting blobs from those data urls
	* I'm then trying to concatenate those blobs into a buffer, but apparently that's not going to work
	*/
	/*var currentVid = [];
	var isRecording = false;
	function record(frame) {
		if (!isRecording) {
			return;
		}

		currentVid.push(frame);
		camera.takePicture({}, function(pic){
			setTimeout(function() {
				record(pic);
			}, 0);
		});
	};

	function convertImagesToVideo (frames, callback) {
		var buffer = new Uint8Array(0);
		var blobs = [];
		var reader = new FileReader();
		reader.onerror = function(er) {
			console.log('error', er);
		};
		reader.onload = function(evt) {
			console.log("loadthingy");
		};
		reader.onprogress = function(pro) {
			console.log(pro);
		};
		reader.onloadend = function (bytes) {
			console.log(bytes);
		};

		for(var frame in frames) {
			var b = Util.dataURLToBlob(frames[frame]);

			var isLast = frame === frames.length - 1;
			Util.fileToArrayBuffer(b, function(h) {
				buffer = buffer.concat(h);
				//callback(buffer);
			});
		}

		setTimeout(function() { callback(buffer) }, 5000);
	};

	$("#record-vid").on('click', function (e) {
		$('body').toggleClass('recording');
		isRecording = true;
		camera.takePicture({}, function(pic) {
			record(pic);
		});
	});

	function doSomethingWithVideo(buffer) {

		console.log("doing something with video", buffer);

		var blob = Util.arrayBufferToBlob(buffer);
		var replayUrl = window.webkitURL.createObjectURL(blob);
		console.log(replayUrl);

		$("<video autoplay />").appendTo("body").attr("src", replayUrl);
	};

	$("#stop-record-vid").on('click', function (e) {
		$('body').toggleClass('recording');
		isRecording = false;
		var vid = currentVid;

		setTimeout(function() {
			convertImagesToVideo(vid, doSomethingWithVideo);
		}, 0);

		currentVid = [];
	});
*/
});
