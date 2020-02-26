/* The boost pickup script. A child of PickUp. Fills
 * the players boost bar when collided
 * 
 * Author: Joshua Fredrickson
 */ 

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BoostPickup : PickUp {
	
	// Update is called once per frame
	void Update () {
        CheckPickUp(gameObject);
	}

    //On collision, pick up and fill the players boost bar
    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.gameObject.CompareTag("Player"))
        {
            collision.gameObject.GetComponent<PlayerController>().timerBetweenBoosts
                = collision.gameObject.GetComponent<PlayerController>().intervalForBoosts;
            pickedUp = true;
        }
    }
}
