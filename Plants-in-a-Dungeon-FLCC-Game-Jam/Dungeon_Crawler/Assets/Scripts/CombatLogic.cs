using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CombatLogic : MonoBehaviour {

    public float health;
    private GameController controller;
	// Use this for initialization
	void Start () {
        controller = FindObjectOfType<GameController>();
	}
	
	// Update is called once per frame
	void Update () {
        if (this.CompareTag("Player"))
        {
            if(health <= 0)
            {
                Destroy(this.gameObject);
            }
        }
        else if (health <= 0)
        {
            controller.RemoveFromEnemyList(this.gameObject);

            Destroy(this.gameObject);
        }
        if (!this.CompareTag("Player")) {
            Debug.Log(health);
       }
	}

    private void OnCollisionEnter2D(Collision2D collision)
    {
        if (this.CompareTag("Player") && collision.gameObject.CompareTag("Enemy"))
        {
            this.damage(1);
        }

    }
        /*
        public void hitLogic(float duration, float timeCount, float forceAmount)
        {
            timeCount += Time.deltaTime;

            if (timeCount < duration)
            {
                Rigidbody2D enemyRigid = this.GetComponent<Rigidbody2D>();
                Vector3 push = new Vector3(0, forceAmount, 0);
                this.GetComponent<Rigidbody2D>().AddForce(push);
            }
            else
            {
                timeCount = 0;
            }
        }
        */
     public void setHealth(float num)
    {
        health = num;
    }
    public void damage(float num)
    {
        health -= num;
    }
}
