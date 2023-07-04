class Bubble {
    /**
     * Creates a bubble object which can be drawn on the canvas
     * @param {Integer} radius The bubbles Radius
     * @param {String} color The bubble's colour
     * @param {Vector2} movementVec The vector defining the bubble's mouvement
     * @param {Integer} x X position
     * @param {Integer} y Y position
     */
    constructor(x, y, radius, color, movementVec) {
        this.radius = radius;
        this.color = color;
        // .sqaush(100) because the movement may be too pronounced 
        this.movementVector = movementVec.squash(100);
        this.x = x;
        this.y = y;
        // start angle for the bubble's shine 
        this.shineAngle = Math.random() * 2 * Math.PI;
        this.popped = false;
    }
    draw() {
        if(this.popped) return;
        
        // The actual bubble, filled in background color so as to have layering of bubbles
        ctx.beginPath();
        ctx.fillStyle = backgroundColor;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();        

        // the bubble reflection / shine thingy
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius - this.radius / 4, 0, Math.PI * 1.5, true);
        ctx.stroke();
    }
    pop() {
        // TODO: pop animation
        this.popped = true;

        // add to the splashLines array the bubbles splashlines 
        splashLines.push([
            new SplashLine(this.x - this.radius, this.y - this.radius, -this.radius, Math.PI / 3),
            new SplashLine(this.x - this.radius - 5, this.y, -this.radius, 0),
            new SplashLine(this.x - this.radius, this.y + this.radius, -this.radius, -Math.PI / 3),
            new SplashLine(this.x + this.radius, this.y - this.radius, -this.radius, 2 * Math.PI / 3),
            new SplashLine(this.x + this.radius + 5, this.y, -this.radius, Math.PI),
            new SplashLine(this.x + this.radius, this.y + this.radius, -this.radius, 4 * Math.PI / 3)
        ]);
    }
    move() {
        // Move the Bubble's positions
        this.x += this.movementVector.x;
        this.y += this.movementVector.y;

        // so as to have that look of randomness in the movement
        if(Math.random() > 0.05) {
            this.movementVector.twitch();
        }
    }
}