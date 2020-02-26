/* Script for menu options
 * 
 * Includes restart game, quit game, and start game options
 * for menu buttons
 */ 

using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class MenuController : MonoBehaviour {

    //Quit Game
	public void QuitGame()
    {
        Application.Quit();
    }

    //Start game
    public void StartGame()
    {
        SceneManager.LoadScene("Game Scene");
    }

    //Return to main menu
    public void ReturnToMenu()
    {
        Time.timeScale = 1f;
        SceneManager.LoadScene("Main Menu");
    }

}
