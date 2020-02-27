//Author: Joshua Fredrickson
//File name: jjfLIB.js

(function(){
    "use strict";

    console.log("jjfLIB loaded");

    //set up the global jjfLIB object
    let jjfLIB = {
        //Function to draw a line. Takes in a context to a canvas, a start
        // and end point, and a color for the line.
       drawLine(ctx, startX, startY, endX, endY, color){
           ctx.save();
           ctx.strokeStyle = color;
           ctx.beginPath();
           ctx.moveTo(startX,startY);
           ctx.lineTo(endX, endY);
           ctx.stroke();
           ctx.closePath();
           ctx.restore();
       },

       //Function to draw a rectangle. Takes in a context to a canvas, a
       //start point, a width and height, a color to fill, and if to 
       //stroke the rect or not.
       drawRect(ctx, startX, startY, width, height, color, stroke){
           ctx.save();
           ctx.fillStyle = color;
           ctx.beginPath();
           ctx.rect(startX,startY, width, height);
           if(stroke){
               ctx.strokeStyle = "black";
               ctx.lineWidth = 2;
               ctx.stroke();
           }
           ctx.fill();
           ctx.restore();
       },

       //Used to get directional result
       getRandomInt(min, max){
            return Math.floor(Math.random()*(max-min+1))+min;
       },

       //Function to draw a rect with an alpha amount. Takes in a context to
       //a canvas, a color to fill, a width and a height, as long as a alpha amount.
       //Draws a alpha rect starting at the origin
       drawAlphaRect(ctx,color, width, height, alphaAmount){
        ctx.save();
        ctx.fillStyle=color;
        ctx.globalAlpha = alphaAmount;
        ctx.beginPath();
        ctx.rect(0,0,width,height);
        ctx.fill();
        ctx.closePath();
        ctx.restore();

        },

        //Function to draw a grid. Takes in a context to a canvas, a color for the line
        // the number of columns, the number of rows, the offset between columns, the 
        //offset between rows, the length of the rows and the length of the columns
        drawGrid(ctx, color, numXLines, numYLines, xOffset, yOffset, width, height){
		    ctx.save();
            let i;
            for(i = 0; i < numXLines;i++){
                this.drawLine(ctx,i*xOffset, 0, i*xOffset, height, color);
            }
    
            for(i = 0; i < numYLines;i++){
                this.drawLine(ctx,0, i*yOffset, width, i*yOffset, color);
            }
		    ctx.restore();
        },

        //Function to check if a number is within the bounds specified by input.
        //Takes in a number to check, and a lower bounds and upper bounds
        checkIfInBounds(num, lowerBound, upperBound){
            return (num >= lowerBound && num < upperBound);
        },

        //Function to check if a position overlaps with another point
        checkOverlap(xPosOne, yPosOne, xPosTwo, yPosTwo){
            return (xPosOne===xPosTwo && yPosOne === yPosTwo);
        }
    };

    if(window){
        window["jjfLIB"] = jjfLIB;
    }else{
        throw "No window defined.";
    }


})();

