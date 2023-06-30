class Vector2 {
    /**
     * Creates a Vector2 Object which can be used with Bubble object to describe its movement
     * @param {Integer} x X value
     * @param {Y} y Y value
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    // Change the values by a small amount, had no other name for it lol
    twitch() {
        this.x += (Math.random() * 2 - 1) / 100;
        this.y += (Math.random() * 2 - 1) / 100;
        return this;
    }
    // divide the values by some amount, effectively squishing them (?)
    squash(k) {
        this.x /= k;
        this.y /= k;
        return this;
    }

    /**
     * Forms a vector from one point to the next 
     * @param {Vector2} point1 first point's positional vector
     * @param {Vector2} point2 second point's positional vector
     * @returns {Vector2} the vector from the first to the second point
     */
    static from(point1, point2) {
        return new Vector2(point2.x - point1.x, point2.y - point1.y);
    }
}