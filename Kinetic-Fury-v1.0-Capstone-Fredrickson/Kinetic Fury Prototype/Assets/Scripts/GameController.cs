/* Script for a Game Controller. Holds data needed between scenes, method to 
 * load level scenes, to start a game, move between scenes and set the 
 * number of lives for a game.
 * 
 * 
 * Author: Joshua Fredrickson
 */ 

using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class GameController : MonoBehaviour {

    /*Public Data Memebers*/

    public GameObject[] activePlayers; //0 = player1, 1 = player 2...
    //array of active player objects
    public string[] playerTypes; //0 = player 1 type, etc
    //array of player type strings, each index corresponding to a player
    public string levelTypeName; //given by menu controller;
    //the level type name used when loading the game elvel
    public float audioVolume, musicVolume;
    //audio volume values

    public int numPlayers; //always between 2 and 4. Given by menu controller
    public int scoreToWin; //if tracking kills to win Given by menu controller
    public int startingNumOfLives; //if using stocks Given by menu controller


    public InputField livesInput;
    //the input field for lvies input


    /*Private Data Memebers*/

    private int numPlayersSelected;

    private bool inPlayerSelect;

    private static GameController controller;
    private LevelManager levelManager;


    private void Awake()
    {
        GameController[] controllers = FindObjectsOfType<GameController>();
        if (controller == null)
        {
            DontDestroyOnLoad(this.gameObject);
            return;
        }
        if(controllers.Length > 1)
            Destroy(this.gameObject);
    }

    // Use this for initialization
    void Start () {

        startingNumOfLives = 1;
        audioVolume = .25f;
        musicVolume = .1f;
	}

    //Calls loadlevel with a level type name as a param
    public void StartGame(string levelToStart)
    {
        LoadLevel(levelToStart);
    }

    //sets the leveltypename and then loads a level based on the param
    public void LoadLevel(string levelTypeToLoad)
    {
        levelTypeName = levelTypeToLoad;
        //load level based on type

        //call again in restart as well?

        switch (levelTypeToLoad)
        {
            case "Pit":
                SceneManager.LoadSceneAsync("Pit1 - Copy");
                break;
            case "Omega":
                SceneManager.LoadSceneAsync("Omega");
                break;
            case "Chambre":
                SceneManager.LoadSceneAsync("Chambre");
                break;
        }
    }

    //return to main menu
    public void returnToMainMenu()
    {
        Time.timeScale = 1f;
        SceneManager.LoadScene("Main Menu");
    }
    

    public void MoveToGameTypeSelect(int numOfPlayers)
    {
        numPlayers = numOfPlayers;
        
    }

    public void MoveToPlayerSelect(int numOfPlayers)
    {
        numPlayers = numOfPlayers;
        inPlayerSelect = true;
        playerTypes = new string[numOfPlayers];
        SceneManager.LoadScene("Player Select");
    }

    //set the number of lives for the game
    public void SetNumLives(InputField theField)
    {
        int.TryParse(theField.text, out startingNumOfLives);
        if(startingNumOfLives == 0)
        {
            startingNumOfLives = 1;
        }
        if (theField.text == "")
            startingNumOfLives = 1;
    }


}
