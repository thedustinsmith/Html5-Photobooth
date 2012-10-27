var Filters = {};

Filters.grayscale = {
	filter: function(pixels, args) {
		var d = pixels.data;
		for (var i = 0; i < d.length; i += 4) {
			var r = d[i],
				g = d[i + 1],
				b = d[i + 2];

			var gs = (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
			d[i] = d[i+1] = d[i+2] = gs;
		}

		return pixels;
	}
};

Filters.brightness = {
	hasValue: true,
	min: -255,
	max: 255,
	defaultValue: 0,
	filter: function(pixels, adjust) {
		adjust = adjust || 10;

		var d = pixels.data;
		for (var i = 0; i < d.length; i += 4) {
			d[i] += adjust;
			d[i + 1] += adjust;
			d[i + 2] += adjust;
		}

		return pixels;
	}
};