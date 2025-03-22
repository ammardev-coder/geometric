const canvas = document.getElementById("bezierCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 400;

// Initialization
let points = [
    { x: 100, y: 300 },
    { x: 200, y: 100 },
    { x: 400, y: 100 },
    { x: 500, y: 300 }
];

let draggingPoint = null;

// Applying the De Casteljau's Algorithm for Bezier Curve with arbitrary points
function deCasteljau(t, points) {
    let newPoints = points.map(p => ({ ...p }));
    while (newPoints.length > 1) {
        let temp = [];
        for (let i = 0; i < newPoints.length - 1; i++) {
            temp.push({
                x: (1 - t) * newPoints[i].x + t * newPoints[i + 1].x,
                y: (1 - t) * newPoints[i].y + t * newPoints[i + 1].y
            });
        }
        newPoints = temp;
    }
    return newPoints[0];
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // DrawControlPolygon 
    ctx.strokeStyle = "#aaa";
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    
    // DrawBezierCurve
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let t = 0; t <= 1; t += 0.01) {
        let p = deCasteljau(t, points);
        ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    
    // DrawControlPoints
    ctx.fillStyle = "red";
    for (let p of points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fill();
    }
}

draw();
//mouseEvents
// dragControlPoints
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

canvas.addEventListener("mousedown", (e) => {
    let mx = e.offsetX, my = e.offsetY;
    let clickedOnPoint = false;

    for (let p of points) {
        if (Math.hypot(mx - p.x, my - p.y) < 10) {
            draggingPoint = p;
            clickedOnPoint = true;
            break;
        }
    }

    // If not clicking on an existing point
    // addNewPoint
    if (!clickedOnPoint) {
        points.push({ x: mx, y: my });
        draw();
    }
});

canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    let mx = e.offsetX, my = e.offsetY;

    points = points.filter(p => Math.hypot(mx - p.x, my - p.y) >= 10);
    draw();
});
