/* This Script describes and holds information for a weapon pickup object in the game
 * It handles respawning, collisions, and what effects they have on players when the 
 * player picks up that weapon.
 * 
 * Author: Joshua Fredrickson
 */ 

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class WeaponPickup : MonoBehaviour {

    public int ammoAmount, weaponType; //1 for shotgun, 2 for assault, 3 for rocket
    // how much ammo to give on pickup, what type of weapon it is
    public float timeBetweenRespawn;
    // the time between respawns for the pickup
    public SpriteRenderer weaponSprite;
    //reference to the pickup's sprite
    public BoxCollider2D boxCollider;
    //reference to the pickup's collider

    private bool collected;
    //bool for if the pickup has been collected
    private float timer;
    //float timer for counting time between respawns

	// Use this for initialization
    //Just gets the references for sprite and collider
	void Start () {
        weaponSprite = GetComponent<SpriteRenderer>();
        boxCollider = GetComponent<BoxCollider2D>();
	}
	
	// Update is called once per frame
    /*
     * If the weapon is collected, add to the timer by deltaTime. If timer is 
     * then greater than the time between respawns, respawn the pickup by
     * re-enabling the sprite and collider
     */ 
	void Update () {
        if (collected)
        {
            timer += Time.deltaTime;
            if(timer >= timeBetweenRespawn)
            {
                collected = false;
                timer = 0f;
                weaponSprite.enabled = true;
                boxCollider.enabled = true;
            }
        }
	}

    /*
     * The OnTriggerEnter function that, if a player collides with this pickup,
     * turns off the sprite renderer and collider, then gives the player the ammount
     * of ammo the pickup up holds to the weapon type of the pickup. Sets collected to 
     * true
     */ 
    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.gameObject.CompareTag("Player"))
        {
            collected = true;
            weaponSprite.enabled = false;
            boxCollider.enabled = false;
        
            collision.GetComponent<Gun>().amountBullets[weaponType] += ammoAmount;
        }
    }
}
