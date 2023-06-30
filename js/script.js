let canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 5;
canvas.height = window.innerHeight - 5;
// transform into cartesian plane
ctx.translate(canvas.width / 2, canvas.height / 2);

// set to true if you want multicoloured bubbles
const colors = false;

const backgroundColor = "#07060E";

// Bubble stuffs
const maxBubbleSize = 70;
const minBubbleSize = 10;
const bubbleColor = "#8bc9ee";
let bubbles = [];

let mouse = {
    prevPos: {x: 0, y: 0},
    currPos: {x: 0, y: 0},
    // vector between last and current mouse position
    mouvement: {x: 0, y: 0},
    down: true
}

const randInt = (max, min) => Math.round((Math.random() * (max - min)) + min);
// random hex color
const randCol = () => 
    `#${(randInt(0, 255)).toString(16)}${(randInt(0, 255)).toString(16)}${(randInt(0, 255)).toString(16)}`

document.addEventListener("mouseup", () => {mouse.down = false});

document.addEventListener("mousemove", (event) => {
    mouse.prevPos = {...mouse.currPos};
    // figure out where on the cartesian plane the mouse coordinates are
    mouse.currPos.x = event.clientX - Math.round(window.innerWidth / 2);
    mouse.currPos.y = event.clientY - Math.round(window.innerHeight / 2);
    mouse.mouvement = Vector2.from(mouse.prevPos, mouse.currPos);
});

document.addEventListener("mousedown", (event) => {
    mouse.down = true;

    let popped = false;
    for(let bubble of bubbles) {
        // checks if the click was on the bubble
        if((mouse.currPos.x - bubble.x) ** 2 + (mouse.currPos.y - bubble.y) ** 2 < bubble.radius ** 2) {
            // TODO: find a better way of popping the bubbles, else they stay in memory but aren't drawn
            bubble.pop();
            popped = true;
        }
    }

    // if none were popped then we are creating bubbles
    if(!popped) {
        // while loop doesn't work because blocks the single thread, so setInterval is used instead
        // also serves as a way to control how fast / slow they spawn
        const iId = setInterval(() => {
            // if mouse released, stop spawning the bubbles
            if(!mouse.down) clearInterval(iId);

            bubbles.push(
                new Bubble(
                    randInt(maxBubbleSize, minBubbleSize), colors ? randCol() : bubbleColor, 
                    mouse.mouvement, mouse.currPos.x, mouse.currPos.y
                )
            );

        }, 50);
    }
});

function simulate() {
    // empty canvas for new frame
    ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    let i = 0;
    for(let bubble of bubbles) {
        // temporary optimisation
        if(bubble.popped) continue;

        bubble.move();
        bubble.draw();

        // if bubble is out of view, remove it from list of bubbles
        if(canvas.width / 2 < bubble.x - bubble.radius - 5 || bubble.x + bubble.radius + 5 < -canvas.width / 2) {
            bubbles.splice(i, 1);
        }
        if(canvas.height / 2 < bubble.y - bubble.radius - 5 || bubble.y + bubble.radius + 5 < -canvas.height / 2) {
            bubbles.splice(i, 1);
        }
        i++;
    }

    requestAnimationFrame(simulate);
}

simulate();