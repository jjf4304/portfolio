//Author: Joshua Fredrickson
//File name: index.js


(function(){
    "use strict";

    console.log("index.js loaded");

    //Class to describe a walker. Has a x and y position, a color,
    //the width of the rectangle when drawing, and a lifespan if needed
    class walker {
        constructor(xPos, yPos, color, width, lifeSpan){
            this.xPos = xPos;
            this.yPos = yPos;
            this.color = color;
            this.width = width;
            this.lifeSpan = lifeSpan;
        }
        //change the x and y position 
        move(xMove, yMove){
            this.xPos += xMove;
            this.yPos += yMove;
        }
        //if there is a life span, reduce per iteration until the "life"
        //is at zero, then remove this walker from the list.
        timeDeath(){
            if(this.lifeSpan <= 0){
                let index = listOfWalkers.indexOf(this);
                listOfWalkers.splice(index, 1);
            }
            else{
                this.lifeSpan--;
            }
        }
    }

    //Class to describe a spawner. Has a x and y position as well as a color to spawn.
    //Has functions to describe spawning walkers.
    class spawner {
        constructor(xPos, yPos, color){
            this.xPos = xPos;
            this.yPos = yPos;
            this.color = color;
        }
        //Function to create a new walker at this location with the color of the spawner
        spawn(){
            listOfWalkers.push(new walker(this.xPos, this.yPos, this.color, gridXOffset, timeUntilDeath));
        }
    }

    //Class to describe a block, has a x and y position as well as a color.
    class block{
        constructor(xPos, yPos, color){
            this.xPos = xPos;
            this.yPos = yPos;
            this.color = color;
        }
    }

    //Class for presets, has  alist of spawners and blocks to set up on load,
    //and a name for the preset.
    class preset{
        constructor(listOfSpawners, listOfBlocks, name){
            if(listOfSpawners === null)
                this.listOfSpawners = new Array();
            else
                this.listOfSpawners = listOfSpawners;
            if(listOfBlocks === null)
                this.listOfBlocks = new Array();
            else{
                this.listOfBlocks = listOfBlocks;
            }
            this.name = name;
        }
    }

    
    let pause; // variable to pause the simulation
    let width, height; //width and height of canvas
    let ctx; // canvas variable
    let fps; //fps for the simulation
    let timeBtwSpawn; //the time between spawning variable
    let timeUntilDeath; // time until a walker dies if that control is checked
    let deathOnCollide; //variable from control to see if a walker dies when colliding with another
    let clickInteraction; //variable to control what kind of interaction to have on click


    //lists of walkers, spawners, blocks, and presets.
    let listOfWalkers = [];
    let listOfSpawners = [];
    let listOfBlocks = [];
    let listOfPresets = [];

    //Color variables for drawing
    let lineColor = "rgb(0,0,0)";
    let blockColor = "rgb(40,40,40)";

    //Number of cells in the canvas grid
    let xCellCount, yCellCount;
    //Offset bewteen grid lines
    let gridXOffset, gridYOffset;

    //ID's for setIntervals
    let loopIntervalID, spawnIntervalID, deathIntervalID;

    window.onload = init;

    function init(){
        let canvas = document.querySelector("canvas");
        ctx= canvas.getContext("2d");
        width = canvas.width;
        height = canvas.height;
        xCellCount = width/20;
        yCellCount = height/20;

        gridXOffset = 20;
        gridYOffset = 20;

        pause = true;

        listOfPresets[0] = new preset(null, null, "blank");

        //onclick event for the canvas to get the correct mouse coordinates
        // and depending on what interaction is active, handle that interaction.
        document.querySelector('#canvas').onclick = function(e){
            let canvasContainer = canvas.getBoundingClientRect();
            let mouseX = Math.floor(((e.clientX-canvasContainer.left))/gridXOffset);
            let mouseY = Math.floor(((e.clientY-canvasContainer.top))/gridYOffset)
    
            handleClickInteraction(mouseX,mouseY);
        }

        //onclick event for the play button to unppause and start
        //the simulation
        document.querySelector('#play').onclick = function(e){
            pause = false;
            start();
        }

        //onclick event to pause
        document.querySelector('#pause').onclick = function(e){
            pause = true;
        }

        //onclick event to reset the simulation
        document.querySelector('#reset').onclick = function(e){
            reset();
        }

        //onclick event for save button to ask for the name of the
        //preset, then add it to the list of presets.
        document.querySelector('#save').onclick = function(e){
            let name = prompt("Enter name of preset.");
            listOfPresets.push(new preset(listOfSpawners, listOfBlocks, name));
            let newPresetElement = document.createElement("option");
            newPresetElement.text = name;
            newPresetElement.value = name;
            document.querySelector('#presetOptions').appendChild(newPresetElement);
        }

        //on change event to change the fps 
        document.querySelector('#fps').onchange = function(e){
            fps = parseInt(document.querySelector('#fps').value, 10);
            clearIntervals();
            setIntervals(fps, timeBtwSpawn, timeUntilDeath);
        }

        //ponchange event to set the click interaction (what color spaner to make, to delete, etc)
        document.querySelector("#clickOptions").onchange = function(e){
            clickInteraction = document.querySelector('#clickOptions').value;
        }

        //onchange event to change the preset of the canvas
        document.querySelector("#presetOptions").onchange = function(e){
            if(e.target.value === "blank"){
                pause = true;
                reset();
            }
            else if(e.target.value === "smiley"){
                pause =  true;
                reset()
                listOfBlocks = setUpSmiley();
                drawObjects();
            }
            else{
                for(let i = 0; i < listOfPresets.length;i++){
                    if(listOfPresets[i].name === e.target.value){
                        pause = true;
                        reset();
                        listOfSpawners = listOfPresets[i].listOfSpawners;
                        listOfBlocks = listOfPresets[i].listOfBlocks;
                        drawObjects();
                    }
                }
            }
        }

        //event to set if the walkers collide or not
        document.querySelector('#collide').onchange = function(e){
            if(document.querySelector('#collide').checked){
                deathOnCollide = true;
            }
            else{
                deathOnCollide = false;
            }
        }

        //event to set if the walkers die over time
        document.querySelector('#death').onchange = function(e){
            if(document.querySelector('#death').checked){
                document.querySelector('#deathTime').disabled = false;
                timeUntilDeath = 1;
            }
            else{
                document.querySelector('#deathTime').disabled = true;
                document.querySelector('#deathTime').value = 0;
                timeUntilDeath = 0;
            }
        }

        //event to set the time until death, only enabled when walkers can die
        document.querySelector('#deathTime').onchange = function(e){
            timeUntilDeath = document.querySelector('#deathTime').value;
            reset();
            start();
        }

        //base variables set from controls
        fps = 10;
        timeBtwSpawn = 5;
        timeUntilDeath = 0;
        deathOnCollide = false;
        clickInteraction = "none";

        drawObjects();
        
    }

    //start function to draw objects and set the intervals
    function start(){
       
        drawObjects();
        loop();
        setIntervals(fps, timeBtwSpawn, timeUntilDeath);

    }


    //the function that loops, calls drawObjects and moveWalkers
    function loop(){
        if(pause)
            return;
        drawObjects();
        moveWalkers();
        
    }

    //draw function to draw all objects. uses jjfLIB functions to draw the grid and the rectangles
    function drawObjects(){
        jjfLIB.drawAlphaRect(ctx, "whitesmoke", width, height, .1);
        jjfLIB.drawGrid(ctx, lineColor, xCellCount, yCellCount, gridXOffset, gridYOffset, width, height);
        let i;
        for(i = 0; i < listOfSpawners.length; i++){
            jjfLIB.drawRect(ctx, listOfSpawners[i].xPos*gridXOffset, listOfSpawners[i].yPos*gridYOffset,
                 gridXOffset, gridYOffset, listOfSpawners[i].color, true);
        }
        for(i = 0; i < listOfBlocks.length; i++){
            jjfLIB.drawRect(ctx, listOfBlocks[i].xPos*gridXOffset, listOfBlocks[i].yPos*gridYOffset,
                gridXOffset, gridYOffset, blockColor, true);
        }
        for(i = 0; i < listOfWalkers.length; i++){
            jjfLIB.drawRect(ctx, listOfWalkers[i].xPos*gridXOffset,
                listOfWalkers[i].yPos*gridYOffset, listOfWalkers[i].width,
                 listOfWalkers[i].width, listOfWalkers[i].color, false);
        }
    }

    //function to handle walkers moving. get a random number to determine the direction, check if there is 
    //an obstruction at the prospective new spot, and if not move the walker to that spot.
    function moveWalkers(){
        for(let i = 0; i < listOfWalkers.length; i++){
            let direction = jjfLIB.getRandomInt(0,3);
            let newX, newY;
            switch(direction){
                case 0:
                    //go up
                    newX = listOfWalkers[i].xPos;
                    newY = listOfWalkers[i].yPos-1;
                    if(jjfLIB.checkIfInBounds(newY, 0, yCellCount) && checkCollision(newX, newY))
                        listOfWalkers[i].move(0, -1);
                    break;
                case 1:
                    //go right
                    newX = listOfWalkers[i].xPos+1;
                    newY = listOfWalkers[i].yPos;
                    if(jjfLIB.checkIfInBounds(newX, 0, xCellCount) && checkCollision(newX, newY))
                        listOfWalkers[i].move(1, 0);
                    break;
                case 2:
                    //go down
                    newX = listOfWalkers[i].xPos;
                    newY = listOfWalkers[i].yPos+1;
                    if(jjfLIB.checkIfInBounds(newY, 0, yCellCount) && checkCollision(newX, newY))
                        listOfWalkers[i].move(0, 1);
                    break;
                case 3:
                    //go left
                    newX = listOfWalkers[i].xPos-1;
                    newY = listOfWalkers[i].yPos;
                    if(jjfLIB.checkIfInBounds(newX, 0, xCellCount) && checkCollision(newX, newY))
                        listOfWalkers[i].move(-1, 0);
                    break;
                default:

            }

        }
    }

    //return false if there is a collision/movement issue, true if there is no issue
    function checkCollision(xPos, yPos){
        //return checkInBounds and checkOverlap with all blocks, spawners and if collision enabled, diff color walkers
        for(let i = 0; i<listOfSpawners.length;i++){
            if(jjfLIB.checkOverlap(xPos, yPos, listOfSpawners[i].xPos, listOfSpawners[i].yPos))
                return false;
        }
        for(let i = 0; i <listOfBlocks.length;i++){
            if(jjfLIB.checkOverlap(xPos, yPos, listOfBlocks[i].xPos, listOfBlocks[i].yPos)){
                return false;
            }
        }
        for(let i = 0; i <listOfWalkers.length;i++){
            if(jjfLIB.checkOverlap(xPos, yPos, listOfWalkers[i].xPos, listOfWalkers[i].yPos)){
                if(deathOnCollide)
                    listOfWalkers.splice(i,1);
                return false;
            }
        }
        return true;
        
    }

    //loops through each spawner and spawns them.
    function handleSpawning(){
        if(pause)
            return;
        for(let i of listOfSpawners){
            i.spawn();
        }
    }

    //this is ugly I know, but there was no other way I could think of without
    //IO, which google says cannot be done client
    // Sets up the list of blocks for the Smiley preset
    function setUpSmiley(){
        let smileyBlockList = new Array();
        smileyBlockList.push(new block(18,4,blockColor));
        smileyBlockList.push(new block(19,4,blockColor));
        smileyBlockList.push(new block(20,4,blockColor));
        smileyBlockList.push(new block(21,4,blockColor));
        smileyBlockList.push(new block(16,5,blockColor));
        smileyBlockList.push(new block(17,5,blockColor));
        smileyBlockList.push(new block(22,5,blockColor));
        smileyBlockList.push(new block(23,5,blockColor));
        smileyBlockList.push(new block(15,6,blockColor));
        smileyBlockList.push(new block(24,6,blockColor));
        smileyBlockList.push(new block(14,7,blockColor));
        smileyBlockList.push(new block(25,7,blockColor));
        smileyBlockList.push(new block(13,8,blockColor));
        smileyBlockList.push(new block(14,8,blockColor));
        smileyBlockList.push(new block(25,8,blockColor));
        smileyBlockList.push(new block(26,8,blockColor));
        smileyBlockList.push(new block(13,9,blockColor));
        smileyBlockList.push(new block(18,9,blockColor));
        smileyBlockList.push(new block(21,9,blockColor));
        smileyBlockList.push(new block(26,9,blockColor));
        smileyBlockList.push(new block(12,10,blockColor));
        smileyBlockList.push(new block(13,10,blockColor));
        smileyBlockList.push(new block(18,10,blockColor));
        smileyBlockList.push(new block(21,10,blockColor));
        smileyBlockList.push(new block(26,10,blockColor));
        smileyBlockList.push(new block(27,10,blockColor));
        smileyBlockList.push(new block(12,11,blockColor));
        smileyBlockList.push(new block(18,11,blockColor));
        smileyBlockList.push(new block(21,11,blockColor));
        smileyBlockList.push(new block(27,11,blockColor));
        smileyBlockList.push(new block(12,12,blockColor));
        smileyBlockList.push(new block(18,12,blockColor));
        smileyBlockList.push(new block(21,12,blockColor));
        smileyBlockList.push(new block(27,12,blockColor));
        smileyBlockList.push(new block(12,13,blockColor));
        smileyBlockList.push(new block(27,13,blockColor));
        smileyBlockList.push(new block(12,14,blockColor));
        smileyBlockList.push(new block(12,14,blockColor));
        smileyBlockList.push(new block(16,14,blockColor));
        smileyBlockList.push(new block(23,14,blockColor));
        smileyBlockList.push(new block(26,14,blockColor));
        smileyBlockList.push(new block(27,14,blockColor));
        smileyBlockList.push(new block(13,15,blockColor));
        smileyBlockList.push(new block(17,15,blockColor));
        smileyBlockList.push(new block(22,15,blockColor));
        smileyBlockList.push(new block(26,15,blockColor));
        smileyBlockList.push(new block(13,16,blockColor));
        smileyBlockList.push(new block(14,16,blockColor));
        smileyBlockList.push(new block(18,16,blockColor));
        smileyBlockList.push(new block(19,16,blockColor));
        smileyBlockList.push(new block(20,16,blockColor));
        smileyBlockList.push(new block(21,16,blockColor));
        smileyBlockList.push(new block(25,16,blockColor));
        smileyBlockList.push(new block(26,16,blockColor));
        smileyBlockList.push(new block(14,17,blockColor));
        smileyBlockList.push(new block(25,17,blockColor));
        smileyBlockList.push(new block(15,18,blockColor));
        smileyBlockList.push(new block(24,18,blockColor));
        smileyBlockList.push(new block(16,19,blockColor));
        smileyBlockList.push(new block(17,19,blockColor));
        smileyBlockList.push(new block(22,19,blockColor));
        smileyBlockList.push(new block(23,19,blockColor));
        smileyBlockList.push(new block(18,20,blockColor));
        smileyBlockList.push(new block(19,20,blockColor));
        smileyBlockList.push(new block(20,20,blockColor));
        smileyBlockList.push(new block(21,20,blockColor));

        return smileyBlockList;
    }

    //if the walkers die over time, go through the walkers and
    //decrease the lifespan
    function handleDeathOverTime(){
        if(pause)
            return;
        for(let walker of listOfWalkers){
            walker.timeDeath();
        }
    }

    //Function to handle the click interaction. Depending on what clickInteraction is,
    // either spawn a certain color spawner, spawn a block, or delete a spawner/block under
    //the mouse.
    function handleClickInteraction(xPos, yPos){
        switch(clickInteraction){
            case "bSpawner":
                listOfSpawners.push(new spawner(xPos,yPos,"blue"));
                break;
            case "rSpawner":
                listOfSpawners.push(new spawner(xPos,yPos,"red"));
                break;
            case "gSpawner":
                listOfSpawners.push(new spawner(xPos,yPos,"green"));
                break;
            case "oSpawner":
                listOfSpawners.push(new spawner(xPos,yPos,"orange"));
                break;
            case "block":
                listOfBlocks.push(new block(xPos, yPos, blockColor));
                break;
            case "delete":
                let i = 0;
                for(i; i<listOfSpawners.length;i++){
                    if(jjfLIB.checkOverlap(xPos, yPos, listOfSpawners[i].xPos, listOfSpawners[i].yPos)){
                        listOfSpawners.splice(i,1);
                        jjfLIB.drawRect(ctx, xPos*gridXOffset,yPos*gridYOffset,gridXOffset, gridYOffset, "whitesmoke", true);
                        return;
                    }
                }
                for(i; i<listOfBlocks.length;i++){
                    if(jjfLIB.checkOverlap(xPos, yPos, listOfBlocks[i].xPos, listOfBlocks[i].yPos)){
                        listOfBlocks.splice(i,1);
                        jjfLIB.drawRect(ctx, xPos*gridXOffset,yPos*gridYOffset,gridXOffset, gridYOffset, "whitesmoke", true);
                        return;
                    }
                }
        }
        drawObjects();
    }
    
    //Function to reset the canvas and grid. Resets the arrays, clears all 
    //intervals and redraws the canvas
    function reset(){
        listOfWalkers = new Array();
        listOfSpawners = new Array();
        listOfBlocks = new Array();
        clearIntervals();
        // reset arrays as needed
        jjfLIB.drawRect(ctx, 0,0,width, height, "whitesmoke", false);
        jjfLIB.drawGrid(ctx, lineColor, xCellCount, yCellCount, gridXOffset, gridYOffset, width, height);
    }
    
    //Function to clear all the intervals used in the simulation
    function clearIntervals(){
        clearInterval(loopIntervalID);
        clearInterval(spawnIntervalID);
        clearInterval(deathIntervalID);
    }
    
    //Function to set all intervals based on variables set from controls
    function setIntervals(theFPS, theTimeBTWSpawn, theTimeUntilDeath){
        spawnIntervalID = setInterval(handleSpawning, 1000*theTimeBTWSpawn);
        loopIntervalID = setInterval(loop,1000/theFPS);
        if(timeUntilDeath === 0)
            return;
        else{;
            deathIntervalID = setInterval(handleDeathOverTime, 1000*theTimeUntilDeath);
        }
    }

    

})();

