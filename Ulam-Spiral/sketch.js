/* Software distributed under MIT License, read the
   accompanying LICENSE.txt file for more information. */

var assets = {"pi"     : {"loaded1": false, "loaded2": false, "path1": "constants/pi_1.txt",      "path2": "constants/pi_2.txt",      "data": []},
              "e"      : {"loaded1": false, "loaded2": false, "path1": "constants/e_1.txt",       "path2": "constants/e_2.txt",       "data": []},
              "root2"  : {"loaded1": false, "loaded2": false, "path1": "constants/root2_1.txt",   "path2": "constants/root2_2.txt",   "data": []},
              "phi"    : {"loaded1": false, "loaded2": false, "path1": "constants/phi_1.txt",     "path2": "constants/phi_2.txt",     "data": []},
              "primes" : {"loaded1": false, "loaded2": false, "path1": "constants/primes_1.json", "path2": "constants/primes_2.json", "data": []}
              };

// Controls
var inWidth, inHeight,
    pPixelSize, sldPixelSize,
    pSpeed, sldSpeed,
    cbPrimeColor, selType,
    selConstant, selRotation,
    selStartingDirection, btnGenerate;

// Global variables
var gi = 0,             // Global index
    ul = 1000000,       // Upper limit for gi
    animation = false,  // Animation currently active?
    gc = 'pi',          // Global constant (default pi)
    s = 5,              // Pixel size
    // Enum constants
    enum_const = ['pi', 'e', 'root2', 'phi', 'primes', 'primes_odd'];

var COLORS = [];
var _UP    = 0,
    _RIGHT = 1,
    _DOWN  = 2,
    _LEFT  = 3;
var _CLOCKWISE = 0,
    _COUNTER_CLOCKWISE = 1;
var cdir = _UP,
    crot = _CLOCKWISE;

var cx = 0,
    cy = 0;
var max_x = 0, max_y = 0,
    min_x = 0, min_y = 0;

function setup(){
    createCanvas(500, 500).parent('the_canvas');
    createControls();
    createColors();

    frameRate(30);
    background(0);
    rectMode(CENTER);
    noLoop();
}

function createColors(){
    COLORS.push([255, 0, 0]);
    COLORS.push([  0, 255,   0]);
    COLORS.push([255, 225,  25]);
    COLORS.push([  0, 130, 200]);
    COLORS.push([245, 130,  48]);
    COLORS.push([145,  30, 180]);
    COLORS.push([ 70, 240, 240]);
    COLORS.push([250, 190, 190]);
    COLORS.push([240,  50, 230]);
    COLORS.push([170, 110,  40]);
}

function draw(){
    if(!animation){
        noLoop();
        return;
    }
    var rate = getRate();
    translate(width / 2, height / 2);
    if(rate['rate'] == 1 || !(frameCount % rate['rate'])){
        for(var _x_ = 0; _x_ < rate['ipf']; _x_++){
            var dig = 0;
            if(gc == 'primes' || gc == 'primes_odd'){
                c = [255,255,255];
                if(gc == 'primes'){
                    var ip = isPrime(gi+1);
                } else if(gc == 'primes_odd'){
                    var ip = gi == 0 ? 0 : isPrime(gi*2+1);
                }

                if(ip != -1){
                    last_prime_pos = ip;
                    c = [255,0,0];
                    let _last_digit;
                    if(gc == 'primes'){
                        _last_digit = (gi+1).toString().split('').reverse()[0];
                    } else if(gc == 'primes_odd'){
                        _last_digit = (gi == 0 ? 0 : (gi*2)+1).toString().split('').reverse()[0];
                    }
                    if(cbPrimeColor.checked()){
                        c = COLORS[_last_digit*1];
                    } else {
                        c = [255, 0, 0];
                    }
                }
            } else {
                dig = getDigitFromConstant(gi);
                if(dig === -1){
                    var c = [0, 0, 0];
                } else {
                    var c = COLORS[dig];
                }
            }
            noStroke();
            fill(c);
            if(selType.value() == 0){
                rect(cx * s, cy * s , s, s);
            } else {
                var n = dig;
                switch(gc){
                    case 'primes':
                        n = gi+1;
                        break;
                    case 'primes_odd':
                        n = gi == 0 ? '2' : gi*2+1;
                        break;
                }
                text(n, cx * s, cy * s);
            }
            gi++;
            if(gi > ul){
                start();
                noLoop();
                return;
            }

            switch(cdir){
                case _UP:
                    cy -= 1;
                    if(cy < max_y){
                        max_y = cy;
                        cdir = crot == _CLOCKWISE ? _RIGHT : _LEFT;
                    }
                    break;
                case _RIGHT:
                    cx += 1;
                    if(cx > max_x){
                        max_x = cx;
                        cdir = crot == _CLOCKWISE ? _DOWN : _UP;
                    }
                    break;
                case _DOWN:
                    cy += 1;
                    if(cy > min_y){
                        min_y = cy;
                        cdir = crot == _CLOCKWISE ? _LEFT : _RIGHT;
                    }
                    break;
                case _LEFT:
                    cx -= 1;
                    if(cx < min_x){
                        min_x = cx;
                        cdir = crot == _CLOCKWISE ? _UP : _DOWN;

                    }
            }
        }

    }
}

function getDigitFromConstant(i){
   var c = 100000;
   if(i >= 1000000){
       return -1;
   }
   return assets[gc]['data'][parseInt(i/c)][i%c];
}

function isPrime(p){
    var c = 100000;
    if(parseInt(p/c) >= 20){
        return -1;
    }
    return assets['primes']['data'][parseInt(p/c)].indexOf(p);
}

function createControls(){
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

    var divTmp = createDiv('');
        divTmp.parent('right_side');
        divTmp.style('float', 'left');
        divTmp.style('padding-right', '25px');
    pPixelSize = createP('Pixel size: 20').parent(divTmp);
    sldPixelSize = createSlider(2,50,20,1).parent(divTmp);
    sldPixelSize.changed(function(){
        pPixelSize.html('Pixel size: '+this.value());
    });

    var divTmp = createDiv('');
        divTmp.parent('right_side');
        divTmp.style('float', 'left');
    pSpeed = createP('Speed: VERY SLOW').parent(divTmp);
    sldSpeed = createSlider(1,5,1,1).parent(divTmp);
    sldSpeed.changed(function(){
        var speeds = ['VERY SLOW', 'SLOW', 'MEDIUM', 'FAST', 'VERY FAST'];
        pSpeed.html('Speed: '+speeds[this.value()-1]);
    });

    createDiv('').style('clear', 'both').parent('right_side');
    var divTmp = createDiv('');
        divTmp.parent('right_side');
        divTmp.style('float', 'left');
        divTmp.style('padding-right', '25px');
    createP('Constant:').parent(divTmp).style('clear', 'both');
    selConstant = createSelect().parent(divTmp);
    selConstant.option("Pi",0);
    selConstant.option("Euler's number",1);
    selConstant.option("Square root of 2",2);
    selConstant.option("Golden ratio",3);
    selConstant.option("Primes",4);
    selConstant.option("Primes (odd numbers)",5);
    var divTmp = createDiv('');
        divTmp.parent('right_side');
        divTmp.style('float', 'left');
    createP('Type:').parent(divTmp);
    selType = createSelect().parent(divTmp);
    selType.option('Squares', 0);
    selType.option('Numbers', 1);
    createDiv('').style('clear', 'both').parent('right_side').style('margin-bottom','20px');

    cbPrimeColor  = createCheckbox('Color last digit of primes', false);
    cbPrimeColor.parent('right_side');
    var divTmp = createDiv('');
        divTmp.parent('right_side');
        divTmp.style('float', 'left');
        divTmp.style('padding-right', '25px');
        divTmp.style('clear', 'both');
    createP('Rotation:').parent(divTmp);
    selRotation = createSelect().parent(divTmp);
    selRotation.option('Clockwise', _CLOCKWISE);
    selRotation.option('Counter clockwise', _COUNTER_CLOCKWISE);
    var divTmp = createDiv('');
        divTmp.parent('right_side');
        divTmp.style('float', 'left');
    createP('Starting direction:').parent(divTmp);
    selStartingDirection = createSelect().parent(divTmp);
    selStartingDirection.option('Up', _UP);
    selStartingDirection.option('Right', _RIGHT);
    selStartingDirection.option('Down', _DOWN);
    selStartingDirection.option('Left', _LEFT);
    createDiv('').style('clear', 'both').parent('right_side').style('margin-bottom','20px');
    btnGenerate = createButton('Generate').parent('right_side').mousePressed(start);
    createP('').parent('right_side');
    createButton('Save Image').parent('right_side').mousePressed(function(){
        saveCanvas();
    });;
}

function start(){
    // If already running, just stop
    if(animation){
        animation = false;
        noLoop();
        btnGenerate.html('Generate');
        return;
    }
    // Setup canvas
    resizeCanvas(inWidth.value(), inHeight.value());
    background(0);
    s = sldPixelSize.value();
    btnGenerate.html('Stop');
    resetGlobalVariables();
    ul = getUpperLimit();
    if(checkLoadedConstant()){
        animation = true;
        loop();
    } else {
        fill(255);
        stroke(255);
        text('Loading',width/2, height/2);
        animation = false;
        noLoop();
        loadConstant();
    }
}

function checkLoadedConstant(){
    if(gc == 'primes' || gc == 'primes_odd'){
        return ul < 500000 ? assets['primes']['loaded1'] : assets['primes']['loaded2'];
    } else {
        return ul < 500000 ? assets[gc]['loaded1'] : assets[gc]['loaded2'];
    }
}

function loadConstant(){
    if(gc == 'primes' || gc == 'primes_odd'){
        if(assets['primes']['loaded1'] == false){
            loadJSON(assets['primes']['path1'], function(res){
                assets['primes']['data'] = res['primes'];
                assets['primes']['loaded1'] = true;
                if(ul >= 500000){
                    loadJSON(assets['primes']['path2'], _cb_jsonLoaded);
                    return;
                }

                animation = true;
                background(0);
                loop();
            });
            return;
        }
        if((ul >= 500000) && assets['primes']['loaded2'] == false){
            loadJSON(assets['primes']['path2'], _cb_jsonLoaded);
            return;
        }
    } else {
        if(assets[gc]['loaded1'] == false){
            loadStrings(assets[gc]['path1'], function(result){
                assets[gc]['data'] = result;
                assets[gc]['loaded1'] = true;
                if(ul >= 500000){
                    loadStrings(assets[gc]['path2'], _cb_assetLoaded);
                    return;
                }
                animation = true;
                background(0);
                loop();
            });
        }
        if(ul >= 500000 && assets[gc]['loaded2'] == false){
            loadStrings(assets[gc]['path2'], _cb_assetLoaded);
        }
    }
}

function _cb_assetLoaded(res){
    res.forEach(function(el){
        assets[gc]['data'].push(el);
    });
    assets[gc]['loaded2'] = true;
    animation = true;
    background(0);
    loop();
}

function _cb_jsonLoaded(res){
    res['primes'].forEach(function(el){
        assets['primes']['data'].push(el);
    });
    assets['primes']['loaded2'] = true;
    animation = true;
    background(0);
    loop();
}

function resetGlobalVariables(){
    // Reset everything
    last_prime_pos = 0;
    gc = enum_const[selConstant.value()];
    gi = 0;
    cx = 0;
    cy = 0;
    min_x = 0;
    min_y = 0;
    max_x = 0;
    max_y = 0;

    cdir = selStartingDirection.value()*1;
    crot = selRotation.value()*1;
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

function getRate(){
    switch(sldSpeed.value()){
        case 1:
            return {'ipf': 1, 'rate': 20};
        case 2:
            return {'ipf': 1, 'rate': 5};
        case 3:
            return {'ipf': 1, 'rate': 1};
        case 4:
            return {'ipf': 100, 'rate': 1};
        case 5:
            return {'ipf': 500, 'rate': 1};
    }
}

function getUpperLimit(){
    var m = max(inWidth.value(), inHeight.value());
    return ((m/s) * (m/s)) + ((m/s)*4);
}
