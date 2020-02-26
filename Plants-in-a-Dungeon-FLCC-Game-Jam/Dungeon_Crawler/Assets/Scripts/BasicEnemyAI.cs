using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BasicEnemyAI : MonoBehaviour {

    public float speed;
    public GameObject projectile, firepoint;
    public float damagePerMeleeHit;
    public float health;
    public float range;
    public float projectileSpeed;
    public float fireRate;
    public bool ranged; //true if ranged enemy.

    //HealthBar Image, 

    private bool attackPlayer;
    private float timer;
    private GameObject player;
    private GameController controller;

	// Use this for initialization
	void Start () {
        controller = FindObjectOfType<GameController>();
        timer = 0;
	}
	
	// Update is called once per frame
	void Update () {

        timer += Time.deltaTime;

		if(health == 0)
        {
            controller.RemoveFromEnemyList(this.gameObject);
            Destroy(this.gameObject);
        }

        Vector2 playerOnePos = controller.player1.transform.position;

        if(controller.NumOfPlayers == 2)
        {
            Vector2 playerTwoPos = controller.player2.transform.position;

            if ((Mathf.Pow(playerOnePos.x - transform.position.x, 2) + Mathf.Pow(playerOnePos.y - transform.position.y, 2))
                <= (Mathf.Pow(playerTwoPos.x - transform.position.x, 2) + Mathf.Pow(playerTwoPos.y - transform.position.y, 2)))
                player = controller.player1;
            else
                player = controller.player2;
        }
        else
        {
            player = controller.player1;
        }

        //transform.LookAt(player.transform);
        Vector3 playerPos = player.transform.position;

        transform.right = playerPos - transform.position;
        

        if (!ranged)
        {
            transform.position = Vector3.MoveTowards(transform.position, player.transform.position, speed * Time.deltaTime);
            //GetComponent<Rigidbody2D>().velocity = (player.transform.position - transform.position).normalized * speed;
        }
        else
        {     

            if ((Mathf.Pow(playerPos.x - transform.position.x, 2) + Mathf.Pow(playerPos.y - transform.position.y, 2)) > Mathf.Pow(range, 2))
            {
                transform.position = Vector3.MoveTowards(transform.position, player.transform.position, speed * Time.deltaTime);
            }
            else
            {
                if(timer >= fireRate)
                {
                    timer = 0f;
                    //rotate towards player, set up projectile at firing ;point of enemy, fire it at enemy every some odd seconds
                    GameObject laser = Instantiate(projectile, firepoint.transform.position, transform.rotation);
                    laser.GetComponent<Rigidbody2D>().velocity = (playerPos - transform.position).normalized * projectileSpeed;
                }                
            }
        }

        if (Input.GetKeyDown(KeyCode.R))
        {
            health = 0;
        }


    }

}
