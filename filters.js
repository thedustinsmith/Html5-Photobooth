var Filters = {
	mustache: function(ctx, callback) {
		var x = 150,
			y = 200,
			img = new Image();

		img.src = 'mustache.png';
		img.onload = function() {
			ctx.drawImage(img, x, y);
			callback();
		};
	}
};
