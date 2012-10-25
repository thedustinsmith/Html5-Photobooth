if (!Date.now) {
	Date.prototype.now = function() {
		return +new Date;
	};
}

Uint8Array.prototype.concat = function(value) {
	var thisLength = this.byteLength;
	var retArray = new Uint8Array(thisLength + value.byteLength);

	retArray.set(this);
	retArray.set(value, thisLength);

	return retArray;
};