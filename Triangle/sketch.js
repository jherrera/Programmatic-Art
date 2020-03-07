/* Software distributed under MIT License, read the
   accompanying LICENSE.txt file for more information. */

let vertices = [];

let circumcenter = false,
    medicenter   = false,
    orthocenter  = false,
    incenter     = false,
    morley       = false,
    eulerline    = false,
    ninecircle   = false,
    napoleon     = false;

function setup(){
    createCanvas(windowHeight*1.25, windowHeight*0.9);
    vertices.push(createVector(width/2+random(-50,50),height/3+random(-50,50)));
    vertices.push(createVector(width/3+random(-50,50),height*0.666666+random(-50,50)));
    vertices.push(createVector(width*0.666666+random(-50,50),height*0.6666+random(-50,50)));
}

function draw(){
    var circumcentercoords = null;
    var orthocentercoords = null;
    var circumcircleR = 0;
    var foot1, foot2, foot3;
    var mid_ortho_vertex1, mid_ortho_vertex2, mid_ortho_vertex3;
    background(0);
    showOptions();
    stroke(255);
    noFill();
    beginShape();

    // Draw main triangle
    for(var i = 0; i < vertices.length; i++){
        var v = vertices[i];
        vertex(v.x, v.y);
        if(dist(mouseX, mouseY, v.x, v.y) < 10){
            push();
            fill(255);
            ellipse(v.x, v.y, 10, 10);
            pop();
        }
    }
    endShape(CLOSE);

    // Vertices for convenience
    var v1 = vertices[0];
    var v2 = vertices[1];
    var v3 = vertices[2];

    // Always calculate circumcenter, we need its coordinates for other triangle points
    if(true){
        push();
        stroke(255,0,0,75);
        var b1 = perpendicularBisector(v1, v2, 800);
        var b2 = perpendicularBisector(v3, v2, 800);
        var b3 = perpendicularBisector(v1, v3, 800);

        if(circumcenter){
            line(b1[0].x, b1[0].y, b1[1].x, b1[1].y);
            line(b2[0].x, b2[0].y, b2[1].x, b2[1].y);
            line(b3[0].x, b3[0].y, b3[1].x, b3[1].y);
        }
        strokeWeight(5);
        stroke(255,0,0);

        var p = intersectionPoint(b1, b2);
        var r = dist(p.x, p.y, v1.x, v1.y);

        if(circumcenter){
            point(p.x, p.y);
        }
        circumcentercoords = [p.x, p.y];
        circumcircleR = r;
        strokeWeight(1);
        if(circumcenter){
            ellipse(p.x, p.y, r*2, r*2);
        }
        pop();
    }

    // Always calculate orthocenter, we need its coordinates for other triangle points
    if(true){
        push();
        stroke(0,255,255,100);

        var V1a1 = atan2(v3.y-v1.y, v3.x-v1.x),
            V1a2 = atan2(v2.y-v1.y, v2.x-v1.x);
        var V1a = V1a2 - V1a1;

        var V2a1 = atan2(v3.y-v2.y, v3.x-v2.x),
            V2a2 = atan2(v1.y-v2.y, v1.x-v2.x);
        var V2a = V2a2 - V2a1;

        var V3a1 = atan2(v1.y-v3.y, v1.x-v3.x),
            V3a2 = atan2(v2.y-v3.y, v2.x-v3.x);
        var V3a = V3a2 - V3a1;

        var h1a =V1a1+V1a+(PI - (HALF_PI + V2a));
        var x1 = 1000 * cos(h1a);
            y1 = 1000 * sin(h1a),
            x2 = -1000 * cos(h1a),
            y2 = -1000 * sin(h1a);

        if(orthocenter){
            line(v1.x+x1, v1.y+y1, v1.x+x2, v1.y+y2);
        }
        // Get height foot
        foot1 = intersectionPoint([v3, v2], [createVector(v1.x+x1, v1.y+y1), createVector(v1.x+x2, v1.y+y2)]);

        var h2a =V2a1+V2a+(PI - (HALF_PI + V1a));
        var x1 = 1000 * cos(h2a);
            y1 = 1000 * sin(h2a),
            x2 = -1000 * cos(h2a),
            y2 = -1000 * sin(h2a);
        var h = [createVector(v2.x+x1, v2.y+y1), createVector(v2.x+x2, v2.y+y2)];
        if(orthocenter){
            line(v2.x+x1, v2.y+y1, v2.x+x2, v2.y+y2);
        }

        // Get height foot
        foot2 = intersectionPoint([v3, v1], [createVector(v2.x+x1, v2.y+y1), createVector(v2.x+x2, v2.y+y2)]);
        var h3a =V3a1+V3a-(PI - (HALF_PI + V2a));
        var x1 = 1000 * cos(h3a);
            y1 = 1000 * sin(h3a),
            x2 = -1000 * cos(h3a),
            y2 = -1000 * sin(h3a);
        if(orthocenter){
            line(v3.x+x1, v3.y+y1, v3.x+x2, v3.y+y2);
        }

        // Get height foot
        foot3 = intersectionPoint([v2, v1], [createVector(v3.x+x1, v3.y+y1), createVector(v3.x+x2, v3.y+y2)]);
        var ip = intersectionPoint(h, [createVector(v3.x+x1, v3.y+y1), createVector(v3.x+x2, v3.y+y2)]);
        strokeWeight(5);
        if(orthocenter){
            point(ip.x, ip.y);
        }

        // Get midpoint between the orthocenter and the vertex
        mid_ortho_vertex1 = lineCenter(ip, v1);
        mid_ortho_vertex2 = lineCenter(ip, v2);
        mid_ortho_vertex3 = lineCenter(ip, v3);
        orthocentercoords = [ip.x, ip.y];
        pop();
    }

    if(medicenter){
        push();
        stroke(0,255,0,100);
        var p1 = lineCenter(v2, v3);
        line(v1.x, v1.y, p1.x,p1.y);
        var p2 = lineCenter(v1, v3);
        line(v2.x, v2.y, p2.x,p2.y);
        var p3 = lineCenter(v2, v1);
        line(v3.x, v3.y, p3.x,p3.y);
        var ip = intersectionPoint([v1, p1], [v2, p2]);
        strokeWeight(5);
        point(ip.x, ip.y);
        pop();
    }

    if(incenter){
        //bisector([v1,v2],[v1,v3]);
        push();
        stroke(220, 0, 220,100);

        var a1 = atan2((v2.y-v1.y),(v2.x-v1.x));
        var a2 = atan2((v3.y-v1.y),(v3.x-v1.x));
        var a = (a1+a2)/2;

        var x1 = -1500 * cos(a);
        var y1 = -1500 * sin(a);
        var x2 = 1500 * cos(a);
        var y2 = 1500 * sin(a);
        //line(v1.x, v1.y, v1.x+x1, v1.y+y1);
        line(v1.x+x1, v1.y+y1, v1.x+x2, v1.y+y2);
        var line1 = [createVector(v1.x+x1, v1.y+y1), createVector(v1.x+x2, v1.y+y2)];

        var a1 = atan2((v1.y-v2.y),(v1.x-v2.x));
        var a2 = atan2((v3.y-v2.y),(v3.x-v2.x));
        var a = (a1+a2)/2;

        var x1 = -1500 * cos(a);
        var y1 = -1500 * sin(a);
        var x2 = 1500 * cos(a);
        var y2 = 1500 * sin(a);
        line(v2.x+x1, v2.y+y1, v2.x+x2, v2.y+y2);
        var line2 = [createVector(v2.x+x1, v2.y+y1), createVector(v2.x+x2, v2.y+y2)];

        var a1 = atan2((v2.y-v3.y),(v2.x-v3.x));
        var a2 = atan2((v1.y-v3.y),(v1.x-v3.x));
        var a = (a1+a2)/2;

        var x1 = -1500 * cos(a);
        var y1 = -1500 * sin(a);
        var x2 = 1500 * cos(a);
        var y2 = 1500 * sin(a);
        line(v3.x+x1, v3.y+y1, v3.x+x2, v3.y+y2);//*/
        var line3 = [createVector(v3.x+x1, v3.y+y1), createVector(v3.x+x2, v3.y+y2)];

        var ip = intersectionPoint(line1, line2);
        var ip2 = intersectionPoint(line1, [v2,v3]);
        var ip3 = intersectionPoint(line2, [v1,v3]);
        var ip4 = intersectionPoint(line3, [v1,v2]);
        strokeWeight(5);
        var d1 = dist(ip.x, ip.y, ip2.x, ip2.y);
        var d2 = dist(ip.x, ip.y, ip3.x, ip3.y);
        var d3 = dist(ip.x, ip.y, ip4.x, ip4.y);
        var d = min(d1,d2,d3);
        point(ip.x, ip.y);
        strokeWeight(1);
        ellipse(ip.x, ip.y, d*2,d*2);
        pop();
    }

    if(morley){
        push();
        stroke(255,255,0,100);
        angleMode(DEGREES);
        var V1a1 = atan2(v3.y-v1.y, v3.x-v1.x),
            V1a2 = atan2(v2.y-v1.y, v2.x-v1.x);
        var V1a = V1a2 - V1a1;

        var V2a1 = atan2(v3.y-v2.y, v3.x-v2.x),
            V2a2 = atan2(v1.y-v2.y, v1.x-v2.x);
        var V2a = V2a2 - V2a1;

        var V3a1 = atan2(v1.y-v3.y, v1.x-v3.x),
            V3a2 = atan2(v2.y-v3.y, v2.x-v3.x);
        var V3a = V3a2 - V3a1;

        if(V1a < -180){
            V1a += 360;
        }
        if(V1a > 180){
            V1a -= 360;
        }
        if(V2a < -180){
            V2a += 360;
        }
        if(V2a > 180){
            V2a -= 360;
        }
        if(V3a > 180){
            V3a -= 360;
        }
        if(V3a < -180){
            V3a += 360;
        }

        var h1a =V1a1 + (((V1a)/3) * 1);
        var V1T1x1 = -1000 * cos(h1a);
            V1T1y1 = -1000 * sin(h1a),
            V1T1x2 = 1000 * cos(h1a),
            V1T1y2 = 1000 * sin(h1a);

        V1T1Line = [createVector(v1.x+V1T1x1, v1.y+V1T1y1), createVector(v1.x+V1T1x2, v1.y+V1T1y2)];

        var h1a =V1a1 + (((V1a)/3) * 2);
        var V1T2x1 = 1000 * cos(h1a);
            V1T2y1 = 1000 * sin(h1a),
            V1T2x2 = -1000 * cos(h1a),
            V1T2y2 = -1000 * sin(h1a);

        V1T2Line = [createVector(v1.x+V1T2x1, v1.y+V1T2y1), createVector(v1.x+V1T2x2, v1.y+V1T2y2)];

        var h2a =V2a1 + (((V2a)/3) * 1);
        var V2T1x1 = -1000 * cos(h2a);
            V2T1y1 = -1000 * sin(h2a),
            V2T1x2 = 1000 * cos(h2a),
            V2T1y2 = 1000 * sin(h2a);

        V2T1Line = [createVector(v2.x+V2T1x1, v2.y+V2T1y1), createVector(v2.x+V2T1x2, v2.y+V2T1y2)];
        var h2a =V2a1 + (((V2a)/3) * 2);
        var V2T2x1 = 1000 * cos(h2a);
            V2T2y1 = 1000 * sin(h2a),
            V2T2x2 = -1000 * cos(h2a),
            V2T2y2 = -1000 * sin(h2a);

        V2T2Line = [createVector(v2.x+V2T2x1, v2.y+V2T2y1), createVector(v2.x+V2T2x2, v2.y+V2T2y2)];

        var h3a =V3a1 + (((V3a)/3) * 1);
        var V3T1x1 = -1000 * cos(h3a);
            V3T1y1 = -1000 * sin(h3a),
            V3T1x2 = 1000 * cos(h3a),
            V3T1y2 = 1000 * sin(h3a);

        V3T1Line = [createVector(v3.x+V3T1x1, v3.y+V3T1y1), createVector(v3.x+V3T1x2, v3.y+V3T1y2)];
        var h3a = V3a1 + (((V3a)/3) * 2);
        var V3T2x1 = 1000 * cos(h3a);
            V3T2y1 = 1000 * sin(h3a),
            V3T2x2 = -1000 * cos(h3a),
            V3T2y2 = -1000 * sin(h3a);

        V3T2Line = [createVector(v3.x+V3T2x1, v3.y+V3T2y1), createVector(v3.x+V3T2x2, v3.y+V3T2y2)];

        // Find intersection between V1T1 and V2T1
        var ip1 = intersectionPoint(V1T1Line, V3T1Line);
        var ip2 = intersectionPoint(V1T2Line, V2T2Line);
        var ip3 = intersectionPoint(V2T1Line, V3T2Line);


        line(v1.x, v1.y, ip1.x, ip1.y);
        line(v1.x, v1.y, ip2.x, ip2.y);

        line(v2.x, v2.y, ip2.x, ip2.y);
        line(v2.x, v2.y, ip3.x, ip3.y);

        line(v3.x, v3.y, ip1.x, ip1.y);
        line(v3.x, v3.y, ip3.x, ip3.y);
        beginShape();
        vertex(ip1.x, ip1.y);
        vertex(ip2.x, ip2.y);
        vertex(ip3.x, ip3.y);
        endShape(CLOSE);
        strokeWeight(5);
        point(ip1.x,ip1.y);
        point(ip2.x,ip2.y);
        point(ip3.x,ip3.y);
        angleMode(RADIANS);
        pop();
    }

    if(eulerline){
        push();
        stroke([200,100,50]);
        line(circumcentercoords[0], circumcentercoords[1], orthocentercoords[0], orthocentercoords[1]);
        var vc = createVector(circumcentercoords[0], circumcentercoords[1]);
        var vo = createVector(orthocentercoords[0], orthocentercoords[1]);

        var derp = atan2(vo.y - vc.y, vo.x - vc.x);
        var nx = vc.x + 1000 * cos(derp),
            ny = vc.y + 1000 * sin(derp),
            nx2 = vc.x + 1000 * -cos(derp),
            ny2 = vc.y + 1000 * -sin(derp);
        line(vo.x, vo.y, nx, ny);
        line(vc.x, vc.y, nx2, ny2);
        pop();
    }

    if(ninecircle){
        push();
        var mp = lineCenter(createVector(circumcentercoords[0], circumcentercoords[1]), createVector(orthocentercoords[0], orthocentercoords[1]));
        strokeWeight(5);
        stroke([255,125,180]);
        point(mp.x, mp.y);
        strokeWeight(1)
        noFill();
        ellipse(mp.x, mp.y, circumcircleR, circumcircleR);
        // Calculate midpoints for the sides
        var mp1 = lineCenter(v1, v2),
            mp2 = lineCenter(v1, v3),
            mp3 = lineCenter(v2, v3);
        strokeWeight(5);
        point(mp1.x, mp1.y);
        point(mp2.x, mp2.y);
        point(mp3.x, mp3.y);
        point(foot1.x, foot1.y);
        point(foot2.x, foot2.y);
        point(foot3.x, foot3.y);
        point(mid_ortho_vertex1.x, mid_ortho_vertex1.y);
        point(mid_ortho_vertex2.x, mid_ortho_vertex2.y);
        point(mid_ortho_vertex3.x, mid_ortho_vertex3.y);

        pop();
    }

    if(napoleon){
        push();
        stroke(100, 100, 255,100);
        var theta1 = atan2(v1.y - v2.y, v1.x - v2.x);
        var theta2 = atan2(v1.y - v3.y, v1.x - v3.x);
        var theta3 = atan2(v2.y - v3.y, v2.x - v3.x);
        var __sign = 1;
        strokeWeight(5);
        strokeWeight(1);
        var _theta3 = atan2(v3.y - v2.y, v3.x - v2.x);

        var _sign = 1;

        if((theta1 < theta2 && theta3 > theta2)){
            _sign = -1;
        }
        if(theta1 > _theta3 && theta2 < theta3){
            _sign = -1;
        }
        if(theta1 > _theta3 && theta1 < theta2){
            _sign = -1;
        }

        var d = dist(v1.x, v1.y, v2.x, v2.y);
        var nx = v1.x + d * cos(theta1-(TWO_PI/3) * _sign),
            ny = v1.y + d * sin(theta1-(TWO_PI/3) * _sign);
        line(v1.x, v1.y, nx, ny);
        line(v2.x, v2.y, nx, ny);
        var mp1 = lineCenter(v1, v2);
        var l1 = [createVector(nx, ny), mp1];
        var mp2 = lineCenter(v1, createVector(nx, ny));
        var l2 = [v2, mp2];
        var ip1 = intersectionPoint(l1,l2);
        strokeWeight(5);
        point(ip1.x, ip1.y);
        strokeWeight(1);

        var d = dist(v1.x, v1.y, v3.x, v3.y);
        var nx = v1.x + d * cos(theta2+(TWO_PI/3)*_sign),
            ny = v1.y + d * sin(theta2+(TWO_PI/3)*_sign);
        line(v1.x, v1.y, nx, ny);
        line(v3.x, v3.y, nx, ny);
        var mp1 = lineCenter(v1, v3);
        var l1 = [createVector(nx, ny), mp1];
        var mp2 = lineCenter(v1, createVector(nx, ny));
        var l2 = [v3, mp2];
        var ip2 = intersectionPoint(l1,l2);
        strokeWeight(5);
        point(ip2.x, ip2.y);
        strokeWeight(1);

        var d = dist(v2.x, v2.y, v3.x, v3.y);
        var nx = v2.x + d * cos(theta3-(TWO_PI/3)*_sign),
            ny = v2.y + d * sin(theta3-(TWO_PI/3)*_sign);
        line(v2.x, v2.y, nx, ny);
        line(v3.x, v3.y, nx, ny);
        var mp1 = lineCenter(v2, v3);
        var l1 = [createVector(nx, ny), mp1];
        var mp2 = lineCenter(v2, createVector(nx, ny));
        var l2 = [v3, mp2];
        var ip3 = intersectionPoint(l1,l2);
        strokeWeight(5);
        point(ip3.x, ip3.y);
        strokeWeight(1);
        line(ip1.x, ip1.y, ip2.x, ip2.y);
        line(ip1.x, ip1.y, ip3.x, ip3.y);
        line(ip2.x, ip2.y, ip3.x, ip3.y);
        pop();
    }
}

function mouseDragged(){
    for(var i = 0; i < vertices.length; i++){
        var v = vertices[i];
        if(dist(pmouseX, pmouseY, v.x, v.y) < 10){
            v.x = mouseX;
            v.y = mouseY;
        }
    }
}

function bisector(line1, line2){
    var x1 = line1[0].x,
        y1 = line1[0].y,
        x2 = line1[1].x,
        y2 = line1[1].y;
    var a1 = -atan(line1[1].y - line1[0].y, line1[1].x - line1[0].x),
        a2 = -atan(line2[1].y - line2[0].y, line2[1].x - line2[0].x);
}

function perpendicularBisector(v1, v2, size){
    var l1 = parallelLine(v1, v2, size),
        l2 = parallelLine(v1, v2, -size);
    var p1 = lineCenter(l1[0], l1[1]),
        p2 = lineCenter(l2[0], l2[1]);
    return [p1, p2];
}

function parallelLine(v1, v2, size){
    var angle = -atan((v2.y - v1.y) / (v2.x - v1.x));
    var x1 = cos(HALF_PI - angle) * size,
        y1 = sin(HALF_PI - angle) * size,
        x2 = cos(HALF_PI - angle) * size,
        y2 = sin(HALF_PI - angle) * size;
    var p1 = createVector(v1.x + x1, v1.y + y1),
        p2 = createVector(v2.x + x2, v2.y + y2);
    return [p1, p2];
}

function lineCenter(v1, v2){
    return createVector((v1.x + v2.x) / 2, (v1.y + v2.y) / 2);
}

function intersectionPoint(line1, line2){
    var x1 = line1[0].x,
        y1 = line1[0].y,
        x2 = line1[1].x,
        y2 = line1[1].y,
        x3 = line2[0].x,
        y3 = line2[0].y,
        x4 = line2[1].x,
        y4 = line2[1].y;
    var x = ((((x1 * y2) - (y1 * x2)) * (x3 - x4)) - (x1 - x2) * ((x3*y4) - (y3*x4))) / ((x1 - x2) * (y3 - y4) - (y1 - y2)*(x3 - x4)),
        y = (((x1*y2) - (y1*x2))*(y3 - y4) - (y1-y2)*((x3*y4) - (y3*x4))) /  (   (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4)        );
    return createVector(x, y);
}

function showOptions(){
    textFont('Courier New',15);
    option('Circumcenter',    [255, 0, 0],   15, circumcenter);
    option('Medicenter',      [0, 255,0],    30, medicenter);
    option('Orthocenter',     [0, 255, 255],   45, orthocenter);
    option('Incenter',        [220, 0, 220], 60, incenter);
    option('Euler\'s line', [200,100,50], 75, eulerline);
    option('Morley\'s Triangle', [255, 255, 0], 90, morley);
    option('Napoleon\'s Triangle', [100, 100, 255], 105, napoleon);
    option('Nine-point Circle', [255,125,180], 120, ninecircle);
}

function option(t, c, y, on){
    stroke(c);

    if(on){
        fill(c);
    } else {
        noFill();
    }
    ellipse(10, y-5, 10, 10);
    stroke(255);
    fill(255);
    text(t, 20, y);
}

function mousePressed(){
    if(dist(mouseX, mouseY, 10,10) <= 5){
        circumcenter = !circumcenter;
    }
    if(dist(mouseX, mouseY, 10,25) <= 5){
        medicenter = !medicenter;
    }
    if(dist(mouseX, mouseY, 10,40) <= 5){
        orthocenter = !orthocenter;
    }
    if(dist(mouseX, mouseY, 10,55) <= 5){
        incenter = !incenter;
    }
    if(dist(mouseX, mouseY, 10,70) <= 5){
        eulerline = !eulerline;
    }
    if(dist(mouseX, mouseY, 10,85) <= 5){
        morley = !morley;
    }
    if(dist(mouseX, mouseY, 10,100) <= 5){
        napoleon = !napoleon;
    }
    if(dist(mouseX, mouseY, 10,115) <= 5){
        ninecircle = !ninecircle;
    }
}

function sign(n){
    return n < 0 ? -1 : 1;
}
