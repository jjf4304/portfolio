//Author: Joshua Fredrickson
//main.js, holds the init function as well as setting up and making calls to canvas, audio and motion.
//Also handles the checking for motion input (if the motion cursor is over a button or not)

import * as canvas from './canvas.js';
import * as audio from './audio.js';
import * as motion from './motion.js';
import * as utils from './utils.js';

const AUDIO_FILES = Object.freeze({
    file1   :   "media/Rabbit Junk - We Saw The End.mp3",
    file2   :   "media/Epic_Rock_Trailer-Robert_Slump.mp3",
    file3   :   "media/Marcos_H_Bolanos_-_12_-_Extreme_Fight.mp3"
});

const PARAMS = {
    playing         : false,
    trackTitle      : "We Saw The End - Rabbit Junk",
    audioSeconds    : 0,
    audioMinutes    : 0,
    drawCircle      : true,
    rotateCircle    : true,
    drawLines       : true,
    drawBezier      : false,
    drawFreqLines   : true,
    colorChange     : false,
    motionDetection : false,
    currentVol      : .5,
    currentDist     : 0,
    currentBass     : 0,
    invertColor     : false,
    noise           : false,
    useGradient     : true,
    changeGradient  : false,
    noColor         : false,

};

let canvasElement, videoCanvas, videoElement, currentFile = AUDIO_FILES.file1, timeTracker = 0, prevMotionCursor = {x: 0, y: 0}, timeInButton = 0, buttonIndex = -1;

function init(){
    console.log("Inside Init");
    audio.setUpWebAudio(currentFile);

    canvasElement = document.querySelector("#main");
    canvas.setUpCanvas(canvasElement, audio.analyserNode, PARAMS);

    setUpUI();

    videoCanvas = document.querySelector("#cam");
    videoElement = document.querySelector('video');

    let constraints = {audio: false, video: true};
    navigator.mediaDevices.getUserMedia(constraints)
    .then(function(mediaStream){
        videoElement.srcObject = mediaStream;
        videoElement.play();
    })
    .catch(function(err){
        alert("No Webcam Detected. Motion Controls will not work.");
    })
    motion.setUpMotion(videoElement, canvas.visualWidth, videoCanvas);

    loop();
}

function loop(){
        requestAnimationFrame(loop);
        if(PARAMS.playing){
            timeTracker++;
            if(timeTracker >= 60){
                PARAMS.audioSeconds++;
                if(PARAMS.audioSeconds >= 60){
                    PARAMS.audioMinutes++;
                    PARAMS.audioSeconds = 0;
                }
                timeTracker = 0;
        }
        }
        canvas.draw(PARAMS);
        motion.drawFromCam();
        if(PARAMS.motionDetection){
            prevMotionCursor = motion.topPosition;
            motion.detectMotion();
            canvas.drawCursor(canvas.visualWidth + motion.topPosition.x, motion.topPosition.y);
            if(checkIntersect()){
                timeInButton++;
                if(timeInButton > 30){
                    setParams();
                    timeInButton = 0;
                }
            }
            else{
                buttonIndex = -1;
                timeInButton = 0;
            }
        }
    }

function setUpUI(){
    const playButton = document.querySelector('#playButton');

  playButton.onclick = e =>{
     
     //check if ctx is in suspended state
     if(audio.audioCtx.state == "suspended"){
         audio.audioCtx.resume();
     }
     //play music if paused
     if(e.target.dataset.playing == "no"){
         PARAMS.playing = true;
         audio.playCurrentSound();
         e.target.dataset.playing = "yes";
     }
     //pause music if playing
     else{
         PARAMS.playing = false;
         audio.pauseCurrentSound();
         e.target.dataset.playing = "no";
     }
     canvas.setUpButtons(PARAMS);
  };

  const fsButton = document.querySelector("#fsButton");
	
  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("init called");
    utils.goFullscreen(canvasElement);
  };

  //Track Selection
  let trackSelect = document.querySelector('#trackSelect');
  trackSelect.onchange = e =>{
    //pause if currently playing
    if(playButton.dataset.playing = "yes"){
        playButton.dispatchEvent(new MouseEvent("click"));
    }
    switch(e.target.value){
        case "1":
            audio.loadSoundFile(AUDIO_FILES.file1);
            PARAMS.trackTitle = "We Saw The End - Rabbit Junk";
            break;
        case "2":
            audio.loadSoundFile(AUDIO_FILES.file2);
            PARAMS.trackTitle = "Epic Rock - Robert Slump";
            break;
        case "3":
            audio.loadSoundFile(AUDIO_FILES.file3);
            PARAMS.trackTitle = "Extreme Fight - Marcos Bolanos";
            break;
    }
    PARAMS.audioMinutes = 0;
    PARAMS.audioSeconds = 0;
    timeTracker = 0;

  }

  //Input Setup
  
  //draw center circle visualizer
  let circleCB = document.querySelector('#circleCB');
  circleCB.onchange = e =>{
    if(e.target.checked === true)
        PARAMS.drawCircle = true;
    else
        PARAMS.drawCircle = false;
    canvas.setUpButtons(PARAMS);
  }

  //whether or not the center circle is rotating 
  let rotateCB = document.querySelector('#rotateCB');
  rotateCB.onchange = e =>{
    if(e.target.checked === true)
        PARAMS.rotateCircle = true;
    else
        PARAMS.rotateCircle = false;

    canvas.setUpButtons(PARAMS);
  }

  let noColorRB = document.querySelector('#noColorRB');
  noColorRB.onchange = e =>{
    if(e.target.checked === true){
        PARAMS.colorChange = false;
        PARAMS.useGradient = false;
        PARAMS.changeGradient = false;
        PARAMS.noColor = true;
    }
    canvas.setUpButtons(PARAMS);
  }

  //does the drawing cycle through colors or just draw white
  let colorRB = document.querySelector('#colorRB');
  colorRB.onchange = e =>{
    if(e.target.checked === true){
        PARAMS.colorChange = true;
        PARAMS.useGradient = false;
        PARAMS.changeGradient = false;
    }
    canvas.setUpButtons(PARAMS);
  }

  //use base gradient for line color
  let gradRB = document.querySelector('#gradientRB');
  gradRB.onchange = e =>{
    if(e.target.checked === true){
        PARAMS.colorChange = false;
        PARAMS.useGradient = true;
        PARAMS.changeGradient = false;
    }
    canvas.setUpButtons(PARAMS);
  }

  //use a changing gradient for line color
  let gradChangeRB = document.querySelector('#gradientChangeRB');
  gradChangeRB.onchange = e =>{
    if(e.target.checked === true){
        PARAMS.colorChange = false;
        PARAMS.useGradient = true;
        PARAMS.changeGradient = true;
    }
    canvas.setUpButtons(PARAMS);
  }

  //invert colors
  let invertCB = document.querySelector('#invertCB');
  invertCB.onchange = e =>{
    if(e.target.checked === true)
        PARAMS.invertColor = true;
    else
        PARAMS.invertColor = false;
    canvas.setUpButtons(PARAMS);
  }

  //put in noise
  let noiseCB = document.querySelector('#noiseCB');
  noiseCB.onchange = e =>{
    if(e.target.checked === true)
        PARAMS.noise = true;
    else
        PARAMS.noise = false;
    canvas.setUpButtons(PARAMS);
  }


  //draw the lines along the left and right edges
  let linesCB = document.querySelector('#linesCB');
  linesCB.onchange = e =>{
    if(e.target.checked === true)
        PARAMS.drawLines = true;
    else
        PARAMS.drawLines = false;
    canvas.setUpButtons(PARAMS);
  }

  //frequency data lines
  let freqLinesRB = document.querySelector('#freqLinesRB');
  freqLinesRB.onchange = e =>{
    if(e.target.checked === true){
        PARAMS.drawFreqLines = true;
        PARAMS.drawBezier = false;
    }
    canvas.setUpButtons(PARAMS);
  }

  //waveform lines
  let waveLinesRB = document.querySelector('#waveLinesRB');
  waveLinesRB.onchange = e =>{
    if(e.target.checked === true){
        PARAMS.drawFreqLines = false;
        PARAMS.drawBezier = false;
    }
    canvas.setUpButtons(PARAMS);
  }

  //curve lines
  let bezierRB = document.querySelector('#bezierRB');
  bezierRB.onchange = e =>{
    if(e.target.checked === true){
        PARAMS.drawFreqLines = false;
        PARAMS.drawBezier = true;
    }
    canvas.setUpButtons(PARAMS);
  }

  //Use motion tracking to track head and control volume
  let motionCB = document.querySelector("#motionCB");
  motionCB.onchange = e =>{
    if(e.target.checked === true){
        PARAMS.motionDetection = true;
        //not currently in use but I want to keep for when I return to this project. See canvas.js for explanation
        canvas.changeVolBarPos(PARAMS.currentVol);
    }
    else
        PARAMS.motionDetection = false;
  }

  //Volume Slider
  let volSlider = document.querySelector('#volumeSlider');
  volSlider.oninput = e =>{
        PARAMS.currentVol = e.target.value;
        //set audionode gain
        audio.setVolume(PARAMS.currentVol);
        //not currently in use but I want to keep for when I return to this project. See canvas.js for explanation
        canvas.changeVolBarPos(PARAMS.currentVol);
  }

  //distortion slider
  let distortSlider = document.querySelector('#distortSlider');
  distortSlider.oninput = e =>{
      PARAMS.currentDist = e.target.value;
      //set distort node curve
      audio.setDistortion(PARAMS.currentDist);
  }

  //bass slider
  let bassSlider = document.querySelector('#bassSlider');
  bassSlider.oninput = e =>{
      PARAMS.currentBass = e.target.value;
      //set distort node curve
      audio.setBass(PARAMS.currentBass);
  }
}

//Collison help found here https://stackoverflow.com/questions/306316/determine-if-two-rectangles-overlap-each-other
//Function to check intersection of the motion cursor and the buttons
function checkIntersect(){
    for(let i = 0;i <canvas.buttons.length;i++){

        let leftCornerCursorX = canvas.visualWidth + motion.topPosition.x;
        let leftCornerCursorY = motion.topPosition.y;
        let rightCornerCursorX = canvas.visualWidth + motion.topPosition.x + canvas.cursorWidth;
        let rightCornerCursorY = motion.topPosition.y + canvas.cursorWidth;

        let leftCornerButtonX = canvas.buttons[i].x;
        let leftCornerButtonY = canvas.buttons[i].y;
        let rightCornerButtonX = canvas.buttons[i].x + canvas.buttons[i].width;
        let rightCornerButtonY = canvas.buttons[i].y + canvas.buttons[i].height;

        if(leftCornerCursorX < rightCornerButtonX && rightCornerCursorX > leftCornerButtonX && leftCornerCursorY < rightCornerButtonY && rightCornerCursorY > leftCornerButtonY){
            buttonIndex = i;
            return true;
        }
    }
}

//Switch case to set the PARAMS as needed from motion controls
function setParams(){
    switch(buttonIndex){
        case 0:
            if(PARAMS.playing){
                PARAMS.playing = false;
                audio.pauseCurrentSound();
               //document.querySelector('#playButton').dataset.playing  = false;
            }
            else{
                audio.playCurrentSound();
                PARAMS.playing = true;
            }
            break;
        case 1:
            if(PARAMS.rotateCircle){
                PARAMS.rotateCircle = false;
                document.querySelector('#rotateCB').checked = false;
            }
            else{
                PARAMS.rotateCircle = true;
                document.querySelector('#rotateCB').checked = true;
            }
            break;
        case 2:
            if(PARAMS.drawLines){
                PARAMS.drawLines = false;
                document.querySelector('#linesCB').checked = false;
            }
            else{
                PARAMS.drawLines = true;
                document.querySelector('#linesCB').checked = true;
            }
            break;
        case 3:
            if(PARAMS.drawFreqLines){

            }
            else{
                document.querySelector('#freqLinesRB').checked = true;
                PARAMS.drawFreqLines = true;
                PARAMS.drawBezier = false;
            }
            break;
        case 4:
            if(!PARAMS.drawFreqLines){

            }
            else{
                PARAMS.drawFreqLines = false;
                PARAMS.drawBezier = false;
                document.querySelector('#waveLinesRB').checked = true;
            }
            break;
        case 5:
            //bez
            if(PARAMS.drawBezier){

            }
            else{
                PARAMS.drawBezier = true;
                PARAMS.drawFreqLines = false;
                document.querySelector('#bezierRB').checked = true;
            }
            break;
        case 6:
            //invert
            if(PARAMS.invertColor){
                PARAMS.invertColor = false;
                document.querySelector('#invertCB').checked = false;
            }
            else{
                PARAMS.invertColor = true;
                document.querySelector('#invertCB').checked = true;
            }
            break;
        case 7:
            //noise
            if(PARAMS.noise){
                PARAMS.noise = false;
                document.querySelector('#noiseCB').checked = false;
            }
            else{
                PARAMS.noise = true;
                document.querySelector('#noiseCB').checked = true;
            }
            break;
        case 8: 
            //gradient
            if(PARAMS.useGradient){

            }
            else{
                PARAMS.noColor = false;
                PARAMS.useGradient = true;
                PARAMS.changeGradient = false;
                PARAMS.colorChange = false;
                document.querySelector('#gradientRB').checked = true;
            }
            break;
        case 9:
            //changing grad
            if(PARAMS.changeGradient){

            }
            else{
                PARAMS.noColor = false;
                PARAMS.useGradient = false;
                PARAMS.changeGradient = true;
                PARAMS.colorChange = false;
                document.querySelector('#gradientChangeRB').checked = true;
            }
            break;
        case 10:
            //changing colors
            if(PARAMS.colorChange){

            }
            else{
                PARAMS.noColor = false;
                PARAMS.useGradient = false;
                PARAMS.changeGradient = false;
                PARAMS.colorChange = true;
                document.querySelector('#colorRB').checked = true;
            }
            break;


    }
    canvas.setUpButtons(PARAMS);
}

export{init};