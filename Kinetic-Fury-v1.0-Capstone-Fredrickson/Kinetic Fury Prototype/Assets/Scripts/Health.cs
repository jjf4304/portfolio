/* Script for handling player health. Has data members for how much
 * health each player has, the current and max amount of health, and 
 * references the healthbar fill image. Has mehtods for handling adding
 * and taking away health and if the health is less than 0, kills the player
 * 
 * Author: Joshua Fredrickson
 */ 

using System.Collections;
using System.Collections.Generic;
using UnityEngine.UI;
using UnityEngine;

public class Health : MonoBehaviour {

    public float healthTotal;
    //health total
    public float healthCurrent;
    //current health amount
    public Image healthBarFill;
    //health bar fill image
    public ParticleSystem hitEffect;

    public PlayerController player;
    //the attached player

	// Use this for initialization
	void Start () {
        player = GetComponent<PlayerController>();
        healthCurrent = healthTotal;
	}
	
	// Update is called once per frame
	void Update () {
        healthBarFill.fillAmount = healthCurrent / healthTotal;
        //sets the player health bar fill based on the current health
	}

    //Add health to the total, if its above the max set current to max
    public void Increment(float heal)
    {
        healthCurrent += heal;
        if (healthCurrent >= healthTotal)
            healthCurrent = healthTotal;
    }

    /*
     * Hndle hurting player, subtracts a damage amount from the health amount
     * and if the health is less than zero, calls the die method in player
     */ 
    public void Decrement(float damage, int damageSource)
    {
        healthCurrent -= damage;
        
        if(healthCurrent <= 0)
        {
            healthCurrent = 0;
            player.Die();
            //check who killed player and call gamemanager methods to add to their kill tally or decrement this players lives
            //Start Death stuff, maybe call a method to handle it all
        }
        else
        {
            //temp disabled until sounds impleemnted
            //player.characteAudio.Stop();
            //player.characteAudio.PlayOneShot(player.painSound);
        }
        
    }
}
