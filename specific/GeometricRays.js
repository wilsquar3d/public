// https://raw.githubusercontent.com/wilsquar3d/public/refs/heads/master/specific/GeometricRays.js

class GeometricRays {

    // ============================================================
    // CONSTRUCTOR & STATIC METHODS
    // ============================================================

    constructor({
        width,
        height,
        rayCount,
        backgroundColor,
        rayColor,
        interval,
        shape,
        margin = 10,
        showShapeName = false
    }) {
        this.width = width;
        this.height = height;
        this.rayCount = rayCount;
        this.backgroundColor = backgroundColor;
        this.rayColor = rayColor;
        this.interval = interval;
        this.shape = shape.toLowerCase();
        this.margin = margin;
        this.showShapeName = showShapeName;

        this.canvas = null;
        this.ctx = null;

        this.cx = width / 2;
        this.cy = height / 2;

        this.radius = (Math.min(width, height) / 2) - margin;

        this.angles = this.generateUniqueAngles();
    }

    static getAvailableShapes() {
        return [
            "circle",
            "square",
            "triangle",
            "pentagon",
            "hexagon",
            "octagon",
            "diamond",
            "star",
            "3-point star",
            "6-point star",
            "7-point star",
            "8-point star",
            "rounded star",
            "starburst",
            "heart"
        ];
    }

    generateUniqueAngles() {
        const angles = [];
        for (let i = 0; i < this.rayCount; i++) {
            angles.push((i / this.rayCount) * Math.PI * 2);
        }
        for (let i = angles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [angles[i], angles[j]] = [angles[j], angles[i]];
        }
        return angles;
    }

    // ============================================================
    // PUBLIC DRAWING API
    // ============================================================

    draw() {
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext("2d");

        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.width, this.height);

        if (this.showShapeName) {
            this.ctx.fillStyle = this.rayColor;
            this.ctx.font = "16px sans-serif";
            this.ctx.textBaseline = "top";
            this.ctx.fillText(this.shape, 10, 10);
        }

        let drawn = 0;

        const timer = setInterval(() => {
            if (drawn >= this.rayCount) {
                clearInterval(timer);
                return;
            }
            this.drawRay();
            drawn++;
        }, this.interval);
    }

    drawRay() {
        const angle = this.angles.pop();

        if (this.shape === "circle") {
            const end = this.pointOnCircle(angle);
            this.ctx.strokeStyle = this.rayColor;
            this.ctx.beginPath();
            this.ctx.moveTo(this.cx, this.cy);
            this.ctx.lineTo(end.x, end.y);
            this.ctx.stroke();
            return;
        }

        const end = this.pointOnCircle(angle);
        this.drawMaskedRay(end);
    }

    drawMaskedRay(end) {
        if (!end) return;

        const off = document.createElement("canvas");
        off.width = this.width;
        off.height = this.height;
        const octx = off.getContext("2d");

        octx.strokeStyle = this.rayColor;
        octx.beginPath();
        octx.moveTo(this.cx, this.cy);
        octx.lineTo(end.x, end.y);
        octx.stroke();

        octx.globalCompositeOperation = "destination-in";
        this.createShapePath(octx);
        octx.fill();

        this.ctx.drawImage(off, 0, 0);
    }

    // ============================================================
    // SHAPE DISPATCH
    // ============================================================

    createShapePath(ctx) {
        switch (this.shape) {
            case "square": this.createSquarePath(ctx); break;
            case "diamond": this.createPolygonPath(ctx, 4); break;
            case "triangle": this.createPolygonPath(ctx, 3); break;
            case "pentagon": this.createPolygonPath(ctx, 5); break;
            case "hexagon": this.createPolygonPath(ctx, 6); break;
            case "octagon": this.createPolygonPath(ctx, 8); break;

            case "star": this.createStarPath(ctx, 5, 0.5); break;
            case "3-point star": this.createStarPath(ctx, 3, 0.2); break;
            case "6-point star": this.createStarPath(ctx, 6, 0.45); break;
            case "7-point star": this.createStarPath(ctx, 7, 0.4); break;
            case "8-point star": this.createStarPath(ctx, 8, 0.45); break;

            case "rounded star": this.createRoundedStarPath(ctx, 5); break;
            case "starburst": this.createStarburstPath(ctx, 12, 0.35); break;

            case "heart": this.createHeartPath(ctx); break;
        }
    }

    // ============================================================
    // BASIC SHAPES
    // ============================================================

    createSquarePath(ctx) {
        const r = this.radius / Math.SQRT2;
        ctx.beginPath();
        ctx.rect(this.cx - r, this.cy - r, r * 2, r * 2);
        ctx.closePath();
    }

    createPolygonPath(ctx, sides) {
        const verts = [];
        const step = (Math.PI * 2) / sides;

        for (let i = 0; i < sides; i++) {
            const a = i * step - Math.PI / 2;
            verts.push({
                x: this.cx + this.radius * Math.cos(a),
                y: this.cy + this.radius * Math.sin(a)
            });
        }

        ctx.beginPath();
        ctx.moveTo(verts[0].x, verts[0].y);
        for (let i = 1; i < verts.length; i++) ctx.lineTo(verts[i].x, verts[i].y);
        ctx.closePath();
    }

    createStarPath(ctx, points, innerMult) {
        const outerR = this.radius;
        const innerR = this.radius * innerMult;
        const verts = this.getStarVertices(points, outerR, innerR);

        ctx.beginPath();
        ctx.moveTo(verts[0].x, verts[0].y);
        for (let i = 1; i < verts.length; i++) ctx.lineTo(verts[i].x, verts[i].y);
        ctx.closePath();
    }

    createRoundedStarPath(ctx, points) {
        const steps = 400;
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * Math.PI * 2;
            const p = this.pointOnRoundedStar(t, points);
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
    }

    createStarburstPath(ctx, spikes, sharpness) {
        const steps = 600;
        const R = this.radius;

        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * Math.PI * 2;
            const r = R * (1 - sharpness + sharpness * Math.cos(spikes * t));
            const x = this.cx + r * Math.cos(t);
            const y = this.cy + r * Math.sin(t);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
    }

    createHeartPath(ctx) {
        const verts = this.getHeartVertices(400);
        ctx.beginPath();
        ctx.moveTo(verts[0].x, verts[0].y);
        for (let i = 1; i < verts.length; i++) ctx.lineTo(verts[i].x, verts[i].y);
        ctx.closePath();
    }

        // ============================================================
    // GEOMETRY HELPERS
    // ============================================================

    pointOnCircle(angle) {
        return {
            x: this.cx + this.radius * Math.cos(angle),
            y: this.cy + this.radius * Math.sin(angle)
        };
    }

    getStarVertices(points, outerR, innerR) {
        const verts = [];
        const step = Math.PI / points;

        for (let i = 0; i < points * 2; i++) {
            const r = (i % 2 === 0) ? outerR : innerR;
            const a = i * step - Math.PI / 2;

            verts.push({
                x: this.cx + r * Math.cos(a),
                y: this.cy + r * Math.sin(a)
            });
        }

        return verts;
    }

    pointOnRoundedStar(angle, points) {
        const R = this.radius;
        const r = this.radius * 0.5;

        let a = angle % (Math.PI * 2);
        if (a < 0) a += Math.PI * 2;

        const step = Math.PI / points;
        const seg = Math.floor(a / step);
        const local = (a % step) / step;

        const isOuter = seg % 2 === 0;
        const r0 = isOuter ? R : r;
        const r1 = isOuter ? r : R;

        const radius = r0 + (r1 - r0) * local;

        return {
            x: this.cx + radius * Math.cos(angle),
            y: this.cy + radius * Math.sin(angle)
        };
    }

    getHeartVertices(steps) {
        const verts = [];
        const raw = [];
        let maxR = 0;

        for (let i = 0; i < steps; i++) {
            const t = (i / steps) * Math.PI * 2;

            const x = 16 * Math.pow(Math.sin(t), 3);
            const y =
                13 * Math.cos(t) -
                5 * Math.cos(2 * t) -
                2 * Math.cos(3 * t) -
                Math.cos(4 * t);

            raw.push({ x, y });

            const r = Math.sqrt(x * x + y * y);
            if (r > maxR) maxR = r;
        }

        const scale = this.radius / maxR;

        for (const p of raw) {
            verts.push({
                x: this.cx + p.x * scale,
                y: this.cy - p.y * scale
            });
        }

        return verts;
    }
}
