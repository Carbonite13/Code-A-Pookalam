const canvas = document.getElementById("pookalamCanvas");
const ctx = canvas.getContext("2d");

const SIZE = 900;

canvas.width = SIZE;
canvas.height = SIZE;

const cx = SIZE / 2;
const cy = SIZE / 2;

const PI2 = Math.PI * 2;



// COLOURS


const C = {
    bg: "#ead8b8",
    white: "#fff4dc",
    cream: "#ffe8aa",
    yellow: "#ffd21c",
    orange: "#f47718",
    pink: "#c51f67",
    darkPink: "#8d174d",
    green: "#28532d",
    lightGreen: "#47783b"
};



// BASIC FUNCTIONS


function circle(radius, color) {

    ctx.beginPath();

    ctx.arc(
        cx,
        cy,
        radius,
        0,
        PI2
    );

    ctx.fillStyle = color;

    ctx.fill();
}


function circleAt(x, y, radius, color) {

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius,
        0,
        PI2
    );

    ctx.fillStyle = color;

    ctx.fill();
}


function ring(inner, outer, color) {

    ctx.beginPath();

    ctx.arc(
        cx,
        cy,
        outer,
        0,
        PI2
    );

    ctx.arc(
        cx,
        cy,
        inner,
        0,
        PI2,
        true
    );

    ctx.fillStyle = color;

    ctx.fill();
}


function point(radius, angle) {

    return {
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius
    };
}


// PETAL


function petal(
    x,
    y,
    length,
    width,
    angle,
    color
) {

    ctx.save();

    ctx.translate(x, y);

    ctx.rotate(angle);

    ctx.beginPath();

    ctx.moveTo(0, 0);

    ctx.bezierCurveTo(
        width,
        -length * 0.25,
        width,
        -length * 0.72,
        0,
        -length
    );

    ctx.bezierCurveTo(
        -width,
        -length * 0.72,
        -width,
        -length * 0.25,
        0,
        0
    );

    ctx.closePath();

    ctx.fillStyle = color;

    ctx.fill();

    ctx.restore();
}



// SMALL FLOWER


function smallFlower(
    x,
    y,
    size,
    petalColor,
    centerColor
) {

    for (let i = 0; i < 8; i++) {

        const angle =
            PI2 * i / 8;

        circleAt(
            x + Math.cos(angle) * size * 0.45,
            y + Math.sin(angle) * size * 0.45,
            size * 0.30,
            petalColor
        );
    }

    circleAt(
        x,
        y,
        size * 0.23,
        centerColor
    );
}



// BACKGROUND


ctx.fillStyle = C.bg;

ctx.fillRect(
    0,
    0,
    SIZE,
    SIZE
);



// OUTER WHITE BASE


circle(
    420,
    C.white
);



// CONCENTRIC COLOUR RINGS


ring(400, 410, C.darkPink);

ring(375, 400, C.pink);

ring(345, 375, C.orange);

ring(315, 345, C.yellow);

ring(285, 315, C.orange);



// GREEN SEPARATOR


ring(
    272,
    285,
    C.green
);



//  DECORATION ON THE COLOURED RINGS


for (let i = 0; i < 16; i++) {

    const angle =
        PI2 * i / 16;

    const p =
        point(330, angle);

    // small white flower
    smallFlower(
        p.x,
        p.y,
        12,
        C.white,
        C.yellow
    );
}


// OUTER FLOWERS


for (let i = 0; i < 20; i++) {

    const angle =
        PI2 * i / 20;

    const p =
        point(405, angle);

    smallFlower(
        p.x,
        p.y,
        13,
        i % 2 === 0
            ? C.orange
            : C.yellow,
        C.white
    );
}



// INNER GREEN AREA


circle(
    272,
    C.green
);



// COLOURED LARGE PETALS


const N = 8;

for (let i = 0; i < N; i++) {

    const angle =
        -Math.PI / 2 +
        i * PI2 / N;

    const p =
        point(95, angle);

    petal(
        p.x,
        p.y,
        205,
        52,
        angle,
        i % 2 === 0
            ? C.pink
            : C.orange
    );
}



// YELLOW PETALS


for (let i = 0; i < N; i++) {

    const angle =
        -Math.PI / 2 +
        i * PI2 / N +
        Math.PI / N;

    const p =
        point(75, angle);

    petal(
        p.x,
        p.y,
        155,
        34,
        angle,
        C.yellow
    );
}






// LARGE WHITE CENTRAL FLOWER


const WHITE_PETALS = 8;

for (let i = 0; i < WHITE_PETALS; i++) {

    const angle =
        -Math.PI / 2 +
        i * PI2 / WHITE_PETALS;

    const p =
        point(58, angle);

    petal(
        p.x,
        p.y,
        145,
        43,
        angle,
        C.white
    );
}



// YELLOW DETAILS ON WHITE PETALS


for (let i = 0; i < WHITE_PETALS; i++) {

    const angle =
        -Math.PI / 2 +
        i * PI2 / WHITE_PETALS;

    const p =
        point(112, angle);

    circleAt(
        p.x,
        p.y,
        5,
        C.yellow
    );
}



// SMALL FLOWERS IN GREEN AREA


for (let i = 0; i < 8; i++) {

    const angle =
        -Math.PI / 2 +
        i * PI2 / 8 +
        Math.PI / 8;

    const p =
        point(245, angle);

    smallFlower(
        p.x,
        p.y,
        15,
        C.white,
        C.yellow
    );
}



// SMALL PINK FLOWERS


for (let i = 0; i < 8; i++) {

    const angle =
        -Math.PI / 2 +
        i * PI2 / 8;

    const p =
        point(245, angle);

    smallFlower(
        p.x,
        p.y,
        14,
        C.pink,
        C.yellow
    );
}


// CENTRAL FLOWER


circle(
    72,
    C.green
);

circle(
    57,
    C.yellow
);


// Pink centre petals

for (let i = 0; i < 8; i++) {

    const angle =
        PI2 * i / 8;

    circleAt(
        cx + Math.cos(angle) * 34,
        cy + Math.sin(angle) * 34,
        14,
        C.pink
    );
}


// Orange centre

circle(
    21,
    C.orange
);


// White centre

circle(
    9,
    C.white
);



// SMALL WHITE DOTS AROUND GREEN EDGE


for (let i = 0; i < 16; i++) {

    const angle =
        PI2 * i / 16;

    const p =
        point(278, angle);

    circleAt(
        p.x,
        p.y,
        4,
        C.white
    );
}



// FINAL OUTER WHITE BORDER


ctx.beginPath();

ctx.arc(
    cx,
    cy,
    420,
    0,
    PI2
);

ctx.strokeStyle = C.white;

ctx.lineWidth = 6;

ctx.stroke();


console.log(
    "🌸 Final Onam Pookalam completed!"
);