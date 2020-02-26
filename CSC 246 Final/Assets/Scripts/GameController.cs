/* Script for a Game Controller, handling mostly enemy spawning, pause and death menus
 * and airdrop spawning
 * 
 * 
 */ 


using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class GameController : MonoBehaviour {

    public GameObject textCanvas, pausedMenu, deathMenu, goblinPrefab, dropPrefab;
    //Text canvas, paused menu canvas, death menu canvas, enemy prefab and drop prefab
    public Text messageText, waveText;
    // the wave text and message text (which is in textCanvas)
    public Transform[] spawnLocations, dropLocations;
    //array of locations used for random spawning

    public float timeTillStart, timeBtwWave, spawnInterval, healthIncrease,
        timer, timerBetweenDrops, dropSpawnInterval;
    //time until enemies spawn, time btw waves, interval btw spawns, 
    //health increase every x waves, timers for spawning and drops, interval for drops
    public int numToSpawn, currentSpawned, numAlive, waveNum, waveModValue; // value to mod wave num by to see if increase health or not
    //amount to spawn per wave, how many ahve currently been spawned this wave, how many are alive
    // what wave it is, how many waves to add health to enemies
    public bool paused;
    //if game is paused

    private bool allDead, spawning, gameStarted;
    //bools for if all enemies are dead, if game should spawn enemies, and if
    //spawning should start

	// Use this for initialization
	void Start () {
        Time.timeScale = 1f;
        allDead = false;
        spawning = false;
        paused = false;
        gameStarted = false;
        waveText.text = "Current Wave: " + waveNum;
    }
	
	// Update is called once per frame
	void Update () {

        //handle pausing with escape
        if(Input.GetKeyDown(KeyCode.Escape))
        {
            if (!paused)
            {
                Cursor.lockState = CursorLockMode.None;
                Time.timeScale = 0f;
                paused = true;
                pausedMenu.SetActive(true);
            }
            else
            {
                ResumeGame();
            }
        }

        //Spawn logic to spawn enemies and drops
        timer += Time.deltaTime;
        if (!gameStarted)
        {
            if(timer >= timeTillStart)
            {
                gameStarted = true;
                timer = 0f;
                textCanvas.SetActive(false);
                messageText.text = "Aidrop Incoming! Look for the Red Smoke!";
                messageText.fontSize = 24;
                spawning = true;
                waveText.text = "Current Wave: " + waveNum;
            }
        }
        else
        {
            timerBetweenDrops += Time.deltaTime;
            if (!spawning)
            {
                if (allDead)
                {
                    if (timer >= timeBtwWave)
                    {
                        spawning = true;
                        allDead = false;
                        waveNum++;
                        currentSpawned = 0;
                        numToSpawn += 5;
                        waveText.text = "Current Wave: " + waveNum;
                    }
                        
                }

            }
            else if(timer >= spawnInterval && spawning)
            {
                SpawnEnemy();
            }

            if(timerBetweenDrops >= dropSpawnInterval)
            {
                timerBetweenDrops = 0f;
                StartCoroutine("ShowDropMessage");
                Vector3 spawnPos = dropLocations[Random.Range(0, dropLocations.Length - 1)].position;
                GameObject drop = Instantiate(dropPrefab, spawnPos, Quaternion.identity);
            }
        }
	}

    //decrement amount alive and check if the wave is done
    public void KilledEnemy()
    {
        numAlive--;
        if (numAlive <= 0 && !spawning)
            allDead = true;
    }

    //Soawns an enemy at a location chosen randomly
    public void SpawnEnemy()
    {
        Vector3 spawnPos = spawnLocations[Random.Range(0, spawnLocations.Length - 1)].position + Vector3.up;
        float healthMod = 0f;
        timer = 0f;
        if(waveNum % waveModValue == 0)
        {
            healthMod = (waveNum / waveModValue) * healthIncrease;
        }

        GameObject enemy = Instantiate(goblinPrefab, spawnPos, Quaternion.identity);
        enemy.GetComponent<EnemyHealth>().health += healthMod;
        currentSpawned++;
        numAlive++;
        if (currentSpawned >= numToSpawn)
            spawning = false;
    }

    //Display a message that a drop has spawned
    IEnumerator ShowDropMessage()
    {
        textCanvas.SetActive(true);
        yield return new WaitForSeconds(5f);
        textCanvas.SetActive(false);
    }
    
    //un pause game
    public void ResumeGame()
    {
        Time.timeScale = 1f;
        paused = false;
        pausedMenu.SetActive(false);
        Cursor.lockState = CursorLockMode.Locked;
    }
    // show death menu on player death
    public void PlayerDead()
    {
        Time.timeScale = 1f;
        Cursor.lockState = CursorLockMode.None;
        deathMenu.SetActive(true);
    }

}
