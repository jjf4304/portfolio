/* Script for menu manager, setting game controller values as needed from 
 * player and level select menus, as well as some scene loading
 * 
 * Author: Joshua Fredrickson
 */ 

using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class MenuManager : MonoBehaviour
{

    public GameController controller;
    //Game Controller

    // Use this for initialization, finds GameController
    void Start()
    {
        controller = FindObjectOfType<GameController>();
    }

    //Calls controller to move to player sekect and set the amount of players
    //for the game
    public void MoveToPlayer(int playerNum)
    {
        controller.MoveToPlayerSelect(playerNum);
    }

    //Selects the number of lives in the controller when the 
    //input field changes
    public void SetNumLives(InputField theField)
    {
        controller.SetNumLives(theField);
    }

    //Quits Game
    public void QuitGame()
    {
        Application.Quit();
    }

    //Returns to main menu
    public void Return()
    {
        SceneManager.LoadScene("Main Menu");
    }

    //Goes to Controls Scene
    public void Controls()
    {
        SceneManager.LoadScene("Controls");
    }

    //Goes to Credits Scene
    public void Credits()
    {
        SceneManager.LoadScene("Credits");
    }
}
