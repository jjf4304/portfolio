/* Script for the LEvel Manager. Handles player spawning and setup, starting music
 * , pausing the game, acivates/deactivates traps as needed, handles checking 
 * if all players are dead, etc
 * 
 * Author: Joshua Fredrickson
 */ 

using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class LevelManager : MonoBehaviour {

    public string levelTypeName;
    //The type of level

    public Transform[] spawnLocations; //0 = player1, 1 = player 2...
    //Array of transforms for spawn locations
    public PlayerPanel[] playerPanels;
    //Array of player UI panels
    public GameObject[] uiPanels, playerPrefabs; //0 = jimmy, 1 = data, 2 = cynthia
    //array of UI oanels and array of player Prefabs
    public int numPlayersAlive;
    //the number of players left alive
    public bool paused;
    //bool if the game is paused
    public GameObject pauseMenu, winMenu;
    //Game object for UI pause and win screens
    public Text winText;
    //Text to display which player won
    public Sprite[] playerNumSprites;
    //Array of player number sprites
    public Slider volumeSlider, musicSlider;
    //refrences to pause menu sliders for volumes

    public AudioSource inGameMusic;
    //Audio source for scene
    public AudioClip[] musicClips; //set correct music for the level based on level name
    //array of song clips

    private GameController controller;

    private void Awake()
    {
       // controller = FindObjectOfType<GameController>();
       // inGameMusic = GetComponent<AudioSource>();
       // Debug.Log(controller.levelTypeName);
       // InitiateLevel(controller.levelTypeName);
    }

    // Use this for initialization
    void Start () {
        controller = FindObjectOfType<GameController>();
        inGameMusic = GetComponent<AudioSource>();
        Debug.Log(controller.numPlayers);
        InitiateLevel(controller.levelTypeName);

        foreach (AudioSource item in FindObjectsOfType<AudioSource>())
        {
            item.volume = controller.audioVolume;
        }

        Time.timeScale = 1f;

        inGameMusic.volume = controller.musicVolume;
    }

    /*
     * Sets up the player ui panels, starts playing music, activates
     * traps, and calls SpawnPlayers(). Used at start of level
     */ 
    public void InitiateLevel(string levelName)
    {

        playerPanels = new PlayerPanel[4];

        for (int i = 0; i < playerPanels.Length; i++)
        {
            playerPanels[i] = uiPanels[i].GetComponent<PlayerPanel>();
        }

        levelTypeName = levelName;

        numPlayersAlive = 0;

        //Music
        //inGameMusic.volume = controller.audioVolume;
        int chooseSong = Random.Range(0, musicClips.Length);
        inGameMusic.clip = musicClips[chooseSong];
        inGameMusic.Play();

        //Activate level traps
        ActivateTraps();

        if(controller.numPlayers == 2)
        {
            uiPanels[2].SetActive(false);
            uiPanels[3].SetActive(false);
        }
        if(controller.numPlayers == 3)
        {
            uiPanels[3].SetActive(false);
        }

        SpawnPlayers();
    }

    /*
     * Function to Activatte all traps in the level based on what type of
     * level it is.
     */ 
    public void ActivateTraps()
    {
        Debug.Log(levelTypeName);
        switch (levelTypeName)
        {
            case "Pit":
                FireTrap[] flamethrowers = FindObjectsOfType<FireTrap>();
                foreach (var item in flamethrowers)
                {
                    item.InitiateTraps();
                }
                break;
            case "Omega":
                LaserTrap[] lasers = FindObjectsOfType<LaserTrap>();
                foreach (var item in lasers)
                {
                    item.InitiateTraps();
                }
                break;
            case "Chambre":
                PendulumTrap[] pendulums = FindObjectsOfType<PendulumTrap>();
                foreach (var item in pendulums)
                {
                    item.InitiateTraps();
                }
                break;
            
        }
    }

    /*
     * Function to Deactivate all traps in the level based on what type of
     * level it is.
     */
    public void DeactivateTraps()
    {
        switch (levelTypeName)
        {
            case "Pit":
                FireTrap[] flamethrowers = FindObjectsOfType<FireTrap>();
                foreach (var item in flamethrowers)
                {
                    item.DeactivateTraps();
                }
                break;
            case "Omega":
                LaserTrap[] lasers = FindObjectsOfType<LaserTrap>();
                foreach (var item in lasers)
                {
                    item.DeactivateTraps();
                }
                break;
            case "Chambre":
                PendulumTrap[] pendulums = FindObjectsOfType<PendulumTrap>();
                foreach (var item in pendulums)
                {
                    item.DeactivateTraps();
                }
                break;

        }
    }

    /*
     * Decrement the number of players alive when a player runs out of lives.
     * if there is only one player left, start the win screen and show the win screen.
     */ 
    public void IncrementDeadPlayers()
    {
        numPlayersAlive++;
        if(numPlayersAlive == controller.numPlayers - 1)
        {
            Time.timeScale = 0f;
            winMenu.SetActive(true);
            PlayerController[] winner = FindObjectsOfType<PlayerController>();
            foreach (PlayerController item in winner)
            {
                if (item.alive)
                {
                    winText.text = "Player " + item.playerNum.ToString() + " Wins!";
                    return;
                }
            }
        }
    }

    /*
     * For each player for that game, instantiate a player based on what type they chose and where
     * that player should spawn. Then it sets up and attaaches all needed ui elements, player 
     * controller data, number of lives, etc.
     */ 
    public void SpawnPlayers()
    {
        for (int i = 0; i < controller.numPlayers; i++)
        {
            GameObject player;
            switch (controller.playerTypes[i])
            {
                case "Jimmy":
                    player = Instantiate(playerPrefabs[0], spawnLocations[i].position, Quaternion.identity);
                    break;
                case "Data":
                    player = Instantiate(playerPrefabs[1], spawnLocations[i].position, Quaternion.identity);
                    break;
                case "Cynthia":
                    player = Instantiate(playerPrefabs[2], spawnLocations[i].position, Quaternion.identity);
                    break;
                default:
                    player = Instantiate(playerPrefabs[2], spawnLocations[i].position, Quaternion.identity);
                    break;
            }

            
            player.GetComponent<Health>().healthBarFill = playerPanels[i].healthBar;
            player.GetComponent<PlayerController>().boostBarFill = playerPanels[i].boostBar;
            player.GetComponent<PlayerController>().powerBarFill = playerPanels[i].powerBar;
            player.GetComponent<PlayerController>().weaponText = playerPanels[i].playerWeapontext;
            player.GetComponent<PlayerController>().ammoText = playerPanels[i].playerAmmoText;
            player.GetComponent<PlayerController>().livesText = playerPanels[i].playerCountText;
            player.GetComponent<PlayerController>().livesText.text = controller.startingNumOfLives.ToString();
            player.GetComponent<PlayerController>().numLives = controller.startingNumOfLives;
            player.GetComponent<PlayerController>().playerNum = i + 1;
            player.GetComponent<PlayerController>().playerString = "_P" + (i + 1).ToString();
            //setup base sprite based on player
            //setup arm sprite based on player
            player.GetComponent<PlayerController>().playerNumSprite.sprite = playerNumSprites[i];
        }
    }

    //Pause/unpause the game on input
    public void Pause()
    {
        if (!paused)
        {
            paused = true;
            pauseMenu.SetActive(true);
            Time.timeScale = 0f;
        }
        else
        {
            paused = false;
            pauseMenu.SetActive(false);
            Time.timeScale = 1f;
        }
    }

    public void ReturnToMain()
    {
        Time.timeScale = 1f;
        SceneManager.LoadScene("Main Menu");
    }

    public void QuitGame()
    {
        Application.Quit();
    }

    public void ChangeGameVolume()
    {
        controller.audioVolume = volumeSlider.value;
        foreach (AudioSource item in FindObjectsOfType<AudioSource>())
        {
            item.volume = controller.audioVolume;
        }
    }

    public void ChangeMusicVolume()
    {
        controller.musicVolume = musicSlider.value;
        inGameMusic.volume = controller.musicVolume;
    }
}
