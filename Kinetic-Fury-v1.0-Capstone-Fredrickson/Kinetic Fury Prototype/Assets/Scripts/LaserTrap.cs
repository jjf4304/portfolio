/* Script to control the lazer hazards. Sets the direction and thenm, at 
 * some interval, fires the lazer, and sets up the line renderer based on
 * how far the laser needs to fire. Damages player when they are in the area 
 * of the laser when its firing, and plays all effects needed for the laser.
 * 
 * Author: Joshua Fredrickson
 */ 

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LaserTrap : MonoBehaviour {

    //enum for the direction the laser needs to fire
    public enum Direction
    {
        Up,
        Down,
        Left,
        Right
    }

    public float forceFromFire, damagePerSecond,
        intervalBetweenBursts, durationOfBursts, randomIntervalIncreaseMax,
        timer, timeBetweenDamage;
    //fire force, damage per second, interval between shots, how long the shots last,
    //random increase to the interval (to add some variance between all lasers), 
    //count up timer, time between dealing damage to player

    public BoxCollider2D boxCollider;
    //laser collider
    public LineRenderer laserLine;
    //Laser line renderer
    public ParticleSystem firingParticles;
    //firing particle effects
    public Direction firingDirection;
    //firing direction enum
    public Transform firingPoint;
    //the firing point for the laser
    public AudioSource trapAudio;
    //hazard audio

    private bool start, firing;
    //bools for if the trap is active and if it is firing
    private Ray2D laserRay = new Ray2D();
    //the ray used in laser firing
    private RaycastHit2D laserHit;
    //the raycast hit used by laser to determine how long the
    //laser is
    private int laserLayer;
    //the layer for things the laser ray hits when raycasting

	// Use this for initialization
	void Start () {
        firing = false;
        timer = 0f;
        boxCollider.enabled = false;
        //start = false;
        laserLayer = LayerMask.GetMask("Walls");
        firingParticles.Stop();
        trapAudio = GetComponent<AudioSource>();
        trapAudio.loop = true;
        trapAudio.Stop();

        trapAudio.pitch = Random.Range(.90f, 1.1f);

        intervalBetweenBursts += Random.Range(0, randomIntervalIncreaseMax);
    }
	
	// Update is called once per frame, if timer is greater than interval, fire the laser
	void Update () {
        if (start)
        {
            timer += Time.deltaTime;

            if (timer >= intervalBetweenBursts && !firing)
            {

                StartCoroutine("ShootLaser");
            }
        }
    }

    /*
     * Coroutine for laser firing.Plays audio and particle effects, sets the 
     * line renderer positions and fires the ray to determine how long the laser
     * sprite should be. Enables the collider. Waits for a duration, then turns 
     * all of those things off.
     */ 
    IEnumerator ShootLaser()
    {
        firing = true;
        firingParticles.Play();
        trapAudio.Play();
        laserLine.enabled = true;
        laserLine.SetPosition(0, firingPoint.transform.position);
        laserRay.origin = firingPoint.transform.position;

        switch (firingDirection)
        {
            case Direction.Up:
                laserRay.direction = Vector2.up;
                break;

            case Direction.Down:
                laserRay.direction = Vector2.down;
                break;

            case Direction.Left:
                laserRay.direction = Vector2.left;
                break;

            case Direction.Right:
                laserRay.direction = Vector2.right;
                break;
        }

        laserHit = Physics2D.Raycast(laserRay.origin, laserRay.direction, 300f, laserLayer);
        laserLine.SetPosition(1, laserHit.point);

        boxCollider.enabled = true;

        yield return new WaitForSeconds(durationOfBursts);
        firingParticles.Stop();
        trapAudio.Stop();
        laserLine.enabled = false;
        boxCollider.enabled = false;
        firing = false;
        timer = 0f;
    }

    //starts trap
    public void InitiateTraps()
    {
        //called in game manager after starting countdown begins
        start = true;
    }

    //deactivates traps
    public void DeactivateTraps()
    {
        start = false;
        timer = 0f;
    }

    /*
     * The following handle collisions, doing damage to the playersand while the player stays
     * in the area, pushes them and damages them over time
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
            switch (firingDirection)
            {
                case Direction.Up:
                    collision.GetComponent<Rigidbody2D>().AddForce(Vector2.up * forceFromFire);
                    break;

                case Direction.Down:
                    collision.GetComponent<Rigidbody2D>().AddForce(Vector2.down * forceFromFire);
                    break;

                case Direction.Left:
                    collision.GetComponent<Rigidbody2D>().AddForce(Vector2.left * forceFromFire);
                    break;

                case Direction.Right:
                    collision.GetComponent<Rigidbody2D>().AddForce(Vector2.right * forceFromFire);
                    break;
            }

            collision.GetComponent<PlayerController>().TimerInHazard += Time.deltaTime;
            if (collision.GetComponent<PlayerController>().TimerInHazard >= timeBetweenDamage)
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
