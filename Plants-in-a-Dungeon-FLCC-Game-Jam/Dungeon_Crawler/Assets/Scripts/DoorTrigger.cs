using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DoorTrigger : MonoBehaviour {

    public enum DoorType
    {
        Left,
        Right,
        Up,
        Down
    };

    public DoorType doorDirection;
    public bool fireDoor;
    public Sprite fire;
    public RoomScript room;

    private GameController controller;

    private void Start()
    {
        controller = FindObjectOfType<GameController>();
        room = GetComponentInParent<RoomScript>();

        if (fireDoor)
        {
            GetComponent<SpriteRenderer>().sprite = fire;
            GetComponent<SpriteRenderer>().drawMode = SpriteDrawMode.Tiled;
            GetComponent<SpriteRenderer>().size = new Vector2(5.36f, 1f);            
            GetComponent<BoxCollider2D>().isTrigger = false;
        }
    }

    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.gameObject.CompareTag("Player") && room.ClearedRoom && collision.GetType() == typeof(BoxCollider2D)){
            controller.DoorText.text = "Press A to enter";
        }

    }

    private void OnTriggerExit2D(Collider2D collision)
    {
        if (collision.gameObject.CompareTag("Player") && room.ClearedRoom && collision.GetType() == typeof(BoxCollider2D)){
            controller.DoorText.text = "";
        }
    }

    private void OnTriggerStay2D(Collider2D collision)
    {
        if (collision.gameObject.CompareTag("Player") && room.ClearedRoom && Input.GetButtonDown("Interact" + collision.GetComponent<Movement>().playerName) && collision.GetType() == typeof(BoxCollider2D))
        {
            Debug.Log("AJWJWFJ");
            switch (doorDirection)
            {
                case DoorType.Left:
                    controller.ChangeRoom(0, -1);
                    controller.player1.transform.position = 
                        controller.Grid[controller.currentXPos, controller.currentYPos]
                        .GetComponent<RoomScript>().rightP1Location.transform.position;
                    if(controller.NumOfPlayers == 2)
                        controller.player2.transform.position =
                        controller.Grid[controller.currentXPos, controller.currentYPos]
                        .GetComponent<RoomScript>().rightP2Location.transform.position;
                    break;
                case DoorType.Right:
                    controller.ChangeRoom(0, 1);
                    controller.player1.transform.position =
                        controller.Grid[controller.currentXPos, controller.currentYPos]
                        .GetComponent<RoomScript>().leftP1Location.transform.position;
                    if (controller.NumOfPlayers == 2)
                        controller.player2.transform.position =
                        controller.Grid[controller.currentXPos, controller.currentYPos]
                        .GetComponent<RoomScript>().leftP2Location.transform.position;
                    break;
                case DoorType.Up:
                    controller.ChangeRoom(1, 0);
                    controller.player1.transform.position =
                        controller.Grid[controller.currentXPos, controller.currentYPos]
                        .GetComponent<RoomScript>().downP1Location.transform.position;
                    if (controller.NumOfPlayers == 2)
                        controller.player2.transform.position =
                        controller.Grid[controller.currentXPos, controller.currentYPos]
                        .GetComponent<RoomScript>().downP2Location.transform.position;
                    break;
                case DoorType.Down:
                    controller.ChangeRoom(-1, 0);
                    controller.player1.transform.position =
                        controller.Grid[controller.currentXPos, controller.currentYPos]
                        .GetComponent<RoomScript>().upP1Location.transform.position;
                    if (controller.NumOfPlayers == 2)
                        controller.player2.transform.position =
                        controller.Grid[controller.currentXPos, controller.currentYPos]
                        .GetComponent<RoomScript>().upP2Location.transform.position;
                    break;
            }
        }
    }

}
