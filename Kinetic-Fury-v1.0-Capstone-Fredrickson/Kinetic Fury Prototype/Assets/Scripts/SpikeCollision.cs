/* A method to describe a spike or electic coil hazard and what happens when
 * a player collides with one. Holds information for a particle system, a sound 
 * effect and how much damage contact makes with the hazard.
 * 
 * Author: Joshua Fredrickson
 */ 

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SpikeCollision : MonoBehaviour {

    public float damage; 
    //the amount of damage done on contact
    public AudioClip damageClip;
    //the damage sound effect
    public AudioSource hazardSoundSource;
    //damage sound source
    public ParticleSystem particle;
    //damage particle system for contact

    //Initializes the sound source and stops playing it
    //in case the sound is set to play on awake.
    private void Start()
    {
        hazardSoundSource = GetComponent<AudioSource>();
        hazardSoundSource.Stop();
    }

    /*
     * The OnTriggerEnter function. If a player collides with the hazard,
     * it damages the player by a set amount, plays a sound if there is one, and 
     * then plays the particle system if there is one.
     */ 
    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.gameObject.CompareTag("Player"))
        {
            collision.gameObject.GetComponent<Health>().Decrement(damage, 5);
            if(damageClip != null && hazardSoundSource != null)
            {
                hazardSoundSource.PlayOneShot(damageClip);
            }
            //Play damage sound? Show damage?
            if (particle != null)
                particle.Play();

        }
    }

}
