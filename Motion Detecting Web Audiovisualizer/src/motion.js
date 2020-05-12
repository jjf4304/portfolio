//Author: Joshua Fredrickson
//Handles Motion Control
//detectMotion originally created by the Professors and modified for my needs.

let vtx, videoCtx;
let startDetectX, detectWidth, detectHeight, vCtxWidth, vCtxHeight;
// control posiiton to state where highest change in motion is.
//will act like a cursor's coordinates
let topPosition;

let imageData, frameData, prevFrameData = null;

//Used this source to help set up webcam, as well as the in class web audio motion detection demo
//https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
function setUpMotion(videoElement, ctrlStartX, videoCanvas){
    console.log("Inside Motion");
    vtx = videoElement;
    vCtxWidth = videoCanvas.width;
    vCtxHeight = videoCanvas.height;
    startDetectX = ctrlStartX;
    detectHeight = vtx.clientHeight;
    videoCtx = videoCanvas.getContext("2d");
    topPosition = {x : vCtxWidth, y : vCtxHeight};
    

}

//Prety much from your demo, changed slightly, I want to try and see if there are better ways of doing it
function detectMotion(){
    topPosition.y = vCtxHeight;
    topPosition.x =vCtxWidth;
    imageData = videoCtx.getImageData(0,0,vCtxWidth,vCtxHeight);
    frameData = imageData.data;

    if(prevFrameData != null){
        for( var y = 0 ; y < vCtxHeight; y++ ) {
            for( var x = 0 ; x < vCtxWidth-startDetectX; x++ ) {
            
                var indexOld = (y * vCtxWidth + x) * 4, oldr = prevFrameData[indexOld], oldg = prevFrameData[indexOld+1], oldb = prevFrameData[indexOld+2], olda = prevFrameData[indexOld+3];
                var indexNew = (y * vCtxWidth + x) * 4, r = frameData[indexNew], g = frameData[indexNew+1], b = frameData[indexNew+2], a = frameData[indexNew+3];
                if (oldr > r - 15 || oldg > g - 15 || oldb > b - 15) {

                } else {
            
                    if(y < topPosition.y){
                        topPosition.y = y;
                        topPosition.x = x;
                        frameData[indexNew] = 255; 
                    frameData[indexNew+1] = 0; 
                    frameData[indexNew+2] = 0; 
                    frameData[indexNew+3] = 255;
                    return; // not sure this is the best way semantically, but returning here gives much more stable results
                            //when displayed on the canvas, not as much of an erratic cursor
                    }

                }
                
            } // end for x
        } // end for y
    }
    else{
        console.log("is null");
    }
    videoCtx.putImageData(imageData, 0,0);
    videoCtx.scale(-1,1);
    prevFrameData = frameData;
}

function drawFromCam(){
    videoCtx.drawImage(vtx, 0, 0, vCtxWidth, vCtxHeight);
}

export{setUpMotion, detectMotion, drawFromCam, topPosition};