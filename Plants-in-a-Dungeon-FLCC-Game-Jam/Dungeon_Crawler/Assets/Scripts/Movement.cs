using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Movement : MonoBehaviour {
    private Rigidbody2D rb2d;
    public float speed;
    //public float dy = 0;  //change in  m/sec
   // public float dx = 0;
    public Collider2D meleeSwing;
    public GameObject enemy;
    public float duration = 10;
    private float timeCount;
    public float forceAmount;
    public GameObject playerProjectile;
    public GameObject firepoint;
    public Inventory inventory;
    public float projectileSpeed;

    public float timer;
    public float timeBetweenShots;

    public string playerName;



    // Use this for initialization
    void Start () {
       rb2d = GetComponent<Rigidbody2D>();
        inventory = GetComponent<Inventory>();
    }

    void FixedUpdate()
    {
        //Store the current horizontal input in the float moveHorizontal.
        float moveHorizontal = Input.GetAxis("Horizontal"+playerName);
      

        //Store the current vertical input in the float moveVertical.
        float moveVertical = Input.GetAxis("Vertical"+playerName) *-1;

        //Use the two store floats to create a new Vector2 variable movement.
        Vector3 movement = new Vector3(moveHorizontal, moveVertical, 0);
       //transform.Translate(movement*speed);
         //rb2d.AddForce(movement * speed);
        rb2d.velocity = new Vector2(moveHorizontal, moveVertical) * 10;

        meleeAttack();
        rangeAttack();
    }
    public void rangeAttack()
    {
        if (Input.GetButtonDown("Fire2"+playerName) && timer >= timeBetweenShots)
        {
            timer = 0;
            GameObject arrow;
            if (playerProjectile.tag == "Fire Arrow" && inventory.NumFireArrows > 0)
            {
                arrow = Instantiate(playerProjectile, firepoint.transform.position, transform.rotation);
                arrow.tag = "Fire Arrow";
                inventory.NumFireArrows = inventory.NumFireArrows - 1;
            }
            else if (playerProjectile.tag == "Ice Arrow" && inventory.NumIceArrows > 0)
            {
                arrow = Instantiate(playerProjectile, firepoint.transform.position, transform.rotation);
                arrow.tag = "Ice Arrow";
                inventory.NumIceArrows = inventory.NumIceArrows - 1;
            }
            else
            {
                arrow = Instantiate(playerProjectile, firepoint.transform.position, (transform.rotation));
                arrow.tag = "Arrow"; 
            }
           
            //arrow.GetComponent<Rigidbody2D>().AddForce(transform.right * projectileSpeed);
            arrow.GetComponent<Rigidbody2D>().velocity = transform.right.normalized * projectileSpeed;
        }
        

    }

        public void meleeAttack()
    {
        if (Input.GetButtonDown("Fire1"+playerName))
        {
            //Debug.Log("You hit the button");
            if (meleeSwing.bounds.Contains(enemy.transform.position))
            {


                //enemy.GetComponent<CombatLogic>().hitLogic(duration, timeCount, forceAmount);
                enemy.GetComponent<CombatLogic>().setHealth(enemy.GetComponent<CombatLogic>().health - 1);
            }
        }
    }
    public void changeArrow(string tag)
    {
        playerProjectile.tag = tag;
    }

        // Update is called once per frame
    void Update () {/*
        Vector3 dir = Input.mousePosition - Camera.main.WorldToScreenPoint(transform.position);
        float angle = Mathf.Atan2(dir.y, dir.x) * Mathf.Rad2Deg;
        transform.rotation = Quaternion.AngleAxis(angle, Vector3.forward);*/

        Vector2 lookDirection = new Vector2(Input.GetAxisRaw("RightHoriz"+playerName), Input.GetAxisRaw("RightVert"+playerName));
        float angle = Mathf.Atan2(lookDirection.y, lookDirection.x) * Mathf.Rad2Deg;
        transform.rotation = Quaternion.AngleAxis(angle, Vector3.forward);

        timer += Time.deltaTime;

        Debug.Log("Current Arrow: " + playerProjectile.tag);

        if(Input.GetButtonDown("ChangeArrow" + playerName))
        {
            if(playerProjectile.tag == "Arrow")
            {
                playerProjectile.tag = "Fire Arrow";
            }
            else if(playerProjectile.tag == "Fire Arrow")
            {
                playerProjectile.tag = "Ice Arrow";
            }
            else if(playerProjectile.tag == "Ice Arrow")
            {
                playerProjectile.tag = "Arrow";
            }
        }
    }
    /*
    void OnTriggerEnter2D(Collider2D other)
    {
        if (Input.GetButtonDown("Fire1")) { 
        if (meleeSwing.bounds.Contains(enemy.transform.position))
        {
            /*
                timeCount += Time.deltaTime;

                if (timeCount < duration)
                {
                    Rigidbody2D enemyRigid = enemy.GetComponent <Rigidbody2D>();
                    Vector3 push = new Vector3(0, forceAmount, 0);
                    enemy.GetComponent<Rigidbody2D>().AddForce(push);
                }
                else
                {
                    timeCount = 0;
                }
            
            enemy.GetComponent<CombatLogic>().hitLogic(duration, timeCount, forceAmount);
            enemy.GetComponent<CombatLogic>().setHealth(enemy.GetComponent<CombatLogic>().health - 1);
        }
        }
    }
*/

    }

