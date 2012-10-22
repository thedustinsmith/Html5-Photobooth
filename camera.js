var Camera = function(opts){
	var defaults = {
		initError: $.noop,
		init: $.noop
	};
	
	var options = $.extend({}, defaults, opts);

	var supportsUserMedia = !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

	if (!supportsUserMedia) {
		options.initError("Device does not support user media");
		return;
	} 

	var customGetUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

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

	var stream;
	var pictureCanvas = document.createElement("canvas");
	var pictureContext = pictureCanvas.getContext('2d');

	navigator.getUserMedia({video: true, audio: false}, function(sourceStream) {
		stream = sourceStream;
		options.init(sourceStream);
	}, function(e) {
		options.initError('Permission to camera denied');
	});

	this.takePicture = function(video, filter) {
		if(!stream){
			return;
		}

		$(pictureCanvas).attr("width", $(video).css('width')).attr("height", $(video).css("height"));
		pictureContext.drawImage(video, 0, 0);

		if (filter) {
			filter(pictureContext, {});
		}

		var picUrl = pictureCanvas.toDataURL('image/png');

		return picUrl;
	};

	return this;
};