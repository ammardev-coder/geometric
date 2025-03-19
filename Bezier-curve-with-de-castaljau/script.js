const canvas = document.getElementById("bezierCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 400;

// Initializing..................
let points = [
    { x: 100, y: 300 },
    { x: 200, y: 100 },
    { x: 400, y: 100 },
    { x: 500, y: 300 }
];

let draggingPoint = null;

// Applying the De Casteljaus Algorithm for Bezier Curve
function bezier(t, p0, p1, p2, p3) {
    let pA = { x: (1 - t) * p0.x + t * p1.x, y: (1 - t) * p0.y + t * p1.y };
    let pB = { x: (1 - t) * p1.x + t * p2.x, y: (1 - t) * p1.y + t * p2.y };
    let pC = { x: (1 - t) * p2.x + t * p3.x, y: (1 - t) * p2.y + t * p3.y };
    let pD = { x: (1 - t) * pA.x + t * pB.x, y: (1 - t) * pA.y + t * pB.y };
    let pE = { x: (1 - t) * pB.x + t * pC.x, y: (1 - t) * pB.y + t * pC.y };
    return { x: (1 - t) * pD.x + t * pE.x, y: (1 - t) * pD.y + t * pE.y };
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw control polygon 
    ctx.strokeStyle = "#aaa";
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    
    // Draw Bezier curve
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let t = 0; t <= 1; t += 0.01) {
        let p = bezier(t, ...points);
        ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    
    // Draw control points
    ctx.fillStyle = "red";
    for (let p of points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fill();
    }
}

draw();

// Mouse events for darging the cps
canvas.addEventListener("mousedown", (e) => {
    let mx = e.offsetX, my = e.offsetY;
    for (let p of points) {
        if (Math.hypot(mx - p.x, my - p.y) < 10) {
            draggingPoint = p;
            break;
        }
    }
});

canvas.addEventListener("mousemove", (e) => {
    if (draggingPoint) {
        draggingPoint.x = e.offsetX;
        draggingPoint.y = e.offsetY;
        draw();
    }
});

canvas.addEventListener("mouseup", () => {
    draggingPoint = null;
});
