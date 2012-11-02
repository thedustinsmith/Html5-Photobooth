var Filters = {};

Filters.grayscale = {
	name: "Grayscale",
	process: function(pixels, args) {
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
	name: "Brightness",
	properties: [{
		name: 'Brightness',
		min: -255,
		max: 255,
		defaultVal: 0
	}],
	process: function(pixels, args) {
		var adjust = args[Filters.brightness.properties[0].name] || 0;

		var d = pixels.data;
		for (var i = 0; i < d.length; i += 4) {
			d[i] += adjust;
			d[i + 1] += adjust;
			d[i + 2] += adjust;
		}

		return pixels;
	}
};

Filters.sepia = {
	name: "Sepia",
	process: function (pixels) {
		var data = pixels.data;
		var mode = 0;
		var w = pixels.width;
		var h = pixels.height;
		var w4 = w*4;
		var y = h;
		do {
			var offsetY = (y-1)*w4;
			var x = w;
			do {
				var offset = offsetY + (x-1)*4;

				if (mode) {
					// a bit faster, but not as good
					var d = data[offset] * 0.299 + data[offset+1] * 0.587 + data[offset+2] * 0.114;
					var r = (d + 39);
					var g = (d + 14);
					var b = (d - 36);
				} else {
					// Microsoft
					var or = data[offset];
					var og = data[offset+1];
					var ob = data[offset+2];

					var r = (or * 0.393 + og * 0.769 + ob * 0.189);
					var g = (or * 0.349 + og * 0.686 + ob * 0.168);
					var b = (or * 0.272 + og * 0.534 + ob * 0.131);
				}

				if (r < 0) r = 0; if (r > 255) r = 255;
				if (g < 0) g = 0; if (g > 255) g = 255;
				if (b < 0) b = 0; if (b > 255) b = 255;

				data[offset] = r;
				data[offset+1] = g;
				data[offset+2] = b;

			} while (--x);
		} while (--y);

		return pixels;
	}
};

Filters.invert = {
	name: "Invert",
	process: function (pixels, args) {
		var data = pixels.data;

		var invertAlpha = !!args.invertAlpha;
		var p = pixels.width * pixels.height;
		var pix = p*4, pix1 = pix + 1, pix2 = pix + 2, pix3 = pix + 3;

		while (p--) {
			data[pix-=4] = 255 - data[pix];
			data[pix1-=4] = 255 - data[pix1];
			data[pix2-=4] = 255 - data[pix2];
			if (invertAlpha)
				data[pix3-=4] = 255 - data[pix3];
		}

		return pixels;
	}
};

Filters.solarize = {
	name: "Solarize",
	process: function (pixels) {
		var data = pixels.data;
		var w = pixels.width;
		var h = pixels.height;
		var w4 = w*4;
		var y = h;
		do {
			var offsetY = (y-1)*w4;
			var x = w;
			do {
				var offset = offsetY + (x-1)*4;

				var r = data[offset];
				var g = data[offset+1];
				var b = data[offset+2];

				if (r > 127) r = 255 - r;
				if (g > 127) g = 255 - g;
				if (b > 127) b = 255 - b;

				data[offset] = r;
				data[offset+1] = g;
				data[offset+2] = b;

			} while (--x);
		} while (--y);
		return pixels;
}
};

Filters.edges = {
	name: "Edges",
	process: function (pixels) {
		var data = pixels.data;
		var dataCopy = new Uint8ClampedArray(data);
		var w = pixels.width;
		var h = pixels.height;

		var w4 = w * 4;
		var pixel = w4 + 4; // Start at (1,1)
		var hm1 = h - 1;
		var wm1 = w - 1;
		for (var y = 1; y < hm1; ++y) {
			// Prepare initial cached values for current row
			var centerRow = pixel - 4;
			var priorRow = centerRow - w4;
			var nextRow = centerRow + w4;
			
			var r1 = - dataCopy[priorRow]   - dataCopy[centerRow]   - dataCopy[nextRow];
			var g1 = - dataCopy[++priorRow] - dataCopy[++centerRow] - dataCopy[++nextRow];
			var b1 = - dataCopy[++priorRow] - dataCopy[++centerRow] - dataCopy[++nextRow];
			
			var rp = dataCopy[priorRow += 2];
			var gp = dataCopy[++priorRow];
			var bp = dataCopy[++priorRow];
			
			var rc = dataCopy[centerRow += 2];
			var gc = dataCopy[++centerRow];
			var bc = dataCopy[++centerRow];
			
			var rn = dataCopy[nextRow += 2];
			var gn = dataCopy[++nextRow];
			var bn = dataCopy[++nextRow];
			
			var r2 = - rp - rc - rn;
			var g2 = - gp - gc - gn;
			var b2 = - bp - bc - bn;
			
			// Main convolution loop
			for (var x = 1; x < wm1; ++x) {
				centerRow = pixel + 4;
				priorRow = centerRow - w4;
				nextRow = centerRow + w4;
				
				var r = 127 + r1 - rp - (rc * -8) - rn;
				var g = 127 + g1 - gp - (gc * -8) - gn;
				var b = 127 + b1 - bp - (bc * -8) - bn;
				
				r1 = r2;
				g1 = g2;
				b1 = b2;
				
				rp = dataCopy[  priorRow];
				gp = dataCopy[++priorRow];
				bp = dataCopy[++priorRow];
				
				rc = dataCopy[  centerRow];
				gc = dataCopy[++centerRow];
				bc = dataCopy[++centerRow];
				
				rn = dataCopy[  nextRow];
				gn = dataCopy[++nextRow];
				bn = dataCopy[++nextRow];
				
				r += (r2 = - rp - rc - rn);
				g += (g2 = - gp - gc - gn);
				b += (b2 = - bp - bc - bn);

				if (r > 255) r = 255;
				if (g > 255) g = 255;
				if (b > 255) b = 255;
				if (r < 0) r = 0;
				if (g < 0) g = 0;
				if (b < 0) b = 0;

				data[pixel] = r;
				data[++pixel] = g;
				data[++pixel] = b;
				//data[++pixel] = 255; // alpha

				pixel+=2;
			}
			pixel += 8;
		}
		return pixels;
	}
};

Filters.blur = {
	name: "Blur",
	process: function (pixels) {
		/*
		var data = pixels.data;
		var dataCopy = new Uint8ClampedArray(data);
		var amount = parseFloat(10) || 0;

		amount = Math.max(0,Math.min(5,amount));

		var rect = params.options.rect;

		var ctx = params.canvas.getContext("2d");
		ctx.save();
		ctx.beginPath();
		ctx.rect(rect.left, rect.top, rect.width, rect.height);
		ctx.clip();

		var scale = 2;
		var smallWidth = Math.round(params.width / scale);
		var smallHeight = Math.round(params.height / scale);

		var copy = document.createElement("canvas");
		copy.width = smallWidth;
		copy.height = smallHeight;

		var steps = Math.round(amount * 20);

		var copyCtx = copy.getContext("2d");
		for (var i=0;i<steps;i++) {
			var scaledWidth = Math.max(1,Math.round(smallWidth - i));
			var scaledHeight = Math.max(1,Math.round(smallHeight - i));

			copyCtx.clearRect(0,0,smallWidth,smallHeight);

			copyCtx.drawImage(
				params.canvas,
				0,0,params.width,params.height,
				0,0,scaledWidth,scaledHeight
			);

			ctx.drawImage(
				copy,
				0,0,scaledWidth,scaledHeight,
				0,0,params.width,params.height
			);
		}

		ctx.restore();
		return pixels;
		*/
	}
};

Filters.adjustcolors = {
	name: "Adjust Colors",
	properties: [
		{
			name: 'Red',
			min: -255,
			max: 255,
			defaultVal: 0
		},
		{
			name: 'Green',
			min: -255,
			max: 255,
			defaultVal: 0
		},
		{
			name: 'Blue',
			min: -255,
			max: 255,
			defaultVal: 0
		}
	],
	process: function (pixels, args) {
		var red = parseInt(args['Red'], 10);
		var green = parseInt(args['Green'], 10);
		var blue = parseInt(args['Blue'], 10);

		var data = pixels.data;
		var p = pixels.width * pixels.height;
		var pix = p*4, pix1, pix2;

		var r, g, b;
		while (p--) {
			pix -= 4;

			if (red) {
				if ((r = data[pix] + red) < 0 ) 
					data[pix] = 0;
				else if (r > 255 ) 
					data[pix] = 255;
				else
					data[pix] = r;
			}

			if (green) {
				if ((g = data[pix1=pix+1] + green) < 0 ) 
					data[pix1] = 0;
				else if (g > 255 ) 
					data[pix1] = 255;
				else
					data[pix1] = g;
			}

			if (blue) {
				if ((b = data[pix2=pix+2] + blue) < 0 ) 
					data[pix2] = 0;
				else if (b > 255 ) 
					data[pix2] = 255;
				else
					data[pix2] = b;
			}
		}
		return pixels;
	}
};

Filters.hsl = {
	name: "HSL",
	properties: [
		{
			name: 'Hue',
			min: -180,
			max: 180,
			defaultVal: 0
		},
		{
			name: 'Saturation',
			min: -100,
			max: 100,
			defaultVal: 0
		},
		{
			name: 'Lightness',
			min: -100,
			max: 100,
			defaultVal: 0
		}
	],
	process: function(pixels, args) {
		var hue = parseInt(args['Hue'],10)||0;
		var saturation = (parseInt(args['Saturation'],10)||0) / 100;
		var lightness = (parseInt(args['Lightness'],10)||0) / 100;


		// this seems to give the same result as Photoshop
		if (saturation < 0) {
			var satMul = 1+saturation;
		} else {
			var satMul = 1+saturation*2;
		}

		hue = (hue%360) / 360;
		var hue6 = hue * 6;

		var rgbDiv = 1 / 255;

		var light255 = lightness * 255;
		var lightp1 = 1 + lightness;
		var lightm1 = 1 - lightness;

		var data = pixels.data;
		var p = pixels.width * pixels.height;
		var pix = p*4, pix1 = pix + 1, pix2 = pix + 2, pix3 = pix + 3;

		while (p--) {

			var r = data[pix-=4];
			var g = data[pix1=pix+1];
			var b = data[pix2=pix+2];

			if (hue != 0 || saturation != 0) {
				// ok, here comes rgb to hsl + adjust + hsl to rgb, all in one jumbled mess. 
				// It's not so pretty, but it's been optimized to get somewhat decent performance.
				// The transforms were originally adapted from the ones found in Graphics Gems, but have been heavily modified.
				var vs = r;
				if (g > vs) vs = g;
				if (b > vs) vs = b;
				var ms = r;
				if (g < ms) ms = g;
				if (b < ms) ms = b;
				var vm = (vs-ms);
				var l = (ms+vs)/510;
				if (l > 0) {
					if (vm > 0) {
						if (l <= 0.5) {
							var s = vm / (vs+ms) * satMul;
							if (s > 1) s = 1;
							var v = (l * (1+s));
						} else {
							var s = vm / (510-vs-ms) * satMul;
							if (s > 1) s = 1;
							var v = (l+s - l*s);
						}
						if (r == vs) {
							if (g == ms)
								var h = 5 + ((vs-b)/vm) + hue6;
							else
								var h = 1 - ((vs-g)/vm) + hue6;
						} else if (g == vs) {
							if (b == ms)
								var h = 1 + ((vs-r)/vm) + hue6;
							else
								var h = 3 - ((vs-b)/vm) + hue6;
						} else {
							if (r == ms)
								var h = 3 + ((vs-g)/vm) + hue6;
							else
								var h = 5 - ((vs-r)/vm) + hue6;
						}
						if (h < 0) h+=6;
						if (h >= 6) h-=6;
						var m = (l+l-v);
						var sextant = h>>0;
						if (sextant == 0) {
							r = v*255; g = (m+((v-m)*(h-sextant)))*255; b = m*255;
						} else if (sextant == 1) {
							r = (v-((v-m)*(h-sextant)))*255; g = v*255; b = m*255;
						} else if (sextant == 2) {
							r = m*255; g = v*255; b = (m+((v-m)*(h-sextant)))*255;
						} else if (sextant == 3) {
							r = m*255; g = (v-((v-m)*(h-sextant)))*255; b = v*255;
						} else if (sextant == 4) {
							r = (m+((v-m)*(h-sextant)))*255; g = m*255; b = v*255;
						} else if (sextant == 5) {
							r = v*255; g = m*255; b = (v-((v-m)*(h-sextant)))*255;
						}
					}
				}
			}

			if (lightness < 0) {
				r *= lightp1;
				g *= lightp1;
				b *= lightp1;
			} else if (lightness > 0) {
				r = r * lightm1 + light255;
				g = g * lightm1 + light255;
				b = b * lightm1 + light255;
			}

			if (r < 0) 
				data[pix] = 0
			else if (r > 255)
				data[pix] = 255
			else
				data[pix] = r;

			if (g < 0) 
				data[pix1] = 0
			else if (g > 255)
				data[pix1] = 255
			else
				data[pix1] = g;

			if (b < 0) 
				data[pix2] = 0
			else if (b > 255)
				data[pix2] = 255
			else
				data[pix2] = b;

		}

		return pixels;
	}
};