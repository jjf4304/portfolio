/* Script to describe a gun, including damage, fire force, bullet speed, etc. 
 * Also contains methods for switching to other weapons.
 * 
 * Author: Joshua Fredrickson
 */ 

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Gun : MonoBehaviour {

    public string gunType;
    //the type of gun (Pistol, assault, shotgun, rocket)
    public float fireForce;
    //the fire force applied to the player when they shoot
    public float damage;
    //the damage for the gun
    public float damageRadius;
    //the radius of the shot (only greater than one for the rocket)
    public float fireInterval;
    //how often the gun can fire
    public int numOfShots, gunNum; //0 is pistol, 1 is shotgun, 2 is asault, 3 is rocket
    //the number of shots per trigger pull, the gun ident num
    public int[] amountBullets;
    //array of bullets for multi shot guns
    public float gunBulletSpeed;
    //speed of projectiles
    public Sprite gunSprite;
    //the gun sprite
    public GameObject currentBullet, bullet, rocket;
    //current projectile object selected, the bullet prefab and the rocket prefab
    public Transform firePoint;
    //the gun fire point
    public AudioClip currentAudio, bulletsound, rocketSound, launcherSound, shotgunSound, pistolSound, assaultSound;
    //audio for current weapon, audio for a bullet, audio for a rocket, for a launcher, for a shotgun, for a pistol, and for an assualt rifle
    public AudioSource gunAudio;
    //gun audio source

    private void Start()
    {
        //amountBullets = new int[4];
        fireInterval = .5f;
        fireForce = 2f;
        gunBulletSpeed = 10f;
        gunAudio.pitch = Random.Range(.90f, 1.1f);
        currentAudio = bulletsound;
        currentBullet = bullet;
        gunAudio.clip = pistolSound;
        gunType = "Pistol";
        gunNum = 0;
        amountBullets[gunNum] = 9999;
        fireForce = 2f;
        damage = 10f;
        gunBulletSpeed = 15f;
        damageRadius = 0f;
        numOfShots = 1;
        fireInterval = .5f;
    }

    public float FireForce
    {
        get
        {
            return fireForce;
        }
    }

    public float FireInterval
    {
        get
        {
            return fireInterval;
        }
    }

    public float GunBulletSpeed
    {
        get
        {
            return gunBulletSpeed;
        }
    }

    //Method to switch to pistol, callded by player and sets the values as needed
    public void SwitchToPistol()
    {
        gunAudio.clip = pistolSound;
        gunType = "Pistol";
        gunNum = 0;
        amountBullets[gunNum] = 9999;
        currentAudio = bulletsound;
        fireForce = 1f;
        damage = 10f;
        gunBulletSpeed = 15f;
        damageRadius = 0f;
        numOfShots = 1;
        fireInterval = .5f;
        currentBullet = bullet;
    }

    //method to switch to shotgun
    public void SwitchToShotgun()
    {
        gunAudio.clip = shotgunSound;
        gunType = "Shotgun";
        gunNum = 1;
        fireForce = 2.5f;
        damage = 10f;
        gunBulletSpeed = 15f;
        currentAudio = bulletsound;
        damageRadius = 0f;
        numOfShots = 5;
        fireInterval = 1f;
        currentBullet = bullet;
    }

    //method to switch to assault
    public void SwitchToAssault()
    {
        gunAudio.clip = assaultSound;
        gunType = "Assault";
        gunNum = 2;
        fireForce = 1f;
        currentAudio = bulletsound;
        damage = 10f;
        gunBulletSpeed = 15f;
        damageRadius = 0f;
        numOfShots = 1;
        fireInterval = .2f;
        currentBullet = bullet;
    }

    //method to switch to rocket
    public void SwitchToRocket()
    {
        gunAudio.clip = launcherSound;
        gunType = "Rocket";
        gunNum = 3;
        currentAudio = rocketSound;
        fireForce = 5f;
        damage = 30f;
        gunBulletSpeed = 15f;
        damageRadius = 4f;
        numOfShots = 1;
        fireInterval = 2f;
        currentBullet = rocket;
    }
}
