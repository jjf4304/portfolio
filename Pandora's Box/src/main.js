/*

Author: Joshua Fredrickson
main.js holds the functionality for the App, including setting up monster lists and displaying information

*/

import * as dnd from "./dnd.js";
import * as dice from "./die-roll.js";
import * as utils from "./utils.js";

class MonsterList{
    constructor(monsterList, numMonsters){
        this.list = monsterList;
        this.numMonsters = numMonsters;
    }
}

let currentList, monsterListBox, savedSelections;
let monsterStatBox;
let monsterIndex;
let monsterList;

let sortStyle = "ascending", storedSearch = "";
let storedDieSides = "", storedDieNum = "", storedMod = "", storedResult = "";
let loadingDiv;

//Function to set up the total monster list. Shows the loading img, then makes a call to dnd-loader.php
function setUpTotalMonsterList(){

    loadingDiv.style.display = "block"
    const url = "https://people.rit.edu/jjf4304/330/projects/project-3-Fredrickson/src/dnd-loader.php";

    //Sets up the monster list from the JSON
    function monsterListLoaded(jsonString){
        let temp = JSON.parse(jsonString);

        monsterList = new MonsterList(temp.results, temp.count);
        // numMonsters = temp.count;
        // monsterList.list = temp.results;
        savedSelections = {};

        currentList = monsterList.list;
        
        if(sortStyle == "ascending")
            currentList.sort(utils.compareAscending);
        else if(sortStyle == "descending")
            currentList.sort(utils.compareDescending);

        displayMonsterList();
        loadingDiv.style.display = "none";
    }

    dnd.loadMonsterDetails(url, monsterListLoaded);
}

//Function to set up all UI elements, including if the UI was saved in local storage last time
//the page was used.
function setupUI(){

    sortStyle = window.localStorage.getItem("sort");
    storedSearch = window.localStorage.getItem("search");
    loadingDiv = document.querySelector('#loadingPage');

    //Set up search bar, set the monster list box DOM and monster stat box refs
    let monsterSearch = document.querySelector('#search-bar');
    monsterListBox = document.querySelector('#monster-list');
    monsterStatBox = document.querySelector('#monster-stats');

    //Search Input set ups to change off focus and when on change
    monsterSearch.onfocus = () => {
        if(monsterSearch.value != ""){
            monsterSearch.value = '';
            monsterSearch.classList.remove('inactive-search');
        }
    } 

    monsterSearch.onchange = () =>{
        if(monsterSearch.value == ""){
            currentList = monsterList.list;
            displayMonsterList();
        }
        else{
            currentList = [];
            utils.search(monsterSearch.value, monsterList.list, currentList);
            displayMonsterList();
        }
    }

    //If there is a stored search, set that into the search bar
    if(storedSearch != null){
        monsterSearch.value = storedSearch;
    }

    //Set up sort functions
    let sort = document.querySelector('#sort');
    //If sort is stored in local storage, set up the right index
    if(sortStyle == "ascending"){
        sort.selectedIndex = "0";
    }
    else if(sortStyle == "descending"){
        sort.selectedIndex = "1";
    }
    //On sort change, depending on what the new value is sort the current monster list
    sort.onchange = (e) =>{
        if(e.target.value == "ascending"){
            sortStyle = "ascending";
            currentList.sort(utils.compareAscending);
        }
        else{
            sortStyle = "descending";
            currentList.sort(utils.compareDescending);
        }
        window.localStorage.setItem("sort", sortStyle);

        //currentList = monsterList.list;
        displayMonsterList();
    }

    //window.localStorage Events
    let showSelections = document.querySelector('#showFavorites');
    showSelections.onclick = (e) =>{
        currentList = [];
        for(let i = 0; i < window.localStorage.length;i++){
            utils.search(window.localStorage.getItem(window.localStorage.key(i)), monsterList.list, currentList);
        }
        displayMonsterList();
    }

    //Save current seleection to local storage
    let saveSelection = document.querySelector('#saveFavorites');
    saveSelection.onclick = (e) =>{
        let index = "";
        for(let monster of monsterList.list){
            index = monster.index;
            if(index.includes(monsterIndex)){
                //set monster into local storage
                window.localStorage.setItem(index, monster.name);
                break;
            }
        }
    }

    //Delete all local storage
    let deleteSelections = document.querySelector('#deleteFavorites');
    deleteSelections.onclick = (e) =>{
        window.localStorage.clear();
        currentList = monsterList.list;
        currentList.sort(utils.compareAscending);
        sort.selectedIndex = "0";
        sortStyle = "ascending";
        displayMonsterList();
    }

    //Show the main monster list
    let showMain = document.querySelector('#showMain');
    showMain.onclick = (e) =>{
        currentList = monsterList.list;
        displayMonsterList();
    }

    //Rolling Dice, makes a call to the Rolz API
    let rollDice = document.querySelector('#rollDice');
    rollDice.onclick = (e) =>{

        //Get variables and set up local storage elements
        loadingDiv.style.display = "block"
        let numSides = document.querySelector('#dieSides').value;
        window.localStorage.setItem("numSides", numSides);
        let numOfDice = document.querySelector('#rollNum').value;
        window.localStorage.setItem("numOfDice", numOfDice);
        let modifier = document.querySelector('#dieMod').value;
        window.localStorage.setItem("modifier", modifier);

        //URL using parameters
        const url = `https://people.rit.edu/jjf4304/330/projects/project-3-Fredrickson/src/die-roll.php?numOfDice=${numOfDice}&numSides=${numSides}&modifier=${modifier}`;
        
        //Call back function to parse the JSON result and then set the result text field
        function callBackFunc(jsonString){
            let resultField = document.querySelector('#resultOfRoll');

            let rollResult = JSON.parse(jsonString);

            resultField.value = numOfDice + "d" + numSides + " + " + modifier + " = " + rollResult.result + " " + rollResult.details;

            window.localStorage.setItem("rollResult", resultField.value);
            loadingDiv.style.display = "none"
        }

        dice.rollDie(url, callBackFunc);
    }

    //Setting up the roll inouts if there is local storage
    if(window.localStorage.getItem("numSides") != null){
        document.querySelector('#dieSides').value = window.localStorage.getItem("numSides");
    }
    if(window.localStorage.getItem("numOfDice") != null){
        document.querySelector('#rollNum').value = window.localStorage.getItem("numOfDice");
    }
    if(window.localStorage.getItem("modifier") != null){
        document.querySelector('#dieMod').value = window.localStorage.getItem("modifier");
    }
    if(window.localStorage.getItem("rollResult") != null){
        document.querySelector('#resultOfRoll').value = window.localStorage.getItem("rollResult");
    }

}

// Function to display the monster list to the left list. Starts the loading image, then goes through the
// entire currentList (A list that includes either the full list sorted alphabetically or reverse or the
// results of a search) creating divs for each monster, setting it's class and id attributes, gives it the
// monster name, and appends it to the list. It also sets the onclick function to each div which makes a call
// to dnd-loader.php to show the stats of that monster to the left. 
function displayMonsterList(){
    monsterListBox.innerHTML = "";
    let element = "";

    loadingDiv.style.display = "block"

    //Go through each monster of the list
    for(let monster of currentList){
        // create the div and set its values
        let monsterDiv = document.createElement('div');
        monsterDiv.setAttribute("class", "monster-box centered");
        monsterDiv.setAttribute("id", "monster-block");
        let name = document.createTextNode(monster.name);
        monsterDiv.appendChild(name);

        //onclick method to set the url sent to dnd-loader.php and holds the call back function to use
        monsterDiv.onclick = (e) =>{
            monsterStatBox.innerHTML = "";
            const url = "https://people.rit.edu/jjf4304/330/projects/project-3-Fredrickson/src/dnd-loader.php?search=";
            monsterIndex = "";

            //find the monster from the list and break as each index is unique
            for(monster of monsterList.list){
                if(e.target.innerHTML == monster.name){
                    monsterIndex = monster.index;
                    break;
                }
            }
    
            //Call back function to call showMonsterStats with the returned json
            function callBackFunc(jsonString){

                loadingDiv.style.display = "block";
                showMonsterStats(jsonString);
                loadingDiv.style.display = "none";

            }
    
            //php loader call
            dnd.loadMonsterDetails(url + monsterIndex, callBackFunc);
        } 
 
        monsterListBox.appendChild(monsterDiv);
    }
    loadingDiv.style.display = "none"

}

// Function to set up the monster stats to be displayed on the right hand box. Goes through the returned monster's 
// JSON and creates elements for each part of the stat block. E.g. creates a div for the name, size, type and alignment
// and then appends that to the final monsterStatBox DOM element. 

//uses https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement when I forgot how to create elements
function showMonsterStats(jsonString){
    let temp = JSON.parse(jsonString);

    //Name, Size, Type and Alignment
    let nameDiv = document.createElement('div');
    nameDiv.setAttribute("class", "StatsBox");
    //Bold Name
    let boldName = document.createElement('P');
    let boldFont = document.createElement('strong');
    boldFont.appendChild(document.createTextNode(temp["name"]));
    boldName.appendChild(boldFont);
    //Alignment and size
    let alignAndSize = document.createElement('P');
    let italic = document.createElement('em');
    italic.appendChild(document.createTextNode(temp["size"] + " " + temp["type"] + ", " + temp["alignment"]))
    alignAndSize.appendChild(italic);
    nameDiv.appendChild(boldName);
    nameDiv.appendChild(alignAndSize);
    monsterStatBox.appendChild(nameDiv);

    //AC, HP, and Speed
    let hpDiv = document.createElement('div');
    hpDiv.setAttribute("class", "StatsBox");
    
    //AC
    let ac = document.createElement('P');
    let acBold = document.createElement('strong');
    acBold.appendChild(document.createTextNode("Armor Class: "));
    let acNorm = document.createTextNode(temp["armor_class"]);
    ac.appendChild(acBold);
    ac.appendChild(acNorm);
    hpDiv.appendChild(ac);

    //HP
    let hp = document.createElement('P');
    let hpBold = document.createElement('strong');
    hpBold.appendChild(document.createTextNode("Hit Points: "));
    let hpNorm = document.createTextNode(temp["hit_points"]);
    hp.appendChild(hpBold);
    hp.appendChild(hpNorm); 
    hpDiv.appendChild(hp);

    //Speeds
    let speed = document.createElement('P');
    let speedBold = document.createElement('strong');
    speedBold.appendChild(document.createTextNode("Speed: "));
    speed.appendChild(speedBold);

    let speedObj = temp["speed"];
    for(const speedStat in speedObj){
        let speedNorm = document.createTextNode(`${speedStat} ${speedObj[speedStat]} `);
        speed.appendChild(speedNorm);
    }
    hpDiv.appendChild(speed);
    monsterStatBox.appendChild(hpDiv);

    //Stats Div
    let statsDiv = document.createElement('div');
    statsDiv.setAttribute("class", "StatsBox");

    //Modifier algorithm I remember learning from the Players Handbook or Dungeon Masters Guide, but I can't find where in the book its stated. 

    //str
    //let strDiv = document.createElement('div');
    let strBold = document.createElement('P');
    let strTitle = document.createElement('strong');
    strTitle.appendChild(document.createTextNode("STR: "))
    strBold.appendChild(strTitle);
    let strMod = parseInt(temp["strength"]);
    strMod = Math.floor((strMod-10)/2);
    let strVal = document.createTextNode(`${temp["strength"]} (${strMod})`);
    strBold.appendChild(strVal);
    statsDiv.appendChild(strBold);

    //dex
    //let dexDiv = document.createElement('div');
    let dexBold = document.createElement('P');
    let dexTitle = document.createElement('strong');
    dexTitle.appendChild(document.createTextNode("DEX: "));
    dexBold.appendChild(dexTitle);
    let dexMod = parseInt(temp["dexterity"]);
    dexMod = Math.floor((dexMod-10)/2);
    let dexVal = document.createElement('P').appendChild(document.createTextNode(`${temp["dexterity"]} (${dexMod})`));
    dexBold.appendChild(dexVal);
    statsDiv.appendChild(dexBold);

    //con
    //let conDiv = document.createElement('div');
    let conBold = document.createElement('P');
    let conTitle = document.createElement('strong');
    conTitle.appendChild(document.createTextNode("CON: "));
    conBold.appendChild(conTitle);
    let conMod = parseInt(temp["constitution"]);
    conMod = Math.floor((conMod-10)/2);
    let conVal = document.createElement('P').appendChild(document.createTextNode(`${temp["constitution"]} (${conMod})`));
    conBold.appendChild(conVal);
    statsDiv.appendChild(conBold);

    //int
    //let intDiv = document.createElement('div');
    let intBold = document.createElement('P');
    let intTitle = document.createElement('strong');
    intTitle.appendChild(document.createTextNode("INT: "));
    intBold.appendChild(intTitle);
    let intMod = parseInt(temp["intelligence"]);
    intMod = Math.floor((intMod-10)/2);
    let intVal = document.createElement('P').appendChild(document.createTextNode(`${temp["intelligence"]} (${intMod})`));
    intBold.appendChild(intVal);
    statsDiv.appendChild(intBold);

    //wis
    //let wisDiv = document.createElement('div');
    let wisBold = document.createElement('P');
    let wisTitle = document.createElement('strong');
    wisTitle.appendChild(document.createTextNode("WIS: "));
    wisBold.appendChild(wisTitle);
    let wisMod = parseInt(temp["wisdom"]);
    wisMod = Math.floor((wisMod-10)/2);
    let wisVal = document.createElement('P').appendChild(document.createTextNode(`${temp["wisdom"]} (${wisMod})`));
    wisBold.appendChild(wisVal);
    statsDiv.appendChild(wisBold);

    //cha
    //let chaDiv = document.createElement('div');
    let chaBold = document.createElement('P');
    let chaTitle = document.createElement('strong');
    chaTitle.appendChild(document.createTextNode("CHA: "));
    chaBold.appendChild(chaTitle);
    let chaMod = parseInt(temp["charisma"]);
    chaMod = Math.floor((chaMod-10)/2);
    let chaVal = document.createElement('P').appendChild(document.createTextNode(`${temp["charisma"]} (${chaMod})`));
    chaBold.appendChild(chaVal);
    statsDiv.appendChild(chaBold);

    monsterStatBox.appendChild(statsDiv);

    //Skills, Saves, Languages, Senses, Resistances and Immunities, and CR
    let miscDiv = document.createElement('div');
    miscDiv.setAttribute("class", "StatsBox");

    //Skills Section UL
    if(temp["proficiencies"] !== undefined && temp["proficiencies"].length != 0){
        let skills = document.createElement('div');
        let skillList = document.createElement('UL');
        let skillBold = document.createElement('strong');
        skillBold.appendChild(document.createTextNode("Skills: "));
        skills.appendChild(skillBold);
        skills.appendChild(skillList);

        let save = document.createElement('div');
        let saveList = document.createElement('UL');
        let saveBold = document.createElement('strong');
        saveBold.appendChild(document.createTextNode("Saving Throws: "));
        save.appendChild(saveBold);
        save.appendChild(saveList);

        //The API returns saves and skill proficiencies together, so to seperate them check if each individual
        //object has "Saving Throw:" or "Skill:", then append that list item to the appropriate UL
        let skillObj = temp["proficiencies"];
        for(const skillStat in skillObj){
            let listEl = document.createElement("LI");
            if(skillObj[skillStat]["name"].includes("Saving")){
                let saveEl = document.createTextNode(`${skillObj[skillStat]["name"].split("Saving Throw:")[1]} ${skillObj[skillStat]["value"]}`);
                listEl.appendChild(saveEl);
                saveList.appendChild(listEl);
            }
            if(skillObj[skillStat]["name"].includes("Skill")){
                let skillEl = document.createTextNode(`${skillObj[skillStat]["name"].split("Skill:")[1]} ${skillObj[skillStat]["value"]}`);
                listEl.appendChild(skillEl);
                skillList.appendChild(listEl);
            }
        }
        miscDiv.appendChild(save);
        miscDiv.appendChild(skills);

    }

    //Set Vulnerabilites if this monster has any
    if(temp["damage_vulnerabilities"] !== undefined && temp["damage_vulnerabilities"].length != 0){
        let vulnP = document.createElement('P');
        let vulnBold = document.createElement('strong');
        vulnBold.appendChild(document.createTextNode("Vulnerabilites: "));
        vulnP.appendChild(vulnBold);

        let vulnObj = temp["damage_vulnerabilities"];
        for(const vulnI in vulnObj){
            let vulnNorm = document.createTextNode(`${vulnObj[vulnI]} `);
            vulnP.appendChild(vulnNorm);
        }
        miscDiv.appendChild(vulnP);
    }

    //Set Damage Resistances if this monster has any
    if(temp["damage_resistances"] !== undefined && temp["damage_resistances"].length != 0){
        let drP = document.createElement('P');
        let drBold = document.createElement('strong');
        drBold.appendChild(document.createTextNode("Damage Resistance: "));
        drP.appendChild(drBold);

        let drObj = temp["damage_resistances"];
        for(const drI in drObj){
            let drNorm = document.createTextNode(`${drObj[drI]} `);
            drP.appendChild(drNorm);
        }
        miscDiv.appendChild(drP);
    }

    //Set Damage Immunitities if this monster has any
    if(temp["damage_immunities"] !== undefined && temp["damage_immunities"].length != 0){
        //Set Immunities
        let diP = document.createElement('P');
        let diBold = document.createElement('strong');
        diBold.appendChild(document.createTextNode("Damage Immunities: "));
        diP.appendChild(diBold);

        let diObj = temp["damage_immunities"];
        for(const diI in diObj){
            let diNorm = document.createTextNode(`${diObj[diI]} `);
            diP.appendChild(diNorm);
        }
        miscDiv.appendChild(diP);
        
    }

    //Set Condition Immunities if this monster has any
    if(temp["condition_immunities"] !== undefined && temp["condition_immunities"].length != 0){
        //Set Condition Immunities
        let ciP = document.createElement('P');
        let ciBold = document.createElement('strong');
        ciBold.appendChild(document.createTextNode("Condition Immunities: "));
        ciP.appendChild(ciBold);

        let ciObj = temp["condition_immunities"];
        for(const ciI in ciObj){
            let ciNorm = document.createTextNode(`${ciObj[ciI]["name"]} `);
            ciP.appendChild(ciNorm);
        }
        miscDiv.appendChild(ciP);
    }

    //set Senses

    let sensesP = document.createElement('P');
    let sensesBold = document.createElement('strong');
    sensesBold.appendChild(document.createTextNode("Senses: "));
    sensesP.appendChild(sensesBold);

    let senseObj = temp["senses"];
    for(const senseI in senseObj){
        let senseNorm = document.createTextNode(`${senseI.replace(/_/g, "")}: ${senseObj[senseI]}, `);
        sensesP.appendChild(senseNorm);
    }
    miscDiv.appendChild(sensesP);

    //Set Languages
    let langP = document.createElement('P');
    let langBold = document.createElement('strong');
    langBold.appendChild(document.createTextNode("Languages: "));
    langP.appendChild(langBold);

    let langNorm = document.createTextNode(temp["languages"]);
    langP.appendChild(langNorm);
    miscDiv.appendChild(langP);

    //Set CR
    let crP = document.createElement('P');
    let crBold = document.createElement('strong');
    crBold.appendChild(document.createTextNode("Challenge Rating: "));
    crP.appendChild(crBold);

    let crNorm = document.createTextNode(temp["challenge_rating"]);
    crP.appendChild(crNorm);
    miscDiv.appendChild(crP);


    monsterStatBox.appendChild(miscDiv);

    //Special Abilities
    if(temp["special_abilities"] !== undefined && temp["special_abilities"].length != 0){
        let specialDiv = document.createElement('div');
        specialDiv.setAttribute("class", "StatsBox");
        let specialObj = temp["special_abilities"];
        for(const specialI in specialObj){
            let specialP = document.createElement('P');
            let specialBold = document.createElement('strong');
            specialBold.appendChild(document.createTextNode(specialObj[specialI]["name"]));

            let specialNorm = document.createTextNode(" " + specialObj[specialI]["desc"]);

            specialP.appendChild(specialBold);
            specialP.appendChild(specialNorm);

            specialDiv.appendChild(specialP);
        }
        monsterStatBox.appendChild(specialDiv);
    }

    //Set Abilities Block

    //Set Actions
    let actionDiv = document.createElement('div');
    actionDiv.setAttribute("class", "StatsBox");
    let actionObj = temp["actions"];
    for(const actionI in actionObj){
        let actionP = document.createElement('P');
        let actionBold = document.createElement('strong');
        actionBold.appendChild(document.createTextNode(actionObj[actionI]["name"]));

        let actionNorm = document.createTextNode(" " + actionObj[actionI]["desc"]);

        actionP.appendChild(actionBold);
        actionP.appendChild(actionNorm);

        actionDiv.appendChild(actionP);
    }
    monsterStatBox.appendChild(actionDiv);


    //Set Legendary Actions (if any)
    if(temp["legendary_actions"] !== undefined && temp["legendary_actions"].length != 0){
        let legendDiv = document.createElement('div');
        legendDiv.setAttribute("class", "StatsBox");
        let legendObj = temp["legendary_actions"];
        for(const legendI in legendObj){
            let legendP = document.createElement('P');
            let legendBold = document.createElement('strong');
            legendBold.appendChild(document.createTextNode(legendObj[legendI]["name"]));

            let legendNorm = document.createTextNode(" " + legendObj[legendI]["desc"]);

            legendP.appendChild(legendBold);
            legendP.appendChild(legendNorm);

            legendDiv.appendChild(legendP);
        }
        monsterStatBox.appendChild(legendDiv);
    }

}

//Init function that calls set up functions
function init(){
    setupUI();
    setUpTotalMonsterList();
}

export{init};