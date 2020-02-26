using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Projectile : MonoBehaviour {

    public float damage;
    public float pushbackForce;

    // Use this for initialization


    private void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.gameObject.CompareTag("Player"))
        {
            //damage player
            collision.gameObject.GetComponent<CombatLogic>().damage(1);
            Debug.Log(collision.gameObject.GetComponent<CombatLogic>().health);
            Destroy(this.gameObject);
        }
        else
        {
            Destroy(this.gameObject);
        }
    }
}
