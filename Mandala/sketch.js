/* Software distributed under MIT License, read the
   accompanying LICENSE.txt file for more information. */

// Global variables
var n = 2,              // Number of divisions
    sw = 1,             // Stroke weight
    c  = [255, 0, 0];   // Color (stroke)

// The dots "database"
var dots = [];

// Controls
var cbShowDivisions, pDivisions,
    sldDivisions, sldStroke,
    pStroke, inColorPicker,
    spColor;

function setup(){
    createControls();
    startCanvas();
    noLoop();
}

function draw(){
    // Do nothing
}

function mousePressed(){
    if(!inCanvas()){
        return;
    }
    reflectedDraw(translateCoords([mouseX, mouseY]), c, sldStroke.value());
    dots.push({'x': mouseX, 'y': mouseY, 'stroke': c, 'strokew': sldStroke.value()});
}

function mouseDragged(){
    if(!inCanvas()){
        return;
    }
    reflectedDraw(translateCoords([mouseX, mouseY]), c, sldStroke.value());
    dots.push({'x': mouseX, 'y': mouseY, 'stroke': c, 'strokew': sldStroke.value()});
}

function inCanvas(){
    return !(mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height);
}

function reflectedDraw(coords, _color, _strokeweight){
    var x = coords[0],
        y = coords[1];
    push();
    translate(width / 2, height / 2);
    stroke(_color);
    strokeWeight(_strokeweight);
    for(var i = 0; i < n; i++){
        rotate((TWO_PI/n));
        point(x, y);
    }
    pop();
}

function translateCoords(coords){
    return [coords[0] - (width / 2), coords[1] - (height / 2)];
}

function startCanvas(){
    push();

    background(0);
    translate(width / 2, height / 2);
    rotate(-HALF_PI);
    n = sldDivisions.value();
    pDivisions.html('Number of divisions: '+n);
    if(cbShowDivisions.checked() && n > 1){
        stroke(125);
        strokeWeight(1);
        for(var i = 0; i < n; i++){
            var x1 = cos((TWO_PI/n)*i) * width,
                y1 = sin((TWO_PI/n)*i) * width;
            line(0, 0, x1, y1);
        }
    }


    pop();
    if(dots.length > 0){
        // Recreate the image from the dots db
        for(var i = 0; i < dots.length; i++){
            _c = dots[i]['stroke'];
            _x = dots[i]['x'];
            _y = dots[i]['y'];
            _w = dots[i]['strokew'];
            reflectedDraw(translateCoords([_x, _y]), _c, _w);
        }
    }
}

function validateColor(){
    var val = this.value();
    // Found a value in the form 255, 0, 100
    if(val.match(/^ *\d{1,3} *, *\d{1,3} *, *\d{1,3} *$/)){
        values = val.split(',');
        c = [parseInt(values[0]), parseInt(values[1]), parseInt(values[2])];
        spColor.style('background', 'rgb('+values[0]+','+values[1]+','+values[2]+')');
        return;
    }
    // Found a value in the form #FF0
    if(val.match(/^ *#?[\da-fA-F]{3} *$/)){
        values = val.replace(/[^\da-fA-F]/, '').split('');
        var r = parseInt(values[0]+''+values[0],16);
        var g = parseInt(values[1]+''+values[1],16);
        var b = parseInt(values[2]+''+values[2],16);
        c = [r,g,b];
        spColor.style('background', '#'+val.replace(/[^\da-fA-F]/, ''));
        return;
    }
    // Found a value in the form #FF0
    if(val.match(/^ *#?[\da-fA-F]{6} *$/)){
        values = val.replace(/[^\da-fA-F]/, '').split('');
        var r = parseInt(values[0]+''+values[1],16);
        var g = parseInt(values[2]+''+values[3],16);
        var b = parseInt(values[4]+''+values[5],16);
        c = [r,g,b];
        spColor.style('background', '#'+val.replace(/[^\da-fA-F]/, ''));
        return;
    }
    // Fallback to red
    c = [255, 0, 0];
    spColor.style('background', '#FF0000');
    this.value('#FF0000');
}

function createControls(){
    // Place canvas inside "the_canvas" div
    createCanvas(windowHeight*1.25, windowHeight*0.9).parent('the_canvas');

    // Create controls
    cbShowDivisions = createCheckbox('Show divisions', true);
    cbShowDivisions.parent('right_side');
    cbShowDivisions.changed(startCanvas);
    pDivisions = createP('Number of divisions: 2');
    pDivisions.parent('right_side');
    sldDivisions = createSlider(1,50,4,1);
    sldDivisions.changed(startCanvas);
    sldDivisions.parent('right_side');
    pStroke = createP('Stroke weight: 1');
    pStroke.parent('right_side');
    sldStroke = createSlider(1,10,1,1);
    sldStroke.parent('right_side');
    sldStroke.changed(function(){
        pStroke.html('Stroke weight: '+this.value());
    });
    var p = createP('Stroke color: ');
    var colorpicker = createInput('#FF0000', 'color').parent(p);
    colorpicker.changed(function(val){
        val = this.value();
        inColorPicker.value(val);
        values = val.replace(/[^\da-fA-F]/, '').split('');
        var r = parseInt(values[0]+''+values[1],16);
        var g = parseInt(values[2]+''+values[3],16);
        var b = parseInt(values[4]+''+values[5],16);
        c = [r,g,b];
        //inColorPicker.changed();
    });
    p.parent('right_side');
    inColorPicker = createInput('#FF0000');
    inColorPicker.parent('right_side');
    inColorPicker.changed(validateColor);
    createP('').parent('right_side');   // Force new line

    var btnClear = createButton('Clear');
    btnClear.parent('right_side');
    btnClear.mousePressed(function(){
        dots = [];
        startCanvas();
    });
    var btnScreenshot = createButton('Save Image');
    btnScreenshot.parent('right_side');
    btnScreenshot.mousePressed(function(){
        saveCanvas();
    });
}
