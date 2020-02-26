/* This script descibes a Character Power bar fill pickup. On collision
 * with a player, it will fill their power charge and despawn for a short time,
 * until it respawns. It is a child of the Pickup script.
 * 
 * Author: Joshua Fredrickson
 */ 

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PowerPickup : PickUp {

    void Update()
    {
        //Call to parent object Pickup's CheckPickUp
        CheckPickUp(gameObject);
    }

    /*
     * On collision with a player, fill their power bar and set pickedUp to true
     */ 
    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.gameObject.CompareTag("Player"))
        {
            collision.gameObject.GetComponent<PlayerController>().timerBetweenPower
                = collision.gameObject.GetComponent<PlayerController>().intervalForPowers;
            pickedUp = true;
        }
    }
}
