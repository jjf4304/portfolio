/* Flamethrower hazard script. Over an interval, activates a "fire" particle
 * system and spawns a collider, pushing and harming players as if they are 
 * in a flamethrower
 * 
 * Author: Joshua Fredrickson
 */ 

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FireTrap : MonoBehaviour {

    public float forceFromFire, damagePerSecond,
        intervalBetweenBursts, durationOfBursts, randomIntervalIncreaseMax,
        timer, timeBetweenDamage;
    //force applied to player, damage per second in the fire, interval between 
    //bursts, duration of the bursts, random interval increase to the duration
    //(To give some variance), a count up timer and a interval between damage
    public bool firing;
    //if the trapo is firing
    private bool start;
    //if the trap is activated
    public ParticleSystem fireSource;
    //fire particles
    public BoxCollider2D boxCollider;
    //trap fire collider
    public AudioSource trapAudio;
    //trap audio

	// Use this for initialization
	void Start () {
        firing = false;
        timer = 0f;
        fireSource = GetComponentInChildren<ParticleSystem>();
        fireSource.Stop();
        boxCollider.enabled = false;
        trapAudio = GetComponent<AudioSource>();
        trapAudio.loop = true;
        trapAudio.Stop();
        
        trapAudio.pitch = Random.Range(.90f, 1.1f);
        intervalBetweenBursts += Random.Range(0, randomIntervalIncreaseMax);
	}
	
	// Update is called once per frame, fire the flamethrower after an
    //interval using a Coroutine
	void Update () {
        if (start)
        {
            timer += Time.deltaTime;
            if (timer >= intervalBetweenBursts && !firing)
            {
                StartCoroutine("ShootFire");
            }
        }
	}

    /*
     * Coroutine to fire the trap. Starts the fire particles and audio
     * and enables the box collider before waiting for a duration, then
     * turning all of those values off again.
     */ 
    IEnumerator ShootFire()
    {
        firing = true;
        fireSource.Play();
        boxCollider.enabled = true;
        trapAudio.Play();
        yield return new WaitForSeconds(durationOfBursts);
        fireSource.Stop();
        trapAudio.Stop();
        timer = 0f;
        boxCollider.enabled = false;
        firing = false;
    }

    //activate traps
    public void InitiateTraps()
    {
        //called in game manager after starting countdown begins
        start = true;
    }

    //deactivate traps
    public void DeactivateTraps()
    {
        start = false;
        timer = 0f;
    }

    /*
     * Collision methods to damage and push player while they are inside the
     * fire area
     */ 

    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.gameObject.CompareTag("Player"))
        {
            collision.gameObject.GetComponent<Health>().Decrement(damagePerSecond, 5);
        }
    }

    private void OnTriggerStay2D(Collider2D collision)
    {
        if (collision.gameObject.CompareTag("Player"))
        {
            collision.GetComponent<PlayerController>().TimerInHazard += Time.deltaTime;

            collision.GetComponent<Rigidbody2D>().AddForce(
                (transform.position - collision.transform.position).normalized * forceFromFire);

            if(collision.GetComponent<PlayerController>().TimerInHazard >= timeBetweenDamage)
            {
                collision.GetComponent<PlayerController>().TimerInHazard = 0f;
                collision.gameObject.GetComponent<Health>().Decrement(damagePerSecond, 5);
            }
        }
    }

    private void OnTriggerExit2D(Collider2D collision)
    {
        if (collision.gameObject.CompareTag("Player"))
        {
            collision.GetComponent<PlayerController>().TimerInHazard = 0f;
        }
    }
}
