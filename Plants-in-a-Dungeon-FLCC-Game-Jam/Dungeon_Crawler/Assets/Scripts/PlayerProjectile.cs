using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerProjectile : MonoBehaviour {
    public float damage;
    public float pushbackForce;
    public float fireArrowDamage;
    public float iceArrowDamage;

    // Use this for initialization
    private void Update()
    {
       // Debug.Log(this.transform.position);
    }


    private void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.gameObject.CompareTag("Enemy"))
        {
            
            if(this.CompareTag("Fire Arrow")){
            collision.gameObject.GetComponent<CombatLogic>().damage(fireArrowDamage);
            }
            else if(this.CompareTag("Ice Arrow"))
            {
                collision.gameObject.GetComponent<CombatLogic>().damage(iceArrowDamage);
                collision.gameObject.GetComponent<BasicEnemyAI>().speed *= .75f;
            }
            else
            {
                collision.gameObject.GetComponent<CombatLogic>().damage(damage);
            }
            Destroy(this.gameObject);
        }
        else
        {
            Destroy(this.gameObject);
        }
    }
}
