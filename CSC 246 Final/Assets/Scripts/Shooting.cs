/* A script to handle shooting input, shooting and bullet collision, and throwing grenades
 * It also handles some ui text values
 * 
 * 
 */ 

using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Shooting : MonoBehaviour {

    public float maxRange, timerBtwShots,gunDamage, timerBtwGrenade, grenadeForce,
        grenadeInterval, shootingInterval, maxAmmo, currentAmmo, grenadeCount;
    // the max range, time tracker for shots, gun damage, time tracker for grenades,
    //how hard grenades are thrown,  interval for grenades, interval between sots,
    //max ammo, current ammo, amount of grenades
    public LineRenderer line; //gun line
    public Light ptLight; // gun muzzle light
    public Transform gunPoint, grenadePoint; //gun firing point and grenade firing point
    public AudioSource gunAudio; //gun audio
    public Text ammoCounter, grenadeCounter; //ui texts
    public GameObject grenadePrefab; //grenade prefab

    //values for ray shooting
    private RaycastHit rayHit;
    private Ray shootingRay;

	// Use this for initialization
	void Start () {
        Cursor.lockState = CursorLockMode.Locked;
        SetAmmoText();
        SetGrenadeText();
	}

    private void Update()
    {
        timerBtwShots += Time.deltaTime;
        timerBtwGrenade += Time.deltaTime;
       
    }

    // Update is called once per frame
    void  FixedUpdate () {

        //Deactivate gun effects
        if (timerBtwShots >= shootingInterval / 2f)
            Deactivate();


        //handle gun input and grenade input
        if (Input.GetButton("Fire1") && timerBtwShots >= shootingInterval && currentAmmo > 0f)
        {
            ShootGun();
        }
        else if(Input.GetButtonUp("Fire1"))
        {
            gunAudio.Stop();
        }

        if(Input.GetButton("Fire2") && timerBtwGrenade >= grenadeInterval && grenadeCount > 0)
        {
            ThrowGrenade();
        }
	}

    //Deactivate gun effects
    private void Deactivate()
    {
        ptLight.enabled = false;
        line.enabled = false;
    }


    //method to fire the gun. Fires a ray and line straight forward from the firing point
    //if it collides with an enemy, damage that enemy
    private void ShootGun()
    {
        if (!gunAudio.isPlaying)
            gunAudio.Play();
        currentAmmo--;
        timerBtwShots = 0f;
        ptLight.enabled = true;
        line.enabled = true;
        line.SetPosition(0, gunPoint.position);

        if(Physics.Raycast(gunPoint.position, gunPoint.forward, out rayHit, maxRange))
        {
            line.SetPosition(1, rayHit.point);
            if (rayHit.collider.CompareTag("Enemy"))
            {
                Debug.Log(rayHit.distance);
                rayHit.collider.GetComponent<EnemyHealth>().DecrementHealth(gunDamage);
            }
        }

        SetAmmoText();
    }


    //Two methods to change ammo and grenade UI texts

    private void SetAmmoText()
    {
        ammoCounter.text = "Ammo: " + currentAmmo + " / " + maxAmmo;
    }

    private void SetGrenadeText()
    {
        grenadeCounter.text = "Grenades: " + grenadeCount;
    }


    //Method to throw grenade, spawning the prefab and launching it

    private void ThrowGrenade()
    {
        grenadeCount--;
        timerBtwGrenade = 0f;
        SetGrenadeText();

        GameObject grenade = Instantiate(grenadePrefab, grenadePoint.position, grenadePoint.rotation);
        grenade.GetComponent<Rigidbody>().AddForce(grenadePoint.forward.normalized * grenadeForce, ForceMode.Impulse);

        SetGrenadeText();
    }

    //Add ammo method for pickups to use.
    public void AddAmmo(float ammoVal, float grenadeVal)
    {
        currentAmmo += ammoVal;
        if (currentAmmo >= maxAmmo)
            currentAmmo = maxAmmo;
        grenadeCount += grenadeVal;
        SetAmmoText();
        SetGrenadeText();
    }
}
