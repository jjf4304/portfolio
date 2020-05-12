<?php

/*
Author: Joshua Fredrickson

File to get the parameters sent by main.js, sets up the API url using those parameters

Using the D&D 5e API
*/


$url = "http://dnd5eapi.co/api/monsters/";

if(array_key_exists('search', $_GET)){
    $search = $_GET['search'];
    $url = $url . $search;
}
else{
    $search = "";
}

$jsonString = file_get_contents($url);
header('content-type:application/json'); 
header("Access-Control-Allow-Origin: *"); 
echo $jsonString;

?>