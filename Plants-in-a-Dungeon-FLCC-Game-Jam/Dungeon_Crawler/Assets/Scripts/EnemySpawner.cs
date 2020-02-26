using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnemySpawner : MonoBehaviour {

    public GameController controller;
    public GameObject enemy;
    public int numEnemiesToSpawn;
    public int maxSpawnVariance;
    public float timeTillSpawn;
    public float spawnTimeVariance;

    private float timer;
    private bool activeSpawner, doneSpawning;
    private int amountSpawned;


	// Use this for initialization
	void Start () {
        controller = FindObjectOfType<GameController>();
        timer = 0f;
        amountSpawned = 0;
        activeSpawner = false;
        doneSpawning = false;
        numEnemiesToSpawn += Random.Range(0, maxSpawnVariance);
	}
	
	// Update is called once per frame
	void Update () {
        if (activeSpawner && !doneSpawning)
        {
            timer += Time.deltaTime;
            if(timer >= timeTillSpawn && amountSpawned < numEnemiesToSpawn)
            {
                timer = 0f;
                GameObject newEnemy = Instantiate(enemy, transform.position, Quaternion.identity);
                controller.AddToEnemyList(newEnemy);


                //CHANGE THIS LATER TO RANDOMISE IF MELEE OR RANGED
                newEnemy.GetComponent<BasicEnemyAI>().ranged = false;
                //Call activate enemy stuff to send at player.
                amountSpawned++;

                if(amountSpawned >= numEnemiesToSpawn)
                {
                    activeSpawner = false;
                    doneSpawning = true;
                }
            }
            if (amountSpawned >= numEnemiesToSpawn)
            {
                activeSpawner = false;
                doneSpawning = true;
            }
        }
	}

    public bool CheckIfDoneSpawning()
    {
        return doneSpawning;
    }

    public void Activate()
    {
        /*
        //Spawn enemy immediately after being activated.
        GameObject newEnemy = Instantiate(enemy, transform.position, Quaternion.identity);
        controller.AddToEnemyList(newEnemy);

        //CHANGE THIS TO RANDOM CHANCE
        int chanceOfRange = Random.Range(0, 2);
        if(chanceOfRange == 0) // 0 = melee
            newEnemy.GetComponent<BasicEnemyAI>().ranged = false;
        else // 1 = ranged
        {
            newEnemy.GetComponent<BasicEnemyAI>().ranged = true;
        }
        //activate the enemy here, calling the function to send thema fter player.
        amountSpawned++;
        */
        activeSpawner = true;
    }
}
