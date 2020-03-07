/* Software distributed under MIT License, read the
   accompanying LICENSE.txt file for more information. */

let animation = false;
let n;

// These can be used for "draw lines" option
let px, py;
let x, y;

// Controls
let inWidth, inHeight,
    sldSeedSize, sldSeedSpacing,
    pSeedSize, pSeedSpacing,
    inAngle, inAdj, cbLines,
    sldSpeed, selColor,
    btnGenerate;

function setup(){
    // Create canvas and controls
    createCanvas(500, 500).parent('the_canvas');
    createControls();

    // Set appropriate modes
    angleMode(DEGREES);
    colorMode(HSB);

    // Set canvas
    frameRate(30);
    background(0);
    noLoop();
}

function draw(){
    translate(width / 2, height / 2);

    // Get current options
    c = sldSeedSpacing.value();
    angle = inAngle.value() * 360;
    strokeWeight(sldSeedSize.value());

    var rate = getRate();
    if(rate['rate'] == 1 || !(frameCount % rate['rate'])){
        for(let i = 0; i < rate['ipf']; i++){
            am = inAdj.value() * n;
            let theta = n * angle + am,
                radius = c * sqrt(n);
            px = x;
            py = y;
            x = radius * cos(theta),
            y = radius * sin(theta);

            // Color scheme
            switch(selColor.value() * 1){
                case 0:
                    stroke(0,0,255);
                    break;
                case 1:
                    stroke(theta % 360, 255, 255);
                    break;
                case 2:
                    stroke(n % 360, 255, 255);
                    break;
                case 3:
                    stroke((theta + n) % 360, 255, 255);
                    break;
                case 4:
                    stroke((theta * n) % 360, 255, 255);
                    break;
            }
            point(x, y);
            if(cbLines.checked()){
                line(px, py, x, y);
            }
            n++;
        }
    }
    if(outOfBounds(abs(x) / 2, abs(y) / 2)){
        btnGenerate.html('Generate');
        animation = false;
        noLoop();
    }
}

function createControls(){
    // Canvas size options
    var divTmp = createDiv('');
        divTmp.parent('right_side');
        divTmp.style('float', 'left');
        divTmp.style('padding-right', '25px');
    createP('Canvas width: ').parent(divTmp);
    inWidth = createInput(500).parent(divTmp).style('width', '70px');
    inWidth.changed(validateSize);
    var divTmp = createDiv('');
        divTmp.parent('right_side');
        divTmp.style('float', 'left');
    createP('Canvas height: ').parent(divTmp);
    inHeight = createInput(500).parent(divTmp).style('width', '70px');
    inHeight.changed(validateSize);
    createDiv('').style('clear', 'both').parent('right_side');

    // Seed options
    var divTmp = createDiv('');
        divTmp.parent('right_side');
        divTmp.style('float', 'left');
        divTmp.style('padding-right', '25px');
    pSeedSize = createP('Seed size: 5').parent(divTmp);
    sldSeedSize = createSlider(1,20,5,1).parent(divTmp);
    sldSeedSize.changed(function(){
        pSeedSize.html('Seed size: '+this.value());
    });
    var divTmp = createDiv('');
        divTmp.parent('right_side');
        divTmp.style('float', 'left');
    pSeedSpacing = createP('Seed spacing: 10').parent(divTmp);
    sldSeedSpacing = createSlider(1,20,10,1).parent(divTmp);
    sldSeedSpacing.changed(function(){
        pSeedSpacing.html('Seed spacing: '+this.value());
    });
    createDiv('').style('clear', 'both').parent('right_side');

    // Angle options
    divTmp.style('float', 'left');
    var divTmp = createDiv('');
        divTmp.parent('right_side');
        divTmp.style('float', 'left');
        divTmp.style('padding-right', '25px');
    createP('Angle<sup>1,2</sup>: ').parent(divTmp);
    inAngle = createInput("0.1").parent(divTmp).style('width', '100px');
    inAngle.changed(validatePer);
    var divTmp = createDiv('');
        divTmp.parent('right_side');
        divTmp.style('float', 'left');
    createP('Adjustment<sup>3</sup>: ').parent(divTmp);
    inAdj = createInput("0").parent(divTmp).style('width', '100px');
    inAdj.changed(validatePer);
    createDiv('').style('clear', 'both').parent('right_side');

    // Speed and color scheme
    var divTmp = createDiv('');
        divTmp.parent('right_side');
        divTmp.style('float', 'left');
        divTmp.style('padding-right', '25px');
    pSpeed = createP('Speed: SLOW').parent(divTmp);
    sldSpeed = createSlider(1,5,2,1).parent(divTmp);
    sldSpeed.changed(function(){
        var speeds = ['VERY SLOW', 'SLOW', 'MEDIUM', 'FAST', 'VERY FAST'];
        pSpeed.html('Speed: '+speeds[this.value()-1]);
    });
    var divTmp = createDiv('');
        divTmp.parent('right_side');
        divTmp.style('float', 'left');
        divTmp.style('padding-right', '25px');
    createP('Color scheme:').parent(divTmp);
    selColor = createSelect().parent(divTmp);
    selColor.option('None', 0);
    selColor.option('Angle', 1);
    selColor.option('Index', 2);
    selColor.option('Angle+Index', 3);
    selColor.option('Angle&times;Index', 4);

    // Lines checkbox
    cbLines = createCheckbox('Lines', false);
    cbLines.parent('right_side');
    createDiv('').style('clear', 'both').parent('right_side').style('margin-bottom','20px');

    // Generate and Save Image buttons
    btnGenerate = createButton('Generate').parent('right_side').mousePressed(start);
    createP('').parent('right_side');
    createButton('Save Image').parent('right_side').mousePressed(function(){
        saveCanvas();
    });;

    // Footnotes
    var footnotes = "<sup>1</sup> Angle as a percentage of 360, 0.5 = 360&deg;/2 = 180&deg;<br /> \
                     <sup>2</sup> Try 0.6180339887 (the golden ratio) <br />  \
                     <sup>3</sup> Angle adjustment, (n * adj) gets added to angle";
    createP(footnotes).style('font-size', '0.7em').parent('right_side');
}

function outOfBounds(x, y){
    return (x < 0 || x > width) || (y < 0 || y > height);
}

function validateSize(){
    var val = this.value().replace(/[^\d]/g, '');
    // Constrain values
    if(val < 100){
       val = 100;
    }
    if(val > 2000){
        val = 2000;
    }
    this.value(val);

}

function validatePer(){
    var val = this.value().replace(/[^\d.]/g, '');
    // Constrain values
    if(val < 0){
       val = 0;
    }
    if(val > 1){
        val = 1;
    }
    this.value(val);
}

function getRate(){
    switch(sldSpeed.value()){
        case 1:
            // "Iterations per frame" and "rate"
            return {'ipf': 1, 'rate': 20};
        case 2:
            return {'ipf': 1, 'rate': 5};
        case 3:
            return {'ipf': 1, 'rate': 1};
        case 4:
            return {'ipf': 50, 'rate': 1};
        case 5:
            return {'ipf': 250, 'rate': 1};
    }
}

function resetGlobalVariables(){
    n = 1;
    px = py = x = y = 0;
}

function start(){
    if(animation){
        animation = false;
        noLoop();
        btnGenerate.html('Generate');
        return;
    }
    // Setup canvas
    resizeCanvas(inWidth.value(), inHeight.value());
    background(0);
    resetGlobalVariables();
    animation = true;
    btnGenerate.html('Stop');
    loop();
}
