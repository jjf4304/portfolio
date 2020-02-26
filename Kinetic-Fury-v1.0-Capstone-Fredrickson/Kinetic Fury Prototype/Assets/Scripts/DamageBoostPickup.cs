/* Script for a Damage boost pickup, increasing player damage for a short time
 * and starts the particle and colors to show that the player has a damage boost
 * 
 * Author: Joshua Fredrickson
 */ 

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DamageBoostPickup : MonoBehaviour {

    public float timeBetweenRespawn;
    //time betweenr respawn
    public SpriteRenderer boostSprite;
    //the sprite for the damage boost
    public BoxCollider2D boxCollider;
    //the collider for the boost

    private bool collected;
    //if the pickup is collected
    private float timer;
    //the timer

    // Use this for initialization
    void Start () {
        boostSprite = GetComponent<SpriteRenderer>();
        boxCollider = GetComponent<BoxCollider2D>();
    }
	
	// Update is called once per frame, if collected, respawn the pickup
    //after a time
	void Update () {
        if (collected)
        {
            timer += Time.deltaTime;
            if (timer >= timeBetweenRespawn)
            {
                collected = false;
                timer = 0f;
                boostSprite.enabled = true;
                boxCollider.enabled = true;
            }
        }
    }

    //on collision with a player, disable collider and sprite and start 
    //the damage boost particles in the player controller
    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.gameObject.CompareTag("Player"))
        {
            collected = true;
            boostSprite.enabled = false;
            boxCollider.enabled = false;

            collision.GetComponent<PlayerController>().damageBoost = true;
            collision.GetComponent<PlayerController>().dmgBoostParticles.Play();
        }
    }
}
