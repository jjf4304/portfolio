/* Script to handle movement of the player
 * 
 * Moves based on keyboard input and rotates based on mouse input
 * plays audio on movement
 */ 

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Movement : MonoBehaviour {

    public float rotationSpeed, rotateX, rotateY, moveHor, moveVert, movespeed;
    public Transform mainCamera;
    public GameObject gun;
    public AudioSource audio;
    public bool movingVer, movingHor;

    private GameController gameController;
    private CharacterController controller;

    // Use this for initialization
    void Start () {
        controller = GetComponent<CharacterController>();
        gameController = FindObjectOfType<GameController>();
        audio = GetComponent<AudioSource>();
        rotateX = 0f;
        rotateY = 0f;
        movingVer = false;
        movingHor = false;
	}
	
	// Update is called once per frame
	void Update () {

        //if the game isnt paused, process all input
        if (!gameController.paused)
        {
            //rotate values
            rotateY = Input.GetAxis("Mouse X") * rotationSpeed;
            rotateX = -1 * Input.GetAxis("Mouse Y") * rotationSpeed;

            //movement values
            moveVert = Input.GetAxis("Vertical");
            moveHor = Input.GetAxis("Horizontal");

            //rotate player
            transform.Rotate(Vector3.up, rotateY);
            mainCamera.Rotate(Vector3.right, rotateX);

            gun.transform.Rotate(Vector3.right, rotateX);

            //control movement
            if (moveVert > 0.3f)
            {
                controller.SimpleMove(transform.forward * movespeed);
                movingVer = true;
            }
            else if (moveVert < -.3f)
            {
                controller.SimpleMove(-1 * transform.forward * movespeed);
                movingVer = true;
            }
            else if (moveVert > -.3f && moveVert <= .3f)
            {
                movingVer = false;
            }

            if (moveHor > .3f)
            {
                controller.SimpleMove(transform.right * movespeed);
                movingHor = true;
            }
            else if (moveHor < -.3f)
            {
                controller.SimpleMove(transform.right * -movespeed);
                movingHor = true;
            }
            else if (moveHor > -.3f && moveHor <= .3f)
            {
                movingHor = false;
            }

            if (movingHor || movingVer)
            {
                if (!audio.isPlaying)
                    audio.Play();
            }
            else
            {
                audio.Stop();
            }
        }
        


    }

}
