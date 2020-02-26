/* Script for detailing enemy health
 * 
 * Has data members for a health amount, an animator, and an audio
 * 
 * Contains methods to handle damaging the enemy and killing the enemy.
 */ 


using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnemyHealth : MonoBehaviour {

    public float health; //amount of health
    public Animator enemyAnim; //enemy animator
    public AudioSource audio; //enemy audio source

	// Use this for initialization
	void Start () {
        enemyAnim = GetComponent<Animator>();
        audio = GetComponent<AudioSource>();
    }

    //Method to Decrement Health of enemy, called in Shooting
    public void DecrementHealth(float damage)
    {
        Debug.Log("IN HEALTH");
        health -= damage;

        if(health <= 0f)
        {
            StartCoroutine("Death");
        }
    }

    //Coroutine to handle enemy death. Sets animator, plays audio, and tells the game controller
    //an enemy has died
    IEnumerator Death()
    {
        enemyAnim.SetTrigger("Death");
        audio.Play();
        GetComponent<EnemyController>().attacking = true;
        yield return new WaitForSeconds(1.5f);
        FindObjectOfType<GameController>().KilledEnemy();
        Destroy(this.gameObject);
    }
}
