/* Hair attack script for Cynthia. On projectile detonation, it searches for 
 * players in a radius and attaches them to the detonation point for a duration. 
 * it uses the method from the grappling hook to do this, as if the player grappled there,
 * but they cannot turn it off manually
 * 
 * Author: Joshua Fredrickson
 */ 

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class HairAttack : MonoBehaviour {

    public int sourcePlayer, playerLayerMask;
    //source player num and layer mask for players (used in detonate)
    public float radius;
    //radius of effect

    //sets up the player num
    public void setUpPlayer(int playerNum)
    {
        sourcePlayer = playerNum;
    }

    //collision detection for the projectile. If hitting wall or hazard, detonate
    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.gameObject.CompareTag("Wall") || collision.gameObject.CompareTag("Hazard") /*|| other obejcts*/)
        {
            Detonate();
        }
    }

    /*
     * Find all colliders in a radius and if they are players, call their grapple to the coliision location
     */ 
    private void Detonate()
    {
        //play EMP explosion animation and sound
        Collider2D[] hitColliders = Physics2D.OverlapCircleAll(transform.position, radius, 1 << playerLayerMask); 
        // 1 << playerLayerMask = bitshift to convert the player layer int value to a value overlapcircleall can use
        foreach (Collider2D item in hitColliders)
        {
            if (item.CompareTag("Player") && item.GetComponent<PlayerController>().playerNum != sourcePlayer)
            {
                item.GetComponent<PlayerController>().BeenTied = true;

                if (item.GetComponent<PlayerController>().isSwinging)
                    item.GetComponent<rope>().ResetRope();
                item.GetComponent<rope>().HandleInput(transform.position - item.transform.position);
            }
        }
        gameObject.SetActive(false);
    }
}
