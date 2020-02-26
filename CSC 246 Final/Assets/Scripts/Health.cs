/* Script for player health. Has methods to hurt players and
 * check if they are dead
 * 
 * 
 */ 

using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Health : MonoBehaviour {

    public Text healthText; //health ui text

    public float maxHealth, currentHealth; //max and current health


	// Use this for initialization
	void Start () {
        currentHealth = maxHealth;
        SetHealthText();
	}
	
	// Update is called once per frame
	void Update () {
		
	}


    //Hurt player by some amount of damage, if they are dead
    //call death method from game controller
    public void DecrementHealth(float damage)
    {
        currentHealth -= damage;
        SetHealthText();
        if(currentHealth <= 0f)
        {
            FindObjectOfType<GameController>().PlayerDead();
            gameObject.SetActive(false);
        }
    }

    //Set health ui text
    public void SetHealthText()
    {
        healthText.text = "Health: " + currentHealth;
    }
}
