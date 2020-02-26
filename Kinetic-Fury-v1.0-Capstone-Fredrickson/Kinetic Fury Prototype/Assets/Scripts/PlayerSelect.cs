/* A scrupt used by the player select screen to hnadle players choosing their 
 * characters. Itchanges text in the ui depending on whose turn it is to choose
 * a character, set the type of player for each palyer in the controller, and has 
 * functions for the buttons used by the player select screen
 * 
 * Author: Joshua Fredrickson
 */ 

using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class PlayerSelect : MonoBehaviour {

    public int currentPlayer;
    //the current player whose tunr it is to pick a character
    public Text displayText;
    //the text to display who needs to pick a character

    private GameController controller;
    //The singleton GameController Object

    //Find the GameController object in the scene
    private void Start()
    {
        controller = FindObjectOfType<GameController>();
    }

    // Update is called once per frame
    /*
     * Checks each frame and sets the text depending on how many players out of the number
     * of players playing have chosen their characters, setting the text as appropriate.
     */ 
    void Update () {

        if (currentPlayer < controller.numPlayers)
            displayText.text = "Player " + (currentPlayer + 1) + ": Please Select Your Character.";
        else
            displayText.text = "Press Start To Continue";
	}

    /*
     * A button function that sets the controller's character paramaeter for the 
     * current player based on what button they clicked
     * 
     */ 
    public void SetCharacter(string type)
    {
        if(currentPlayer < controller.numPlayers)
        {
            controller.playerTypes[currentPlayer] = type;
            currentPlayer++;
        }

    }

    /*
     * A Button function to go back one player so that previous players
     * can reselect their characters
     */ 
    public void GoBackOnCharacter()
    {
        if(currentPlayer > 0)
        {
            currentPlayer--;
        }
    }

    /*
     * Function call to the controller to return to main menu
     */ 
    public void BackToMenu()
    {
        controller.returnToMainMenu();
    }

    /*
     * Function call to advance to the level select screen
     */ 
    public void GoToLevelSelect()
    {
        if (currentPlayer >= controller.numPlayers)
            SceneManager.LoadSceneAsync("Level Select");
    }

}
