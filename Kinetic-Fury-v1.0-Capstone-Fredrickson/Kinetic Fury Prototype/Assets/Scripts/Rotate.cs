/* A method to describe the rotating player gun arm that serves as the aiming
 * mechanic in game. Rotates around the player body based on controller input,
 * pointing the players gun in the direction they choose to rotate towards.
 * 
 * Author: Joshua Fredrickson
 */ 

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Rotate : MonoBehaviour {

    private SpriteRenderer bodySprite, armSprite;
    //references to the player body sprite and arm sprite
    private string playerString;
    //reference to the player number string for input use
   

    //Initializes the player string, body sprite and arm sprite data members
    private void Start()
    {
        playerString = GetComponentInParent<PlayerController>().playerString;
        bodySprite = GetComponentInParent<SpriteRenderer>();
        armSprite = GetComponentInChildren<SpriteRenderer>();
    }

    // Update is called once per frame
    /*
     * This Update checks each frame for the horizontal and vertical input from the 
     * player's left joystick, and from there determines the position the arm needs to
     * be pointing towards based on vectors. It has a check for if the player has rotated 
     * about 180 degrees to flip the character sprite to look the other direction while 
     * keeping the aim direction
     */ 
    void Update()
    {
        if (!FindObjectOfType<LevelManager>().paused)
        {
            Vector2 targetDir = new Vector2(Input.GetAxis("Horizontal" + playerString), Input.GetAxis("Vertical" + playerString));
            Vector2 playerPos = transform.position;

            Vector2 offset = targetDir - playerPos;

            transform.rotation = Quaternion.LookRotation(transform.forward, targetDir);
            transform.Rotate(new Vector3(0f, 0f, 90f));

            if (Mathf.Abs(transform.rotation.z) >= .7f)
            {
                bodySprite.flipX = true;
                armSprite.flipY = true;
            }
            else
            {
                bodySprite.flipX = false;
                armSprite.flipY = false;
            }
        }
        
    }

}
