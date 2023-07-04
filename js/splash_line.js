class SplashLine {
    /**
     * Creates SplashLine object which serves to draw the splash lines when you pop a bubble
     * @param {Integer} x x coordinate
     * @param {Integer} y y coordinate
     * @param {Integer} length line length
     * @param {Float} angle angle in radians at which the line is rotated
	 * @param {String} color color of the lines (matches the bubble color)
     */
	constructor(x, y, length, angle, color) {
  		this.x = x;
      	this.y = y;
        // the coodinates of the end of the line, calculated in advance because of trig
	  	this.endX = this.x + length * Math.cos(angle);
		this.endY = this.y + length * Math.sin(angle);
      	this.len = length;
      	this.angle = angle;
		this.color = color;
        // counts the amount of times the length has been modified
        this.lengthModifiedCount = 0;
  	}
	get length() {
		return this.len;
	}
	set length(x) {
		// if you modify the length of the line, you have to recalculate all the coodinates
		this.len = x;
		this.x = this.endX - this.len * Math.cos(this.angle);
		this.y = this.endY - this.len * Math.sin(this.angle);
        this.lengthModifiedCount++;
    }
  	draw() {
  		ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
		// draws line from end to beginning (not best aproach but all i could do)
    	ctx.moveTo(this.endX, this.endY);
    	ctx.lineTo(this.x, this.y);
    	ctx.stroke();
  	}
}
