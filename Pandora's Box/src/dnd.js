//Author: Joshua Fredrickson
//File to send requests to dnd-loader.php and return the resulting JSON


//Used to load monster details, etiher individually or in bulk.
function loadMonsterDetails(url, callbackFunc){
    const xhr = new XMLHttpRequest();

    xhr.onerror = (e) => console.log("Error in Loading Monsters from: " + url);

    xhr.onload = (e) =>{
        const headers = e.target.getAllResponseHeaders();
        const jsonString = e.target.response;
        callbackFunc(jsonString);
    }

    xhr.open("GET", url);

    xhr.send();
}

export{loadMonsterDetails};