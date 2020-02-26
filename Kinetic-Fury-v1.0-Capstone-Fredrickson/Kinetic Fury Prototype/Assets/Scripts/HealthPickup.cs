
/* Script for a health pickup. Child of Pick Up.
 * On player collision, heals the player an amount.
 * 
 * Author: Joshua Fredrickson
 */ 
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class HealthPickup : PickUp {

    public float healAmount;
    //amount to heal the player on collision

    private void Update()
    {
        CheckPickUp(gameObject);
    }

    //On collision with palyer, heals the player
    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.gameObject.CompareTag("Player"))
        {
            collision.gameObject.GetComponent<Health>().Increment(healAmount);
            pickedUp = true;
        }
    }
}