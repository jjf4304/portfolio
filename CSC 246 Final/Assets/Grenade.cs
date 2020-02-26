/* Grenade script to handle grenade detonation
 * 
 * Grenades detonate after a set amount of time,
 * playing a sound and particle effect, then 
 * damaging all enemies in a radius
 * 
 */ 

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Grenade : MonoBehaviour {

    public float radius, damage, timeToExplode;
    //damage radius, amount and time till detonations
    public bool detonated; // bool set to true after detonation
    public ParticleSystem smoke; //particle system
    public AudioSource audio; //explosion audio


    private void Start()
    {
        detonated = false;
        smoke = GetComponent<ParticleSystem>();
        audio = GetComponent<AudioSource>();
        StartCoroutine("GrenadeThrow");
    }

    //after some amount of time, explode
    IEnumerator GrenadeThrow()
    {
        yield return new WaitForSeconds(timeToExplode);
        Detonate();
    }


    //disable meshes, play sounds and particles, then damage all enemies in a radius
    private void Detonate()
    {
        detonated = true;
        GetComponent<BoxCollider>().enabled = false;

        foreach (MeshRenderer item in GetComponentsInChildren<MeshRenderer>())
        {
            item.enabled = false;
        }

        audio.Play();

        smoke.Stop();
        smoke.Play();

        //gets all colliders in a radius
        Collider[] explosionHits = Physics.OverlapSphere(transform.position, radius);

        foreach (Collider item in explosionHits)
        {
            if (item.gameObject.CompareTag("Enemy"))
            {
                item.GetComponent<EnemyHealth>().DecrementHealth(damage);
            }
        }

        Destroy(this.gameObject, 1f);

    }

}
