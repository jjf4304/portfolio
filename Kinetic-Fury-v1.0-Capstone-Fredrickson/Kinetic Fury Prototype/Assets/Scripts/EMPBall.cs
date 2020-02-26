/* Script describing an EMP projectile. On collision it detonates, disabling plyers in a radius
 * and then destroys that object.
 * 
 * Author: Joshua Fredrickson
 */ 

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EMPBall : MonoBehaviour {

    public int sourcePlayer;
    //the source player for the projectile
    public float radius;
    //the radius of effect
	

    //sets uo the source player value
    public void SetUpPlayer(int playerNum)
    {
        sourcePlayer = playerNum;
    }

    //on colliison with a player or a wall or hazard, detonate the EMP projectile
    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.gameObject.CompareTag("Player") && collision.GetComponent<PlayerController>().playerNum != sourcePlayer)
        {
            Detonate();
        }
        else if(collision.gameObject.CompareTag("Wall") || collision.gameObject.CompareTag("Hazard") /*|| other obejcts*/)
        {
            Detonate();
        }
    }

    /*
     * Find all colliders within a radius from the projectile when it detonates. If they are players
     * that are not the source player, emp them.
     */ 
    private void Detonate()
    {
        //play EMP explosion animation and sound
        Collider2D[] hitColliders = Physics2D.OverlapCircleAll(transform.position, 5f);
        foreach (Collider2D item in hitColliders)
        {
            if(item.CompareTag("Player") && item.GetComponent<PlayerController>().playerNum != sourcePlayer)
            {
                item.GetComponent<PlayerController>().BeenEMPd = true;
            }
        }
        gameObject.SetActive(false);
    }
}
