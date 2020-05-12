//Joshua Fredrickson

import * as utils from './utils.js';

let audioCtx;

let element, sourceNode, analyserNode, gainNode, distortionNode, biquadFilter;

const AUDIO_PROPERTIES = Object.freeze({
    numSamples      : 512
});

let audioData = new Uint8Array(AUDIO_PROPERTIES.numSamples/2);

function setUpWebAudio(filePath){
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    element = new Audio();

    loadSoundFile(filePath);

    sourceNode = audioCtx.createMediaElementSource(element);

    analyserNode = audioCtx.createAnalyser();

    analyserNode.fftSize = AUDIO_PROPERTIES.numSamples;

    gainNode = audioCtx.createGain();
    gainNode.gain.value = .5;

    distortionNode = audioCtx.createWaveShaper();
    distortionNode.oversample = '4x';

    biquadFilter = audioCtx.createBiquadFilter();
    biquadFilter.type = "lowshelf";

    sourceNode.connect(analyserNode);
    analyserNode.connect(gainNode);
    gainNode.connect(distortionNode);
    distortionNode.connect(biquadFilter);
    biquadFilter.connect(audioCtx.destination);
}

//load file
function loadSoundFile(filePath){
    element.src = filePath;
}

//play music
function playCurrentSound(){
    element.play();
}

//pause music
function pauseCurrentSound(){
    element.pause();
}

//set volume in gain node
function setVolume(value){
    value = Number(value);
    gainNode.gain.value = value;
}

//set distortion in distortion node
function setDistortion(value){
    //adds a nice crunch that I quite like
    value = Number(value);
    distortionNode.curve = utils.makeDistortionCurve(value);
}

//set bass in the biquadfilter
function setBass(value){
    value = Number(value);
    biquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
    biquadFilter.gain.setValueAtTime(value, audioCtx.currentTime);
}


export{audioCtx, setUpWebAudio, playCurrentSound, pauseCurrentSound, loadSoundFile, setVolume, analyserNode,setDistortion,setBass};