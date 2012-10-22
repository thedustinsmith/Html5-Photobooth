var Filters = {
	mustache: function (context, opts) {
		var x = opts.x || 0;
		var y = opts.y || 0;

		var img = new Image();
		img.src = 'mustache.png';
		img.width = 200;
		img.onload = function() {
			console.log()
			context.drawImage(img, x, y);
		};
	}
};