/* Thescript controlling player input. Controls player shooting, boosting
 * using powers, death and respawning, switching weapons, etc. 
 * 
 * Handles control timers, plays sounds as needed, fires weapons based
 * on equipped weapon, and has references to many components needed.
 * 
 * Author: Joshua Fredrickson
 */ 

using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PlayerController : MonoBehaviour {

    //Enum for player types
    public enum PlayerType
    {
        Jimmy,
        Data, 
        Cynthia
    }

    //Set up playerNum and playerString from game controller 
    public int playerNum, numLives;
    // which player is this, how many lives they havee
    public string playerString;
    //E.G. p1. Used for input handling
    public float intervalForBoosts, intervalForPowers, intervalEMP, intervalTied, intervalForDamageBoost;
    //interval btw boosts, powers, how long you are emp'd or tied, and how long you have a damage boost
    [HideInInspector]
    public float timerBetweenBoosts, timerBetweenShots, timerBetweenPower, timerBetweenEMP, timerBetweenTied, timerInHazard, timerInDamageBoost;
    //group of timers used for boost, shooting, power, emp, tied, in hazard, and how long you have for a damage pickup
    public bool isSwinging, alive, damageBoost;
    //bools for if the player is swinging, alive, or has an active damage boost
    public GameObject dataEMPPrefab, cynthiaAttackPrefab;
    //prefabs used for emp and hair tangle attacks
    public PlayerType playerType;
    //Enum for the player's character type
    public ParticleSystem jimmyParticles, dmgBoostParticles;
    //the two particle systems needed, one for jimmy's power and the other for when you have a damage boost
    public SpriteRenderer playerSprite, playerNumSprite, playerArmSprite;
    //the player sprite, the player number sprite, and the player gun arm sprite
    public Sprite[] weaponSprites;
    //array of weapon sprites based on the player type

    public AudioSource characteAudio;
    //character audio source
    public AudioClip painSound, deathSound;
    //audio clips (not in game right now)

    public Image boostBarFill, powerBarFill;
    //the boost and power bars tied to this players UI panel
    public Text weaponText, ammoText, livesText;
    //the equipped weapon, ammo and lives left texts tied to this playerrs UI panel


    private Rigidbody2D rb;

    private Gun equippedWeapon;
    //equipped gun script
    private bool beenEMPd, beenTied;

    private Color startColor, damageBoostColor;
    //colors for tinting player when they have damage boost 

    private GameController controller;
    //in scene GameController
    private LevelManager levelManager;
    //in scene LevelManager


    //Finds/Initializes components and objects and sets starting values
    private void Start()
    {
        controller = FindObjectOfType<GameController>();
        levelManager = FindObjectOfType<LevelManager>();

        powerBarFill.fillAmount = 0f;

        rb = GetComponent<Rigidbody2D>();
        equippedWeapon = GetComponent<Gun>();
        //equippedWeapon.SwitchToPistol();
        equippedWeapon.amountBullets = new int[4];
        weaponText.text = "Pistol";
        ammoText.text = equippedWeapon.amountBullets[equippedWeapon.gunNum].ToString();
        timerBetweenShots = equippedWeapon.FireInterval;
        timerBetweenBoosts = intervalForBoosts;
        timerBetweenPower = 0f;
        timerBetweenEMP = 0f;
        timerBetweenTied = 0f;
        beenEMPd = false;
        beenTied = false;
        isSwinging = false;
        alive = true;
        //TEMP

        startColor = GetComponent<SpriteRenderer>().color;
        damageBoostColor = new Color(255f, 0f, 0f);

        foreach(AudioSource item in FindObjectsOfType<AudioSource>())
        {
            item.volume = controller.audioVolume;
            if(item.volume > 25f)
            {
                item.volume = 25f;
            }
        }
    }

    //Increments timers as needed, sets bar fills and sets texts as needed.
    //Handles start btton pause input
    private void Update()
    {
        if (alive && !levelManager.paused)
        {
            if (timerBetweenBoosts < intervalForBoosts)
                timerBetweenBoosts += Time.deltaTime;
            if (timerBetweenPower < intervalForPowers)
                timerBetweenPower += Time.deltaTime;

            if (damageBoost)
            {
                GetComponent<SpriteRenderer>().color = damageBoostColor;
                timerInDamageBoost += Time.deltaTime;
                if(timerInDamageBoost >= intervalForDamageBoost)
                {
                    dmgBoostParticles.Stop();
                    damageBoost = false;
                    timerInDamageBoost = 0f;
                    GetComponent<SpriteRenderer>().color = startColor;
                }
            }
                


            timerBetweenShots += Time.deltaTime;

            boostBarFill.fillAmount = timerBetweenBoosts / intervalForBoosts;
            powerBarFill.fillAmount = timerBetweenPower / intervalForPowers;
            livesText.text = numLives.ToString();
            ammoText.text = equippedWeapon.amountBullets[equippedWeapon.gunNum].ToString();
        }

        if (Input.GetButtonDown("Start" + playerString))
        {
            levelManager.Pause();
        }


    }

    // Update is called once per frame
    /*
     * Handles all controller input. As long as the player is alive and the
     * game isnt paused, processes input. If Empd or tied, increments the timer
     * for the repsective effect, and if the timer is larger than the interval, removes the 
     * effect. otherwise handles direction from the joystick and handles boost, 
     * fire, switch weapon and power input.
     */ 
    void FixedUpdate () {

        if (alive && !levelManager.paused)
        {
            if (beenEMPd)
            {
                if (beenEMPd)
                {
                    timerBetweenEMP += Time.deltaTime;
                    if (timerBetweenEMP >= intervalEMP)
                    {
                        timerBetweenEMP = 0f;
                        beenEMPd = false;
                    }
                }
            }
            else
            {
                float horizontal = Input.GetAxis("Horizontal" + playerString), vertical = Input.GetAxis("Vertical" + playerString);

                //Controller Input
                Vector2 aimDirection = new Vector2(horizontal, vertical);
                /* MOUSE INPUT
                Vector2 targetDir = Input.mousePosition;
                Vector2 playerPos = transform.position;

                Vector2 mousePos = Camera.main.ScreenToWorldPoint(new Vector3(targetDir.x, targetDir.y));
                Vector2 aimDirection = mousePos - playerPos;
                */

                if (beenTied)
                {
                    timerBetweenTied += Time.deltaTime;
                    if (timerBetweenTied >= intervalTied)
                    {
                        timerBetweenTied = 0f;
                        beenTied = false;
                        GetComponent<rope>().ResetRope();
                    }
                }

                //Boost input
                if (Input.GetButtonDown("Boost" + playerString) && timerBetweenBoosts >= intervalForBoosts)
                {
                    Boost(aimDirection);
                }

                //Fire input
                if (Input.GetButton("Fire1" + playerString) && timerBetweenShots >= equippedWeapon.FireInterval)
                {
                    
                    if (equippedWeapon.amountBullets[equippedWeapon.gunNum] > 0)
                    {
                        equippedWeapon.gunAudio.Play();
                        Shoot(aimDirection);
                        equippedWeapon.amountBullets[equippedWeapon.gunNum]--;
                        ammoText.text = equippedWeapon.amountBullets[equippedWeapon.gunNum].ToString();
                    }
                }

                //power input
                if (Input.GetButtonDown("Power" + playerString) && timerBetweenPower >= intervalForPowers)
                {
                    PowerCheck(aimDirection);
                }
                //swtich weapon input
                if (Input.GetButtonDown("SwitchWeapon" + playerString))
                {   
                    equippedWeapon.gunNum++;
                    if (equippedWeapon.gunNum >= 4)
                        equippedWeapon.gunNum = 0;
                    switch (equippedWeapon.gunNum)
                    {
                        case 0:
                            equippedWeapon.SwitchToPistol();
                            playerArmSprite.sprite = weaponSprites[0];
                            break;
                        case 1:
                            equippedWeapon.SwitchToShotgun();
                            playerArmSprite.sprite = weaponSprites[1];
                            break;
                        case 2:
                            equippedWeapon.SwitchToAssault();
                            playerArmSprite.sprite = weaponSprites[2];
                            break;
                        case 3:
                            equippedWeapon.SwitchToRocket();
                            playerArmSprite.sprite = weaponSprites[3];
                            break;
                    }

                    weaponText.text = equippedWeapon.gunType;
                    ammoText.text = equippedWeapon.amountBullets[equippedWeapon.gunNum].ToString();

                }

            }
        }  
    }

    /*
     * Method to handle boosting, applying force in a direction being aimed at
     */ 
    void Boost(Vector2 aimDirection)
    {
        timerBetweenBoosts = 0f;
        rb.velocity = rb.velocity*.9f;
        rb.AddForce((aimDirection).normalized * 5, ForceMode2D.Impulse);
    }


    /*
     * Fires the gun. Based on which type of gun, instantiates the needed amount of bullets,
     * applies the needed forces and rotation, and sets up the bullet information as needed
     */ 
    void Shoot(Vector2 aimDirection)
    {
        timerBetweenShots = 0f;
        
        if(equippedWeapon.numOfShots <= 1)
        {
            GameObject bullet = Instantiate(equippedWeapon.currentBullet, equippedWeapon.firePoint.position, equippedWeapon.firePoint.transform.rotation);
            bullet.GetComponent<Bullet>().SendBulletValues(controller.audioVolume, playerNum, equippedWeapon.damage, equippedWeapon.damageRadius, equippedWeapon.currentAudio);

            if (aimDirection.magnitude == 0)
            {
                bullet.GetComponent<Rigidbody2D>().velocity = Vector2.up * equippedWeapon.GunBulletSpeed;
                bullet.transform.Rotate(0, 0, Random.Range(-10, 10));
                rb.AddForce(Vector2.down * equippedWeapon.FireForce, ForceMode2D.Impulse);
            }
            else
            {
                bullet.GetComponent<Rigidbody2D>().velocity = aimDirection.normalized * equippedWeapon.GunBulletSpeed;
                bullet.transform.Rotate(0, 0, Random.Range(-10, 10));
                rb.AddForce(-(aimDirection).normalized * equippedWeapon.FireForce, ForceMode2D.Impulse);
            }

            if (damageBoost)
                bullet.GetComponent<Bullet>().Damage = equippedWeapon.damage * 2;
        }
        else
        {
            for (int i = 0; i < equippedWeapon.numOfShots; i++)
            {
                GameObject bullet = Instantiate(equippedWeapon.currentBullet, equippedWeapon.firePoint.position, equippedWeapon.firePoint.transform.rotation);
                bullet.GetComponent<Bullet>().SendBulletValues(controller.audioVolume, playerNum, equippedWeapon.damage, equippedWeapon.damageRadius, equippedWeapon.currentAudio);
                bullet.transform.Rotate(0, 0, Random.Range(-20, 20));
                bullet.GetComponent<Rigidbody2D>().velocity = bullet.transform.right * equippedWeapon.GunBulletSpeed;
                if(damageBoost)
                    bullet.GetComponent<Bullet>().Damage = equippedWeapon.damage * 1.5f;
            }
            rb.AddForce(-(aimDirection).normalized * equippedWeapon.FireForce, ForceMode2D.Impulse);
        }
    }

    /*
     * Method to hanle player death. Decrements lives, resets the lives text
     * and starts the death coroutine
     */ 
    public void Die()
    {
        numLives--;
        livesText.text = numLives.ToString();
        StartCoroutine("Death");
    }

    /*
     * Death Coroutine, effectively despawning players and, if they still have
     * lives, respawns them after an amount of time.
     * 
     * Disables colliders and sprites, sets alive bools to false, and communicates
     * with level manager if needed (if player has no lives left)
     */ 
    IEnumerator Death()
    {
        GetComponent<BoxCollider2D>().enabled = false;
        SpriteRenderer[] sprites = GetComponentsInChildren<SpriteRenderer>();

        foreach (var item in sprites)
        {
            item.enabled = false;
        }

        GetComponent<SpriteRenderer>().enabled = false;
        alive = false;
        if(numLives > 0)
        {
            yield return new WaitForSeconds(5f);
            Respawn();
        }
        else
        {
            levelManager.playerPanels[playerNum - 1].skullImage.enabled= true;
            yield return new WaitForSeconds(.5f);
            levelManager.IncrementDeadPlayers();
            Destroy(this.gameObject, .5f);
        }

    }

    /*
     * Function to respawn player at their spawn location. Reenables all the needed
     * components and timers and bools
     */ 
    public void Respawn()
    {
        //RESPAWN PLAYER AT gamemanager.respawnPoints[i] where i is based on player number.

        //Reenable collider, movement, and sprite?

        GetComponent<BoxCollider2D>().enabled = true;
        GetComponent<SpriteRenderer>().enabled = true;

        SpriteRenderer[] sprites = GetComponentsInChildren<SpriteRenderer>();

        foreach (var item in sprites)
        {
            item.enabled = true;
        }

        alive = true;
        transform.position = levelManager.spawnLocations[playerNum - 1].position;
        GetComponent<Health>().healthCurrent = GetComponent<Health>().healthTotal;
        //iframes?
        //ammo count?
        for (int i = 1; i < equippedWeapon.amountBullets.Length; i++)
        {
            equippedWeapon.amountBullets[i] = 0;
        }
        timerBetweenBoosts = intervalForBoosts;
        timerBetweenPower = 0f;
   
    }

    /*
     * Function to check, after power input, which type of power to use and then 
     * calls the appropriate method. Resets count up timer for the power
     */ 
    void PowerCheck(Vector2 aimDirection)
    {
        timerBetweenPower = 0f;
        switch (playerType)
        {
            case PlayerType.Jimmy:
                JimmyPower();
                break;
            case PlayerType.Data:
                DataPower(aimDirection);
                break;
            case PlayerType.Cynthia:
                CynthiaPower(aimDirection);
                break;
        }
    }

    /*
     * Jimmy's power. Starts a circle collider around the player, rebounding 
     * projectiles and enemy players directly away from the controlling 
     * player. Also plays the needed particles.
     */ 
    private void JimmyPower()
    {
        //creates a circle around the player which contains all colliders inside it
        Collider2D[] hitColliders = Physics2D.OverlapCircleAll(transform.position, 5f);
        //plays the sound wave particle effect
        jimmyParticles.Play();
        foreach (Collider2D item in hitColliders)
        {
            if(item.CompareTag("Player") && item.gameObject != this.gameObject)
            {
                Vector2 between = (item.transform.position - transform.position).normalized;
                item.gameObject.GetComponent<Rigidbody2D>().velocity = between * 5f;
            }
            else if (item.CompareTag("Bullet"))
            {
                Vector2 between = (item.transform.position - transform.position).normalized;
                item.gameObject.GetComponent<Rigidbody2D>().velocity = between * 10f;
            }
            else if (item.CompareTag("Power"))
            {
                Vector2 between = (item.transform.position - transform.position).normalized;
                item.gameObject.GetComponent<Rigidbody2D>().velocity = between * 5f;
            }
            
        }
    }

    /*
     * Data's power, spawns the emp projectile and shoots it along the 
     * players aim direction
     */ 
    private void DataPower(Vector2 aimDirection)
    {
        GameObject emp = Instantiate(dataEMPPrefab, equippedWeapon.firePoint.position, Quaternion.identity);
        emp.GetComponent<Rigidbody2D>().velocity = aimDirection.normalized * 5f;
        emp.GetComponent<EMPBall>().sourcePlayer = playerNum;
    }

    /*
    * Cynthia's power, spawns the hair projectile and shoots it along the 
    * players aim direction
    */
    private void CynthiaPower(Vector2 aimDirection)
    {
        GameObject hair = Instantiate(cynthiaAttackPrefab, equippedWeapon.firePoint.position, Quaternion.identity);
        hair.GetComponent<Rigidbody2D>().velocity = aimDirection.normalized * 5f;
        hair.GetComponent<HairAttack>().sourcePlayer = playerNum;
    }


    //Return if the player is able to use their grappling hook (used in rope)
    public bool CanHook()
    {
        bool canSwing;
        /*
        if(beenEMPd || beenTied)
        {
            canSwing = false;
        }
        else
        {
            canSwing = true;
        }
        */
        return (beenEMPd || beenTied);
    }

    //Accessor and Mutators for a few data members
    public bool BeenEMPd
    {
        get
        {
            return beenEMPd;
        }
        set
        {
            beenEMPd = value;
        }
    }

    public bool BeenTied
    {
        get
        {
            return beenTied;
        }
        set
        {
            beenTied = value;
        }
    }

    public float TimerInHazard
    {
        get
        {
            return timerInHazard;
        }
        set
        {
            timerInHazard = value;
        }
    }

}
