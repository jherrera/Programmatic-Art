/* Software distributed under MIT License, read the
   accompanying LICENSE.txt file for more information. */

// Global variables
let r,                // Radius of the circle
    offset = -180,    // Offset from which to start the points
    animate = false,  // Automatic animation
    gn;               // Global "n", used for automatic animation

// Controls
let pModulo, sldModulo,
    pN, sldN,
    cbNumbers, cbPoints,
    cbLabels, cbColor;

// Shorthand white color
let WHITE;

function setup(){
    // Create canvas and controls
    createCanvas(windowHeight*1.25, windowHeight*0.9).parent('the_canvas');
    createControls();

    // Set appropriate modes
    colorMode(HSB);
    angleMode(DEGREES);
    textFont('Courier New', 15);

    r = (min(width, height)/2)-20;

    // Shorthand white color
    WHITE = color(0, 0, 100);
}

function draw(){
    background(0);
    // Retrieve information from the sliders OR global variables (if we're in automatic animation)
    mod = animate ? 100 : sldModulo.value();
    n   = animate ? gn  : sldN.value();

    if(cbLabels.checked()){
        stroke(WHITE);
        fill(WHITE);
        textAlign(LEFT);
        text(roundDecimal(n, 2) + " times table modulo " + mod, 15, 15);
    }
    // Move to center
    translate(width / 2, height / 2);
    noFill();
    stroke(WHITE);
    ellipse(0, 0, r * 2, r * 2);

    var spacing = 360 / mod;
    for(var i = 0; i < mod; i++){
        var x = r * cos(i * spacing + offset),
            y = r * sin(i * spacing + offset);
        if(cbNumbers.checked()){
            var tx = (r + (textWidth(i) / 2) + 10) * cos(i * spacing + offset),
                ty = (r + (textWidth(i) / 2) + 10) * sin(i * spacing + offset);
            stroke(WHITE);
            strokeWeight(1);
            textAlign(CENTER);
            text(i, tx, ty);
        }
        if(cbPoints.checked()){
            stroke(0, 100, 100);
            fill(WHITE);
            strokeWeight(4);
            point(x, y);
        }
        var result = n * i;
        var tx = r * cos(result * spacing + offset),
            ty = r * sin(result * spacing + offset),
            c = cbColor.checked() ? color(map(i, 0, mod, 0, 360), 100, 100) : WHITE;
        stroke(c);
        strokeWeight(1);
        line(x, y, tx, ty);
    }
    if(animate && !(frameCount % 8)){
        gn += 0.1;
    }
}

function createControls(){
    pModulo = createP('Modulo: 10');
    pModulo.parent('right_side');
    sldModulo = createSlider(4, 100, 10, 1);
    sldModulo.parent('right_side');
    sldModulo.changed(function(){
        pModulo.html('Modulo: '+this.value());
    })
    pN = createP('Times table of: 2');
    pN.parent('right_side');
    sldN      = createSlider(2, 110, 2, 1);
    sldN.parent('right_side');
    sldN.changed(function(){
        pN.html('Times table of: '+this.value());
    })
    cbNumbers = createCheckbox('Show numbers', true);
    cbNumbers.parent('right_side');
    cbPoints  = createCheckbox('Show points', true);
    cbPoints.parent('right_side');
    cbLabels  = createCheckbox('Show labels', true);
    cbLabels.parent('right_side');
    cbColor   = createCheckbox('Use color scheme', true);
    cbColor.parent('right_side');
    createP('').parent('right_side');
    var btnAnimate = createButton('Animate');
    btnAnimate.parent('right_side');
    btnAnimate.mousePressed(function(){
        animate = !animate;
        this.html(animate ? 'Stop' : 'Animate');
        gn = 1;
    });
    createP('').parent('right_side');
    var btnScreenshot = createButton('Save Image');
    btnScreenshot.parent('right_side');
    btnScreenshot.mousePressed(function(){
        saveCanvas();
    });
}
function roundDecimal(number, digits){
    var p = pow(10, digits);
    return round(number * p) / p;
}
