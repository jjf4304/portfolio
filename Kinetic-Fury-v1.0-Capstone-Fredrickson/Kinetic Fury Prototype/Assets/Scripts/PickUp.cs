/*
 * Script to describe Pickups. Its the parent class for pickups
 * Controls respawning and despawining of the pickup
 * 
 * Author: Joshua Fredrickson
 */ 

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PickUp : MonoBehaviour {

    public Sprite pickupSprite;
    //the pick up sprite
    public float respawnTimer;
    //the timer to use for respawning
    public float timeToRespawn;
    //the time interval between despawn and respawn
    protected bool pickedUp;
    //bool for if the pick up has been picked up, children have access to it

    // Use this for initialization
    void Start () {
        if (timeToRespawn == 0)
            timeToRespawn = 30f;
        pickedUp = false;
	}

    /*
     * Method to check if the pick up needs to be desoawned or respawned.
     * If the pick up has been picked up, despawn it and start the timer 
     * until its respawned. When the timer is greater than the interval, 
     * respawn
     */ 
    public void CheckPickUp(GameObject theObject)
    {
        if (pickedUp)
        {
            Debug.Log("DWDWDWDWDWD");
            DespawnPickUp();
            respawnTimer += Time.deltaTime;
            if (respawnTimer >= timeToRespawn)
            {
                respawnTimer = 0f;
                pickedUp = false;
                RespawnPickUp();
            }
        }
    }

    //Re-activate sprite and make collidable again.
    public void RespawnPickUp()
    {
        gameObject.GetComponent<SpriteRenderer>().enabled = true;
        gameObject.GetComponent<Collider2D>().enabled = true;
    }

    //Deactivate sprite and make non-collidable.
    public void DespawnPickUp()
    {
        gameObject.GetComponent<SpriteRenderer>().enabled = false;
        gameObject.GetComponent<Collider2D>().enabled = false;
    }



}
