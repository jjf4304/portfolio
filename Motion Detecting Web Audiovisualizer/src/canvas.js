import * as utils from './utils.js';
import * as motion from './motion.js';

//main canvas element and size
let ctx, canvasWidth, canvasHeight, visualWidth;
//side canvas elements and size. Left is vol. Need to finalize what right is
let ctrlCanvasWidth, ctrlCanvasHeight, ctrlCanvasStartX;

//ctrl bar/slider set ups, need one more for the other slider
let maxCtrlBarHeight, currentVolBarHeight, currentDistortBarHeight, ctrlSliderWidth, ctrlOptionBarWidth, ctrlBarWidth, ctrlBarHeight;

//color gradient variables
let colorGradient;

let stop1 = {r : 252, g: 53 , b : 76};
let stop2 =  {r : 10, g: 191 , b : 188};
let stop3 =  {r : 56, g: 239 , b : 125};

//Definition of an option button for use in motion controls
function OptionButton(x,y,width,height, name, value){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.name = name;
    this.value = value;
}

//array of OptionButtons
let buttons = [];

let imgData;

//positiions/variables to be used when drawing lines
let xPos, yPos;

let topLeftStart = {x : 0, y : 0};
let topRightStart = {x : 0, y : 0};
let botLeftStart = {x : 0, y : 0};
let botRightStart = {x : 0, y : 0};

let analyserNode, freqAudioData, waveAudioData, buffer,rotation, colorIterator;

//More button canvas variables
let startVol;
let startDistort;
let startButtons;
let strokeColor;

let fontY = 25;
let cursorWidth = 30;
let optionRectStartY = 50;

//set up all canvas variables
function setUpCanvas(mainCanvasElement, analyserNodeRef, params={}){
    ctx = mainCanvasElement.getContext("2d");
    canvasWidth = mainCanvasElement.width; 
    visualWidth = (canvasWidth/10)*6; //600
    canvasHeight = mainCanvasElement.height;


    colorGradient = utils.createLinearGradient(ctx, 0,0,visualWidth, 0, [{percent: 0, color: `rgb(${stop1.r},${stop1.g},${stop1.b})`},
        {percent: .5, color: `rgb(${stop2.r},${stop2.g},${stop2.b})`},{percent: 1, color:`rgb(${stop3.r},${stop3.g},${stop3.b})`}]);

    topRightStart.x = visualWidth;

    botLeftStart.y = canvasHeight;

    botRightStart.x = visualWidth;
    botRightStart.y = canvasHeight;

    ctrlCanvasWidth = canvasWidth/10;
    ctrlCanvasHeight = canvasHeight;

    maxCtrlBarHeight = ctrlCanvasHeight - 100;
    currentVolBarHeight = maxCtrlBarHeight/2;
    currentDistortBarHeight = maxCtrlBarHeight/2;
    ctrlSliderWidth = ctrlCanvasWidth/5;

    ctrlBarWidth = ctrlCanvasWidth-20;
    ctrlOptionBarWidth = (ctrlCanvasWidth-2) + 20;
    ctrlBarHeight = 30;

    rotation = 0;
    colorIterator = 0;
    analyserNode = analyserNodeRef;


    buffer = analyserNode.frequencyBinCount;
    freqAudioData = new Uint8Array(buffer);
    waveAudioData = new Uint8Array(buffer)

    xPos = visualWidth/2;
    yPos = visualWidth/2

    startVol = visualWidth;
    startDistort = visualWidth + ctrlCanvasWidth;
    startButtons = startDistort + ctrlCanvasWidth;

    //setup buttons
    setUpButtons(params);
}

function draw(params={}){
    analyserNode.getByteFrequencyData(freqAudioData);
    analyserNode.getByteTimeDomainData(waveAudioData);

    //draw canvas
    utils.drawRect(ctx, 0,0, canvasWidth, canvasHeight, "black", "white", .1);

    ctx.save();

    //draw changing colors if checked
    if(params.colorChange){
        strokeColor = utils.changeColor(colorIterator);
        colorIterator++;
    }
    else if(params.useGradient){
        if(params.changeGradient){ //gives a changing gradient, although a little janky
            stop1.r+=1;
            if(stop1.r > 255)
                stop1.r = 0;
            stop1.g+=1;
            if(stop1.g > 255)
                stop1.g = 0;
            stop1.b+=1;
            if(stop1.b > 255)
                stop1.b = 0;
            stop2.r+=1;
            if(stop2.r > 255)
                stop2.r = 0;
            stop2.g+=1;
            if(stop2.g > 255)
                stop2.g = 0;
            stop2.b+=1;
            if(stop2.b > 255)
                stop2.b = 0;
            colorGradient = utils.createLinearGradient(ctx, 0,0,visualWidth, 0, [{percent: 0, color: `rgb(${stop1.r},${stop1.g},${stop1.b})`},{percent: 1, color: `rgb(${stop2.r},${stop2.g},${stop2.b})`}]);
        }
        strokeColor = colorGradient;
    }
    else{
        strokeColor = "rgba(255,255,255,.5)";
    }

    //draw bars in circle
    if(params.drawCircle){
        let angleChange = (analyserNode.fftSize/2);
        let distFromCenter = 50;
        let barWidth = 5;
        let barHeight = 5;
        ctx.save();
        ctx.translate(xPos, yPos);
        //Rotate the entire circle if checked
        if(params.rotateCircle){
            ctx.rotate(rotation*(Math.PI/360));
            rotation += .5;   
        }
        //solution to not have the first bars extremely large.
        for(let i = 30; i < freqAudioData.length-30; i++){
            ctx.save();
            ctx.rotate(i*(Math.PI/100));
            utils.drawRect(ctx, 0,distFromCenter, barWidth, (barHeight + freqAudioData[i]),"black", strokeColor, 5,1);
            ctx.restore();


        }
        ctx.restore();
    }
    //draw lines 
    if(params.drawLines){
        //Quadratic curves in a Infinity symbol
        //changed slightly by the avg frequency
        if(params.drawBezier){
            let avgFreq = 0;
            //set ctrl poinjts along line based on avg freq?
            for(let i = 0; i < freqAudioData.length; i++){
                avgFreq+=freqAudioData[i];
            }
            avgFreq/=freqAudioData.length;

            let controlPoint1 = {x:visualWidth/5, y:canvasHeight/3};
            let controlPoint2 = {x:visualWidth - (visualWidth/5), y: canvasHeight -(canvasHeight/3)}

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(0, canvasHeight/2);
            ctx.quadraticCurveTo(controlPoint1.x, controlPoint1.y -avgFreq, visualWidth/2, canvasHeight/2);
            ctx.quadraticCurveTo(controlPoint2.x, controlPoint2.y + avgFreq, visualWidth, canvasHeight/2);
            ctx.strokeStyle = strokeColor;
            ctx.stroke();
            ctx.closePath();
            ctx.restore();

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(visualWidth, canvasHeight/2);
            ctx.quadraticCurveTo(controlPoint2.x, controlPoint1.y - avgFreq, visualWidth/2, canvasHeight/2);
            ctx.quadraticCurveTo(controlPoint1.x, controlPoint2.y + avgFreq, 0, canvasHeight/2);
            ctx.strokeStyle = strokeColor;
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }
        else{
            //Draw 4 lines from each corner
            let angle = Math.atan2(yPos, xPos);
            drawCornerLines(topLeftStart.x, topLeftStart.y, xPos, yPos, angle, strokeColor, params.drawFreqLines);
            drawCornerLines(topRightStart.x, topRightStart.y, xPos, yPos, Math.PI-angle, strokeColor, params.drawFreqLines);
            drawCornerLines(botLeftStart.x, botLeftStart.y, xPos, yPos, -angle, strokeColor, params.drawFreqLines);
            drawCornerLines(botRightStart.x, botRightStart.y, xPos, yPos, Math.PI+angle, strokeColor, params.drawFreqLines);
        }
    }

    ctx.restore();

    let volNum = (maxCtrlBarHeight - currentVolBarHeight)/maxCtrlBarHeight;
    let distortionNum = (maxCtrlBarHeight - currentDistortBarHeight)/maxCtrlBarHeight;
    //draw ctrl sliders

    //************ATTENTION****************
    //All commented out code below is taken out for now until I revisit this project. It was meant to be sliders for motion control, but it was giving me too many
    //issues. I want to make it work, but don't have the time at this moment. 


    if(params.motionDetection){
        //Taken out for now. Was causing too many issues
        // utils.drawText(ctx, startVol + (ctrlCanvasWidth/2), fontY, "15px Syncopate", 1, `Volume: ${volNum}`,strokeColor);
        // utils.drawText(ctx, startDistort + (ctrlCanvasWidth/2), fontY, "15px Syncopate", 1, `Distortion: ${distortionNum}`,strokeColor);
        // utils.drawRect(ctx, startVol+(ctrlCanvasWidth/2) - (ctrlSliderWidth/2), optionRectStartY, ctrlSliderWidth, maxCtrlBarHeight, strokeColor, "black",5, .6);
        // utils.drawRect(ctx, startDistort+ (ctrlCanvasWidth/2) - (ctrlSliderWidth/2), optionRectStartY, ctrlSliderWidth, maxCtrlBarHeight, strokeColor, "black",5, .6);
        // utils.drawRect(ctx, startVol + (ctrlCanvasWidth -ctrlBarWidth)/2,currentVolBarHeight + 50, ctrlBarWidth, ctrlBarHeight, strokeColor, "black", 5,1);
        // utils.drawRect(ctx, startDistort + (ctrlCanvasWidth -ctrlBarWidth)/2,currentDistortBarHeight + 50, ctrlBarWidth, ctrlBarHeight, strokeColor, "black",5, 1);

        //options

        drawOptions(1,startButtons,optionRectStartY,fontY,colorGradient);
    }
    else{
        // utils.drawText(ctx, startVol + (ctrlCanvasWidth/2), fontY, "15px Syncopate", .1, `Volume: ${volNum}`,strokeColor);
        // utils.drawText(ctx, startDistort + (ctrlCanvasWidth/2), fontY, "15px Syncopate", .1, `Distortion: ${distortionNum}`,strokeColor);
        // utils.drawRect(ctx, startVol + (ctrlCanvasWidth/2) - (ctrlSliderWidth/2), optionRectStartY, ctrlSliderWidth, maxCtrlBarHeight, strokeColor, "black",5, .1);
        // utils.drawRect(ctx, startDistort + (ctrlCanvasWidth/2) - (ctrlSliderWidth/2), optionRectStartY, ctrlSliderWidth, maxCtrlBarHeight, strokeColor, "black",5, .1);

        //options
        drawOptions(.1,startButtons,optionRectStartY,fontY, colorGradient);
    }

    utils.drawText(ctx, visualWidth/2, fontY,"18px Syncopate",1, params.trackTitle, strokeColor);
    utils.drawText(ctx, visualWidth/2, canvasHeight-fontY, "18px Syncopate", 1, `${params.audioMinutes}:${params.audioSeconds}`, strokeColor);

    //draw ctrl 

    if(params.motionDetection){
        // utils.drawRect(ctx, startVol + (ctrlCanvasWidth -ctrlBarWidth)/2,currentVolBarHeight + 50, ctrlBarWidth, ctrlBarHeight, strokeColor, "black", 1);
        // utils.drawRect(ctx, startDistort + (ctrlCanvasWidth -ctrlBarWidth)/2,currentDistortBarHeight + 50, ctrlBarWidth, ctrlBarHeight, strokeColor, "black", 1);

    }
    else{
        // utils.drawRect(ctx, startVol + (ctrlCanvasWidth -ctrlBarWidth)/2,currentVolBarHeight + 50, ctrlBarWidth, ctrlBarHeight, strokeColor, "black", .1);
        // utils.drawRect(ctx, startDistort + (ctrlCanvasWidth -ctrlBarWidth)/2,currentDistortBarHeight + 50, ctrlBarWidth, ctrlBarHeight, strokeColor, "black", .1);
    }
    
    let imageData = ctx.getImageData(0,0,canvasWidth,canvasHeight);
    imgData = imageData.data;

    //do effects

    for(let i = 0; i < imgData.length; i+=4){

        //noise
        if(params.noise && Math.random() < .02){
            imgData[i] = 0;
            imgData[i+1] = 209;
            imgData[i+2] = 79;
        } 

        //invert
        if(params.invertColor){
            imgData[i] = 255 - imgData[i];
            imgData[i+1] = 255 - imgData[i+1];
            imgData[i+2] = 255 - imgData[i+2];
        }
    }


    ctx.putImageData(imageData, 0,0);
}
//Not currently used, was for the motion control sliders
function changeVolBarPos(newYPos){
    currentVolBarHeight = maxCtrlBarHeight - (newYPos*maxCtrlBarHeight);
}


function setImgData(data){
    imgData = data;
}

//Same as changeVolBarPos
function changeDistortBarPos(newYPos){
    currentDistortBarHeight = maxCtrlBarHeight - (newYPos*maxCtrlBarHeight);
}

//dtraw lines from the corner towards the center.
function drawCornerLines(startX, startY, centerX, centerY, angle, strokeColor, drawFreqLine){

    let dirToCenter = {x : 0, y : 0};
    let normalVector = {x : 0, y : 0};
    let step = 0, nextX = 0;
    let turn = .2;
    dirToCenter.x = centerX - startX;
    dirToCenter.y = centerY - startY;
    step = 2*utils.magnitude(dirToCenter)/buffer;
    dirToCenter = utils.normalize(dirToCenter);

    normalVector.x = dirToCenter.y;
    normalVector.y = dirToCenter.x;
    ctx.save();
    ctx.beginPath();
    ctx.translate(startX, startY);
    ctx.rotate(angle);
    ctx.moveTo(0, 0);
    for(let i = 20; i < buffer; i+=2){
        if(drawFreqLine)
            ctx.lineTo(nextX, turn*freqAudioData[i]);
        else
            ctx.lineTo(nextX, turn*waveAudioData[i]);
        turn*=-1;
        nextX+=step;
    }
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
    
}

//set up the motion control buttons based on parameters from main.js
function setUpButtons(params={}){
    let optionButtonStartX = startButtons + ((canvasWidth-startButtons)/2) - ctrlOptionBarWidth/2;
    let buttonTextStartX = startButtons + (canvasWidth-startButtons)/2;
    let barHeightMod =  (optionRectStartY + 1);

    buttons[0] = new OptionButton(optionButtonStartX, optionRectStartY, ctrlOptionBarWidth, ctrlBarHeight, "Play", params.playing)
    buttons[1] = new OptionButton(optionButtonStartX, optionRectStartY+barHeightMod, ctrlOptionBarWidth, ctrlBarHeight, "Rotate Circle", params.rotateCircle);
    buttons[2] = new OptionButton(optionButtonStartX, optionRectStartY+barHeightMod*2, ctrlOptionBarWidth, ctrlBarHeight, "Show Lines", params.drawLines);
    buttons[3] = new OptionButton(optionButtonStartX, optionRectStartY+barHeightMod*3, ctrlOptionBarWidth, ctrlBarHeight, "Freq Lines", params.drawFreqLines);
    buttons[4] = new OptionButton(optionButtonStartX, optionRectStartY+barHeightMod*4, ctrlOptionBarWidth, ctrlBarHeight, "Wave Lines", !params.drawFreqLines);
    buttons[5] = new OptionButton( optionButtonStartX, optionRectStartY+barHeightMod*5, ctrlOptionBarWidth, ctrlBarHeight, "Quad Lines", params.drawBezier);
    buttons[6] = new OptionButton( optionButtonStartX, optionRectStartY+barHeightMod*6, ctrlOptionBarWidth, ctrlBarHeight, "Invert", params.invertColor);
    buttons[7] = new OptionButton(optionButtonStartX, optionRectStartY+barHeightMod*7, ctrlOptionBarWidth, ctrlBarHeight, "Noise", params.noise);
    buttons[8] = new OptionButton( optionButtonStartX, optionRectStartY+barHeightMod*8, ctrlOptionBarWidth, ctrlBarHeight,"Gradient Color", params.useGradient);
    buttons[9] = new OptionButton(optionButtonStartX, optionRectStartY+barHeightMod*9, ctrlOptionBarWidth, ctrlBarHeight,"Changing Gradient", params.changeGradient);
    buttons[10] = new OptionButton( optionButtonStartX, optionRectStartY+barHeightMod*10, ctrlOptionBarWidth, ctrlBarHeight, "Changing Colors", params.colorChange);
}

//Draw all motion control buttons
function drawOptions(alpha, startButtons,optionRectStartY, fontY, fillColor){
    let buttonTextStartX = startButtons + (canvasWidth-startButtons)/2;

    for(let i = 0; i < buttons.length; i++){
        let color = "whitesmoke";
        if(buttons[i].value){
            color = fillColor;
        }
        utils.drawRect(ctx, buttons[i].x, buttons[i].y, buttons[i].width, buttons[i].height, color, "black", 5, alpha);
        utils.drawText(ctx, buttonTextStartX, buttons[i].y + ctrlBarHeight/2, "9px Syncopate", alpha, buttons[i].name, "black");
    }


}

function drawCursor(startX, startY){
    utils.drawRect(ctx, startX, startY, cursorWidth, cursorWidth, "red", "white", 2, 1);
}

export{setUpCanvas, draw, changeVolBarPos, changeDistortBarPos, visualWidth,setImgData, imgData, drawCursor,cursorWidth, buttons, setUpButtons};