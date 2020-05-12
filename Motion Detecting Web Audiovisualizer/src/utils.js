
//This is a temp implementation of this, i may try to find
//one that more fits what I want, but it's from the 
//phylotaxis demo
function changeColor(num){
    let color = `hsl(${num/10 % 360},100%,50%)`;
    return color;
}

//Draw a rectangle given a ctx, start, dimensions and colors
function drawRect(ctx, x, y, width, height, fillColor, strokeColor,strokeWidth, alpha){
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;
    ctx.globalAlpha = alpha;
    ctx.rect(x,y,width, height);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

//Draw Text given a position, font and style
function drawText(ctx, x, y, font, alpha, text, strokeColor){
    ctx.save();
    ctx.font = font;
    ctx.strokeStyle = strokeColor;
    ctx.globalAlpha = alpha;
    ctx.textAlign = "center";
    ctx.strokeText(text, x, y);
    ctx.restore();
}

//create a linear gradient, provided by professors
function createLinearGradient(ctx, x,y,endX,endY,colorStops){
    let gradient = ctx.createLinearGradient(x,y,endX,endY);
    for(let stop of colorStops)
        gradient.addColorStop(stop.percent, stop.color);
    return gradient;
}

//function to normalize a vector
function normalize(vector){
    let magnitude = Math.sqrt((vector.x * vector.x) + (vector.y * vector.y));
    vector.x/=magnitude;
    vector.y/=magnitude;
    return vector;
}

function magnitude(vector){
    return Math.sqrt((vector.x * vector.x) + (vector.y * vector.y));
}


// this function for a curve here https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode
function makeDistortionCurve(amount) {
    var k = typeof amount === 'number' ? amount : 50,
      n_samples = 44100,
      curve = new Float32Array(n_samples),
      deg = Math.PI / 180,
      i = 0,
      x;
    for ( ; i < n_samples; ++i ) {
      x = i * 2 / n_samples - 1;
      curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
    }
    return curve;
  };

const goFullscreen = (element) => {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullscreen) {
        element.mozRequestFullscreen();
    } else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
    // .. and do nothing if the method is not supported
};

export{changeColor, drawRect, drawText, normalize, magnitude,createLinearGradient, goFullscreen, makeDistortionCurve};