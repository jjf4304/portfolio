//Author: Joshua Fredrickson
//Some utility functions for used for sorting and searching

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort 
function compareAscending(a,b){
    if(a.name > b.name)
        return 1;
    if(a.name < b.name)
        return -1;
    else
        return 0;
}

function compareDescending(a,b){
    if(a.name < b.name)
        return 1;
    if(a.name > b.name)
        return -1;
    else
        return 0;
}

function search(value, monsterList, currentList){
    window.localStorage.setItem("search", value);
    let name = "";
    for(let monster of monsterList){
        name = monster.name;
        if(name.includes(value)){
            currentList.push(monster);
        }
    }
}

export{compareAscending, compareDescending, search};