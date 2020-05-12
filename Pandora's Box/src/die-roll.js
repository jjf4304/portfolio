//Author: Joshua Fredrickson
//File to send requests to die-roll.php and return the resulting JSON


//Function to call the Rolz API
function rollDie(url, callbackFunc){
    const xhr = new XMLHttpRequest();

    xhr.onerror = (e) => console.log("Error in Rolling Dice from: " + url);

    xhr.onload = (e) =>{
        const headers = e.target.getAllResponseHeaders();
        const jsonString = e.target.response;
        callbackFunc(jsonString);
    }

    xhr.open("GET", url);

    xhr.send();
}

export{rollDie};