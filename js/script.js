$(function() {

	window.camera = new Camera({
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

	var currentVid = [];
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
		var buffer = [];
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
			var b = Util.dataURLToBlob(frame);
			blobs.push(b);
		}
		console.log(blobs);
		for(var b in blobs) {
			console.log("in this thing");
			reader.readAsArrayBuffer(b);
		}
		callback();
	};

	$("#record-vid").on('click', function (e) {
		$('body').toggleClass('recording');
		isRecording = true;
		camera.takePicture({}, function(pic) {
			record(pic);
		});
	});

	function doSomethingWithVideo() {
		console.log("doing something with video");
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
});
