/* Script to describe a projectile from player guns. Has info such as its 
 * damage and radius, its collision sound, and its sprite. Has methods for
 * setting up the bullets values, hurting the impacted player,
 * exploding and colliding
 * 
 * Author:Joshua Fredrickson
 */ 

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Bullet : MonoBehaviour {

    public int playerLayerMask;
    //collision layer mask used in Explode
    public float minPitch, maxPitch, rocketPushforce;
    //min and max pitch variance for the bullet, the rockets exploding push force
    public ParticleSystem particle, trail;
    //The particle system for collision and rocket trail

    private float damage;
    //damage of the bullet
    private float speed;
    //bullet speed
    private float damageRadius;
    //bullet damage radius
    private Rigidbody2D rb;
    //bullet rigidbody
    private Sprite bulletImage;
    //bullet sprite
    private AudioSource bulletAudio;
    //bullet audio
    private AudioClip collisionSound;
    //bullet collision sound
    private int sourcePlayer;
    //the source player for the bullet
    //Particle effect? Animation? 

    // Use this for initialization
    void Awake() {
        //Set up correct sprite, damage, and collision effect based on type
        rb = GetComponent<Rigidbody2D>();
        bulletAudio = GetComponent<AudioSource>();
        damage = 10f;
        speed = 15f;
        bulletAudio.pitch = Random.Range(minPitch, maxPitch);
        bulletAudio.clip = collisionSound;
    }

    /*
     * Collision method. On colliding with a player or a collidable surface, 
     * determine how to deal damage. If the bullet is a rocket (has a radius 
     * greater than zero) it explodes, otherwise it calls Hurt player with the
     * ollided game object
     */ 
    private void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.gameObject.CompareTag("Player") && sourcePlayer != collision.gameObject.GetComponent<PlayerController>().playerNum)
        {
            //Check all possible damageable players and Damage player through method(?)
            //play sound
            //play animation/particle effect

            DisableBullet();

            if (damageRadius > 0)
            {
                //rocket
                Explode();
            }
            else
            {
                HurtPlayer(collision.gameObject);
            }

            Destroy(gameObject,5f);
        }
        else if (collision.gameObject.CompareTag("Wall") || collision.gameObject.CompareTag("Hazard")) //or however many others there are
        {
            //Check radius for damage
            //play sound

            //play animation/particle effect
            //Destroy(gameObject);

            DisableBullet();

            if (damageRadius > 0)
            {
                //rocket
                Explode();
            }

            Destroy(gameObject, 5f);
        }

        
    }

    /*
     * Set up bullet values, used in player controller when the player fires and the bullet is instantiated
     */ 
    public void SendBulletValues(float volume,int player,float theDamage, float damageRad, AudioClip bulletImpactSound)
    {
        //bulletAudio.volume = volume;
        collisionSound = bulletImpactSound;
        sourcePlayer = player;
        damage = theDamage;
        damageRadius = damageRad;
    }

    //disables all bullet components and plays a single loop of the collision sound and
    //the particle system attached
    private void DisableBullet()
    {
        rb.velocity = Vector2.zero;
        bulletAudio.PlayOneShot(collisionSound);
        GetComponent<SpriteRenderer>().enabled = false;
        GetComponent<BoxCollider2D>().enabled = false;
        particle.Play();
    }

    /*
     * Method to handle a rocket explosion. Get all colliders in a radius and damage them if they are players.
     * also, push them away with a set force value
     */ 
    private void Explode()
    {
        trail.Stop();

        Collider2D[] hitColliders = Physics2D.OverlapCircleAll(transform.position, damageRadius, 1 << playerLayerMask);
        // 1 << playerLayerMask = bitshift to convert the player layer int value to a value overlapcircleall can use

        foreach (Collider2D item in hitColliders)
        {
            if (item.GetComponent<PlayerController>().playerNum != sourcePlayer)
            {
                HurtPlayer(item.gameObject);
                Vector2 direction = (item.transform.position - transform.position).normalized;
                item.gameObject.GetComponent<Rigidbody2D>().AddForce(direction * rocketPushforce, ForceMode2D.Impulse);
            }
        }

    }

    //decrement the player's health by a bullets amount
    private void HurtPlayer(GameObject playerHealth)
    {
        playerHealth.GetComponent<Health>().Decrement(damage, sourcePlayer);
    }

    public int SourcePlayer
    {
        set
        {
            sourcePlayer = value;
        }
    }

    public float Speed
    {
        get
        {
            return speed;
        }
    }

    public float Damage
    {
        set
        {
            damage = value;
        }
    }
}
