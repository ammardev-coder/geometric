const radius_point = 10;

class Panel {
    constructor() {
        this.canvas = document.getElementById("splineCanvas");
        this.context = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.initEvents();
        
    }
    requireRedraw() {
        this.context.clearRect(0, 0, this.width, this.height);
        this.draw(this.context);
    }
    initEvents() {
        this.canvas.addEventListener("mousedown", (e) => this.onMouseDown(this.getMousePos(e)));
        this.canvas.addEventListener("mousemove", (e) => this.onMouseMove(this.getMousePos(e)));
        this.canvas.addEventListener("mouseup", (e) => this.onMouseUp(this.getMousePos(e)));
    }
    getMousePos(event) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }
}

class SplinePanel extends Panel {
    constructor() {
        super();
        this._points = [
            {x: 200, y: 200},
            {x: 300, y: 300},
            {x: 400, y: 200},
            {x: 500, y: 400},
        ];
        this._params = [0, 1, 2, 3];
        this._selectedPoint = null;
        this.requireRedraw();
    }

    onMouseDown(mouse) {
        this._selectedPoint = this.findPoint(mouse.x, mouse.y);
    }
    onMouseMove(mouse) {
        if (this._selectedPoint) {
            this._selectedPoint.x = mouse.x;
            this._selectedPoint.y = mouse.y;
            this.requireRedraw();
        }
    }
    onMouseUp() {
        this._selectedPoint = null;
    }

    findPoint(x, y) {
        for (let point of this._points) {
            const dx = point.x - x;
            const dy = point.y - y;
            if (Math.sqrt(dx * dx + dy * dy) < radius_point) {
                return point;
            }
        }
        return null;
    }

    drawPoints(context) {
        for (const point of this._points) {
            this.drawPoint(context, point);
        }
    }

    drawPoint(context, point) {
        context.strokeStyle = "#00F";
        context.beginPath();
        context.moveTo(point.x - radius_point, point.y);
        context.lineTo(point.x + radius_point, point.y);
        context.stroke();
        context.beginPath();
        context.moveTo(point.x, point.y - radius_point);
        context.lineTo(point.x, point.y + radius_point);
        context.stroke();
    }

    calculate_Li(u, i) {
        let nominator = 1;
        let denominator = 1;
        for (let j = 0; j < this._params.length; j++) {
            if (j !== i) {
                nominator *= (u - this._params[j]);
                denominator *= (this._params[i] - this._params[j]);
            }
        }
        return nominator / denominator;
    }

    draw(context) {
        context.fillStyle = "#FFF";
        context.fillRect(0, 0, this.width, this.height);
        this.drawPoints(context);
        context.strokeStyle = "#FFA500";
        context.beginPath();
        context.moveTo(this._points[0].x, this._points[0].y);

        let delta = 0.01;
        for (let u = this._params[0]; u < this._params[this._params.length - 1]; u += delta) {
            let x = 0;
            let y = 0;
            for (let i = 0; i < this._points.length; i++) {
                let Li = this.calculate_Li(u, i);
                x += this._points[i].x * Li;
                y += this._points[i].y * Li;
            }
            context.lineTo(x, y);
        }
        context.stroke();
    }
}

new SplinePanel();