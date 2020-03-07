/* Software distributed under MIT License, read the
   accompanying LICENSE.txt file for more information. */

var mainPoint,
    vertices = [];
var sldSpeed;

function setup(){
    createCanvas(windowHeight*1.25, windowHeight*0.9).parent('the_canvas');
    createControls();

    mainPoint = createVector(width/2, height/2);
    vertices.push(createVector(width/2+random(-50,50),height/3+random(-50,50)));
    vertices.push(createVector(width/3+random(-50,50),height*0.666666+random(-50,50)));
    vertices.push(createVector(width*0.666666+random(-50,50),height*0.6666+random(-50,50)));
    background(0);
    drawVertices();
}

function draw(){
    rate = getRate();
    if(rate['rate'] == 1 || !(frameCount % rate['rate'])){
        stroke(255, 0, 0);
        strokeWeight(1);
        for(var i = 0; i < rate['ipf']; i++){
            mainPoint = center(mainPoint, random(vertices));
            point(mainPoint.x, mainPoint.y);
        }
    }
}

function mouseDragged(){
    vertices.forEach(function(v){
        if(dist(pmouseX, pmouseY, v.x, v.y) < 10){
            v.x = mouseX;
            v.y = mouseY;
            background(0);
            drawVertices();
        }
    });
}

function mousePressed(){
    if(mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height){
        return;
    }
    var dragging = false;
    vertices.forEach(function(v){
        if(dist(pmouseX, pmouseY, v.x, v.y) < 10){
            dragging = true;
        }
    });
    if(!dragging){
        vertices.push(createVector(mouseX, mouseY));
        background(0);
        drawVertices();
    }

}

function center(v1, v2){
    return createVector((v1.x + v2.x) / 2, (v1.y + v2.y) / 2);
}

function drawVertices(){
    push();
    stroke(255);
    strokeWeight(4);
    vertices.forEach(function(el){
        point(el.x, el.y);
    });
    pop();
}

function createControls(){
    pSpeed = createP('Speed: VERY SLOW').parent('right_side');
    sldSpeed = createSlider(1,5,1,1);
    sldSpeed.parent('right_side');
    sldSpeed.changed(function(){
        var speeds = ['VERY SLOW', 'SLOW', 'MEDIUM', 'FAST', 'VERY FAST'];
        pSpeed.html('Speed: '+speeds[this.value()-1]);
    });
    createP('').parent('right_side');
    var btnScreenshot = createButton('Save Image');
    btnScreenshot.parent('right_side');
    btnScreenshot.mousePressed(function(){
        saveCanvas();
    });
    var footnotes = "Click on the black area to create new vertices, <br />or drag the white dots to move the vertices around";
    createP(footnotes).style('font-size', '0.7em').parent('right_side');
}

function getRate(){
    switch(sldSpeed.value()){
        case 1:
            return {'ipf': 1, 'rate': 25};
        case 2:
            return {'ipf': 1, 'rate': 10};
        case 3:
            return {'ipf': 1, 'rate': 1};
        case 4:
            return {'ipf': 100, 'rate': 1};
        case 5:
            return {'ipf': 250, 'rate': 1};
    }
}