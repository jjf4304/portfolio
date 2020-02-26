using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public class RoomScript : MonoBehaviour {

    public BoxCollider2D doorLeft, doorRight, doorUp, doorDown;
    public GameObject leftP1Location, rightP1Location, upP1Location,
        downP1Location, leftP2Location, rightP2Location, upP2Location,
        downP2Location;
    public bool bossRoom;
    private EnemySpawner[] spawnerList;
    private bool activeRoom, clearedRoom, spawnerFinished;
    private GameController controller;

	// Use this for initialization
	void Awake () {
        activeRoom = false;
        clearedRoom = false;
        spawnerFinished = false;
        spawnerList = gameObject.GetComponentsInChildren<EnemySpawner>();
        bossRoom = false;
	}

    private void Start()
    {
        controller = FindObjectOfType<GameController>();
    }

    private void Update()
    {
        if (bossRoom)
        {

        }
        else if (activeRoom)
        {
            foreach (EnemySpawner spawner in spawnerList)
            {
                if (!spawner.CheckIfDoneSpawning())
                {
                    Debug.Log("NOT DONE SPAWNING");
                    spawnerFinished = false;
                    break;
                }
                else
                {
                    Debug.Log("DONE SPAWNING " + clearedRoom);
                    spawnerFinished = true;
                    
                }
            }

            if (spawnerFinished && clearedRoom)
            {
                Debug.Log("ABOUT TO OPEN ROOMS");
                activeRoom = false;
                //OpenDoors();
                //Spawn Treasure Chest.
                int rand = Random.Range(0, controller.listOfChests.Count);
                controller.listOfChests[rand].transform.position = controller.Grid[controller.currentXPos, controller.currentYPos].transform.position;
                controller.listOfChests.RemoveAt(rand);
            }
        }
        
    }

    private void OnTriggerEnter2D(Collider2D collision)
    {
        
        if (collision.gameObject.CompareTag("Player") && !clearedRoom && collision.GetType() == typeof(BoxCollider2D))
        {
            activeRoom = true;
            ActivateSpawnersInRoom();
            CloseDoors();
        }
    }

    public void CloseDoors()
    {
        /*
        if (doorLeft != null)
            //doorLeft.isTrigger = false;
        if (doorRight != null)
            //doorRight.isTrigger = false;
        if (doorUp != null)
           // doorUp.isTrigger = false;
        if (doorDown != null)
           // doorDown.isTrigger = false;
           */
    }

    public void OpenDoors()
    {
        
        if (doorLeft != null)
            doorLeft.isTrigger = true;
        if (doorRight != null)
            doorRight.isTrigger = true;
        if (doorUp != null)
            doorUp.isTrigger = true;
        if (doorDown != null)
            doorDown.isTrigger = true;
            
    }

    private void ActivateSpawnersInRoom()
    {
        foreach(EnemySpawner spawner in spawnerList)
        {
            spawner.Activate();
        }
    }

    public bool ClearedRoom
    {
        set
        {
            clearedRoom = value;
        }

        get
        {
            return clearedRoom;
        }
    }
}
