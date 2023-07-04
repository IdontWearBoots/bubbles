let canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 5;
canvas.height = window.innerHeight - 5;
// transform into cartesian plane
ctx.translate(canvas.width / 2, canvas.height / 2);

// set to true if you want multicoloured bubbles
let colors = false;

const backgroundColor = "#07060E";

// Bubble stuffs
const maxBubbleSize = 70;
const minBubbleSize = 10;
const bubbleColor = "#8bc9ee";
let bubbles = [];
let splashLines = [];

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

document.addEventListener("keydown", (event) => {
    if(event.key === "c")
        colors = !colors;
});

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
    for(let i = bubbles.length - 1; i >= 0; i--) {
        let bubble = bubbles[i];
        // checks if the click was on the bubble
        if((mouse.currPos.x - bubble.x) ** 2 + (mouse.currPos.y - bubble.y) ** 2 < bubble.radius ** 2) {
            // pop bubble and exit for loop (only one bubble popped at a time)
            bubble.pop();
            popped = true;
            break;
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
                    mouse.currPos.x, mouse.currPos.y, randInt(maxBubbleSize, minBubbleSize), 
                    colors ? randCol() : bubbleColor, mouse.mouvement,
                )
            );

        }, 50);
    }
});

function drawBubbles() {
    // An array which contains the indexes in the bubbles array of all of the popped bubbles 
    let indexesOfPoppedBubbles = [];
    
    for(let i = 0; i < bubbles.length; i++) {
        let bubble = bubbles[i];
    
        // add the index to the popped bubbles array 
        if(bubble.popped) {
            indexesOfPoppedBubbles.push(i);
            continue;
        }
    
        // update bubble pos and draw
        bubble.move();
        bubble.draw();
    
        // if bubble is out of view, pop it
        if(canvas.width / 2 < bubble.x - bubble.radius - 5 || bubble.x + bubble.radius + 5 < -canvas.width / 2) {
            bubble.pop();
        }
        if(canvas.height / 2 < bubble.y - bubble.radius - 5 || bubble.y + bubble.radius + 5 < -canvas.height / 2) {
            bubble.pop();
        }
    }
    
    for(let j = 0; j < indexesOfPoppedBubbles.length; j++) {
        // loop through each of the indexes, seeing as though the bubbles array is modified
        // we must recalculate what the new index will be: oldIndex - amountOfRemovedElems
        const i = indexesOfPoppedBubbles[j] - j;
        // then remove the popped bubble
        bubbles.splice(i, 1);
    }
}

function drawSplashLines() {
    // same as indexesOfPoppedBubbles in drawBubbles()
    let indexesOfEmptyLines = [];
    
    ALL_LINES_LOOP:
    for(let i = 0; i < splashLines.length; i++) {
        let lines = splashLines[i];
        for(let line of lines) {
            // if the line has been drawn over 25 times, it must be deleted and so index added to array
            if(line.lengthModifiedCount > 25) {
                indexesOfEmptyLines.push(i);
                continue ALL_LINES_LOOP;
            }
            // else, make the line smaller (creating shrinking effect) and draw
            line.length = line.length * 0.75;
            line.length = Math.round(line.length);
            line.draw();
        }
    }
    // same as for indexesOfPoppedBubbles in drawBubbles()
    for(let j = 0; j < indexesOfEmptyLines.length; j++) {
        const i = indexesOfEmptyLines[j] - j;
        splashLines.splice(i, 1);
    }
}

function simulate() {
    // empty canvas for new frame
    ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    // draw everything
    drawBubbles();
    drawSplashLines();

    // new frame
    requestAnimationFrame(simulate);
}

simulate();