<?php

/*
Author: Joshua Fredrickson

File to get the parameters sent by main.js, sets up the API url using those parameters

Using the Rolz API
*/

$url = "https://rolz.org/api/?";
$rollCode = "";
$numOfDice = "";
$numSides = "";
$modifier = "";

if(array_key_exists('numOfDice', $_GET)){
    $numOfDice = $_GET['numOfDice'];
}
if(array_key_exists('numSides', $_GET)){
    $numSides = $_GET['numSides'];
}
if(array_key_exists('modifier', $_GET)){
    $modifier = $_GET['modifier'];
}

//The way the API expects to get the roll command
$rollCode = $numOfDice . 'd' . $numSides . '+' . $modifier . ".json";

$url = $url . $rollCode;

$jsonString = file_get_contents($url);
header('content-type:application/json'); 
header("Access-Control-Allow-Origin: *"); 
echo $jsonString;

?>