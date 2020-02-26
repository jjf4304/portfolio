using System.Collections;
using System.Collections.Generic;
using UnityEngine.UI;
using UnityEngine;

public class GameController : MonoBehaviour
{

    public GameObject player1;
    public GameObject player2;
    public GameObject camera;
    public GameObject roomCenterStart;
    public GameObject centerRoomPrefab;
    public GameObject topLeftCornerRoom, topRightCornerRoom, botRightCornerRoom, botLeftCornerRoom;
    public GameObject player1Prefab, player2Prefab;
    public GameObject chestPrefab;
    public GameObject boss;
    public GameObject panel;
    public Text DoorText;
    public List<GameObject> listOfChests;
    public int sizeOfGrid;

    //Set these when placing players
    public int currentXPos;  //Current room x pos of players
    public int currentYPos;  //Current room y pos of players

    private int numOfPlayers;
    private GameObject[,] grid;
    private bool spawnedBoss;
    private bool paused;
    private Object[] leftRooms, bottomRooms, topRooms, rightRooms;
    private List<GameObject> listOfCurrentEnemies;
    private static GameController controller;


    private void Awake()
    {
        if (controller == null)
        {
            DontDestroyOnLoad(this.gameObject);
        }
        else if (controller != this)
        {
            Destroy(gameObject);
        }

        if (sizeOfGrid == 0)
            sizeOfGrid = 3;
        spawnedBoss = false;
        paused = true;
        listOfCurrentEnemies = new List<GameObject>();
        grid = new GameObject[sizeOfGrid, sizeOfGrid];
        leftRooms = Resources.LoadAll("LeftRooms");
        rightRooms = Resources.LoadAll("RightRooms");
        topRooms = Resources.LoadAll("TopRooms");
        bottomRooms = Resources.LoadAll("BottomRooms");

        GameObject chest = Instantiate(chestPrefab);
        chest.GetComponent<Chest>().Loot = Chest.LootType.Key;

        listOfChests.Add(chest);

        int rand;

        for(int i = 0; i < 6; i++)
        {
            chest = Instantiate(chestPrefab);
            rand = Random.Range(0, 3);
            switch (rand)
            {
                case 0:
                    chest.GetComponent<Chest>().Loot = Chest.LootType.Health;
                    break;
                case 1:
                    chest.GetComponent<Chest>().Loot = Chest.LootType.FireArrow;
                    break;
                case 2:
                    chest.GetComponent<Chest>().Loot = Chest.LootType.IceArrow;
                    break;
            }

            listOfChests.Add(chest);

        }
        SetUpMap();
    }

    // Update is called once per frame
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.U))
        {
            SetUpMap();
        }

        if(currentXPos == 1 && currentYPos == 1 && !spawnedBoss)
        {
           GameObject theBoss = Instantiate(boss, grid[currentXPos, currentYPos].transform.position, Quaternion.identity);
            spawnedBoss = true;
            theBoss.GetComponent<ramLogic>().target = player1;
        }

        if (Input.GetButtonDown("Pause"))
        {
            if (!paused)
            {
                panel.SetActive(true);
                paused = true;
                Time.timeScale = 0f;               
            }
            else
            {
                panel.SetActive(false);
                paused = false;
                Time.timeScale = 1f;
            }                
        }

        float step = 20 * Time.deltaTime;
        camera.transform.position = Vector3.MoveTowards(camera.transform.position, grid[currentXPos, currentYPos].transform.position + new Vector3(0f, 0f, -10f), step);

    }

    private void SetUpMap()
    {
        if(centerRoomPrefab == null)
            Debug.Log("HWIAKIKIFJA");

        float xOffsetStart = centerRoomPrefab.GetComponent<SpriteRenderer>().bounds.size.x;
        float yOffsetStart = centerRoomPrefab.GetComponent<SpriteRenderer>().bounds.size.y;

        float xOffset = 0;
        float yOffset = 0;

        Vector3 placementLocation = centerRoomPrefab.transform.position;

        int whichRoomToSpawnIn = Random.Range(0, 3);

        switch (whichRoomToSpawnIn)
        {
            case 0:
                currentXPos = 0;
                currentYPos = 0;
                break;
            case 1:
                currentXPos = sizeOfGrid-1;
                currentYPos = 0;
                break;
            case 2:
                currentXPos = 0;
                currentYPos = sizeOfGrid - 1;
                break;
            case 3:
                currentXPos = sizeOfGrid - 1;
                currentYPos = sizeOfGrid - 1;
                break;
            default:
                currentXPos = 0;
                currentYPos = 0;
                break;
        }

        //DO THIS AFTER DECIDING WHERE PLAYERS GO
        for (int i = 0; i < sizeOfGrid; i++)
        {
            yOffset = yOffsetStart * i;
            for(int j = 0; j < sizeOfGrid; j++)
            {
                int rand;
                
                xOffset = xOffsetStart * j;
                //FIGURE OUT WHAT TYPE OF TILE NEEDS TO BE LAID DOWN, CHOOSE THE RIGHT RESOURCES PACK ARRAY, AND RANDOMLY CHOOSE ONE OF THEM AND PLACE IT
                if(i==0 && j == (sizeOfGrid-1) / 2)//bot middle
                {
                    rand = Random.Range(0, bottomRooms.Length);
                    
                    grid[i, j] = Instantiate(bottomRooms[rand] as GameObject, new Vector3(xOffset, yOffset, 0f), Quaternion.identity);
                    grid[i, j].GetComponent<RoomScript>().CloseDoors();
                }
                else if(i == (sizeOfGrid - 1) / 2 && j == 0) //left
                {
                    rand = Random.Range(0, leftRooms.Length);
                    grid[i, j] = Instantiate(leftRooms[rand] as GameObject, new Vector3(xOffset, yOffset, 0f), (leftRooms[rand] as GameObject).transform.rotation);
                    //grid[i, j].transform.eulerAngles = new Vector3(grid[i, j].transform.eulerAngles.x, grid[i, j].transform.eulerAngles.y, -90f);
                    grid[i, j].GetComponent<RoomScript>().CloseDoors();
                }
                else if (i == (sizeOfGrid - 1) / 2 && j == (sizeOfGrid - 1)) // right
                {
                    rand = Random.Range(0, rightRooms.Length);
                    grid[i, j] = Instantiate(rightRooms[rand] as GameObject, new Vector3(xOffset, yOffset, 0f), (rightRooms[rand] as GameObject).transform.rotation);
                    //grid[i, j].transform.eulerAngles = new Vector3(grid[i, j].transform.eulerAngles.x, grid[i, j].transform.eulerAngles.y, 90f);
                    grid[i, j].GetComponent<RoomScript>().CloseDoors();
                }
                else if (i == (sizeOfGrid-1) && j == (sizeOfGrid - 1)/2) //top mid
                {
                    Debug.Log("IN TOP");
                    rand = Random.Range(0, topRooms.Length);
                    grid[i, j] = Instantiate(topRooms[rand] as GameObject, new Vector3(xOffset, yOffset, 0f), (topRooms[rand] as GameObject).transform.rotation);
                    //grid[i, j].transform.eulerAngles = new Vector3(grid[i, j].transform.eulerAngles.x, grid[i, j].transform.eulerAngles.y, 0f);
                    grid[i, j].GetComponent<RoomScript>().CloseDoors();
                }
                else if(i == 0 && j == 0)
                {
                    grid[i, j] = Instantiate(botLeftCornerRoom, new Vector3(xOffset, yOffset, 0f), botLeftCornerRoom.transform.rotation);
                }
                else if(i == 0 && j == (sizeOfGrid - 1))
                {
                    grid[i, j] = Instantiate(botRightCornerRoom, new Vector3(xOffset, yOffset, 0f), botRightCornerRoom.transform.rotation);
                }
                else if (i == (sizeOfGrid - 1) && j == 0)
                {
                    grid[i, j] = Instantiate(topLeftCornerRoom, new Vector3(xOffset, yOffset, 0f), topLeftCornerRoom.transform.rotation);
                }
                else if (i == (sizeOfGrid-1) && j == (sizeOfGrid - 1))
                {
                    grid[i, j] = Instantiate(topRightCornerRoom, new Vector3(xOffset, yOffset, 0f), topRightCornerRoom.transform.rotation);
                }
                
                else
                {
                    grid[i, j] = Instantiate(centerRoomPrefab, new Vector3(xOffset, yOffset, 0f), Quaternion.identity);
                    
                }

                
                //add to list of rooms.
            }      
        }

        grid[currentXPos, currentYPos].GetComponent<RoomScript>().ClearedRoom = true;
        //grid[currentXPos, currentYPos].GetComponent<RoomScript>().OpenDoors();

        player1 = Instantiate(player1Prefab);

        player1.transform.position = grid[currentXPos, currentYPos].transform.position;
        player1.GetComponent<Movement>().playerName = "P1";

        if (numOfPlayers == 2)
        {
            player2 = Instantiate(player2Prefab);
            player2.GetComponent<Movement>().playerName = "P2";
            player2.transform.position = grid[currentXPos, currentYPos].transform.position + new Vector3(0f, 3f, 0f);
        }

        camera.transform.position = grid[currentXPos, currentYPos].transform.position + new Vector3(0f,0f,-10f);

    }

    public void AddToEnemyList(GameObject enemy)
    {
        if(enemy.GetComponent<BasicEnemyAI>() != null)
        {
            listOfCurrentEnemies.Add(enemy);
        }            
    }

    public void RemoveFromEnemyList(GameObject enemy)
    {
        if (listOfCurrentEnemies.Contains(enemy))
        {
            listOfCurrentEnemies.Remove(enemy);

            if (listOfCurrentEnemies.Count == 0)
            {
                Debug.Log("EMPTY");
                //set current room as finished.
                grid[currentXPos, currentYPos].GetComponent<RoomScript>().ClearedRoom = true;
            }
        }
    }

    public void SetUpPlayers(int num)
    {
        //used by buttons in menu to set up number of players.
        numOfPlayers = num;
    }

    public void ChangeRoom(int xChange, int yChange)
    {
        currentXPos += xChange;
        currentYPos += yChange;
        //grid[currentXPos, currentYPos].GetComponent<RoomScript>().OpenDoors();
    }

    public void FoundKey()
    {
        Debug.Log("FOUND KEY");
        for (int i = 0; i < sizeOfGrid; i++)
        {
            for (int j = 0; j < sizeOfGrid; j++)
            {
                grid[i, j].GetComponent<RoomScript>().OpenDoors();
            }
        }
    }

    public int NumOfPlayers
    {
        get
        {
            return numOfPlayers;
        }
        set
        {
            numOfPlayers = value;
        }
    }

    public GameObject[,] Grid
    {
        get
        {
            return grid;
        }
    }
}
