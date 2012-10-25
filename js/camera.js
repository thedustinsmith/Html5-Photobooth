var Camera = function(opts){
	var defaults = {
		container: $("<div id='camera-wrapper' />"),
		width: 640,
		height: 480,
		scale: 1,
		mirror: true,
		onInitError: $.noop,
		onInit: $.noop
	};
	
	this.options = options = $.extend({}, defaults, opts);
	var supportsUserMedia = !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
	if (!supportsUserMedia) {
		options.initError("Device does not support user media");
		return;
	} 

	if (!navigator.getUserMedia && navigator.webkitGetUserMedia) {
		navigator.getUserMedia = navigator.webkitGetUserMedia;
	} 
	else if (!navigator.getUserMedia && navigator.mozGetUserMedia) {
		navigator.getUserMedia = navigator.mozGetUserMedia;
	} 
	else if (!navigator.getUserMedia && navigator.msGetUserMedia) {
		navigator.getUserMedia = navigator.msGetUserMedia;
	} 

	if (!window.URL && window.webkitURL) {
		window.URL = window.webkitURL;
	}

	var stream,
		videoElement = document.createElement("video"),
		videoCanvas = document.createElement("canvas"),
		videoContext = videoCanvas.getContext('2d'),
		pictureCanvas = document.createElement("canvas"),
		pictureContext = pictureCanvas.getContext('2d'),
		container = $(options.container);

	if (!container.closest('html').length) {
		$("body").append(container);
	}
	container.append($(videoCanvas));
	videoCanvas.width = options.width;
	videoCanvas.height = options.height;
	videoElement.autoplay = true;

	var last = 0;
	var refreshRate = $("#refresh-rate");
	var debugMirror = $("#debug-mirror");
	var paused = false;
	var first = true;
	var updateCallback = function () {
		if (paused || videoElement.paused || videoElement.ended) {
			return;
		}

		refreshRate.html(Date.now() - last);
		last = Date.now();

		if(!first) {
			videoContext.save();
		}

		if (options.mirror) {
			debugMirror.html("yep");
			videoContext.scale(-1, 1);
			videoContext.translate(-1 * videoElement.width, 0);
		}
		else {
			debugMirror.html("nope");
		}
		videoContext.drawImage(videoElement, 0, 0);
		videoContext.restore();
		first = false;
		setTimeout(function() {
			updateCallback();
		}, 0);
	};

	navigator.getUserMedia({video: true, audio: false}, function(sourceStream) {
		sourceStream;
		$(videoElement).attr("src", window.URL.createObjectURL(sourceStream));
		//options.onInit(sourceStream);
	}, function(e) {
		options.onInitError('No access to camera');
	});

	videoElement.addEventListener("play", function(){
		last = Date.now();
		updateCallback();
	});

	this.takePicture = function (filter, callback) {
		callback(videoCanvas.toDataURL('image/png'));
	};

	this.setOption = function (option, value) {
		this.options[option] = value;
	};

	this.pause = function(){
		paused = true;
	};

	this.play = function() {
		paused = false;
	}

	return this;
};