/* Script to handle ammo pickups in game
 * 
 * on collision calls a method from shooting to add ammo and grenades
 */ 

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AmmoBox : MonoBehaviour {

    public float ammoToGive, grenadeToGive;
    //amount of ammo and grenades to give on collision

    //on collision call a method from shooting to give ammo and grenades then destroy
    private void OnTriggerEnter(Collider collision)
    {
        if (collision.gameObject.CompareTag("Player"))
        {
            collision.gameObject.GetComponent<Shooting>().AddAmmo(ammoToGive, grenadeToGive);
            Destroy(this.gameObject);
        }
    }
}
