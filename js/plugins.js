if (!Date.now) {
	Date.prototype.now = function() {
		return +new Date;
	};
}