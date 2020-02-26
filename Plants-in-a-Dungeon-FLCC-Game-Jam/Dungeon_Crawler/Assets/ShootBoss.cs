using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ShootBoss : MonoBehaviour {


    public GameObject firepoint1, firePoint2, firePoint3, firePoint4;
    public GameObject shot;
    public float timer, speed;
    public float timeBtwShot;

	// Use this for initialization
	void Start () {
        timer = 0f;
	}
	
	// Update is called once per frame
	void Update () {
        timer += Time.deltaTime;

        if(timer >= timeBtwShot)
        {
            timer = 0;

            
            
                GameObject first = Instantiate(shot, firepoint1.transform.position, firepoint1.transform.rotation);
                first.GetComponent<Rigidbody2D>().velocity = (firepoint1.transform.position - transform.position).normalized * speed;

                GameObject second = Instantiate(shot, firePoint2.transform.position, firePoint2.transform.rotation);
                first.GetComponent<Rigidbody2D>().velocity = (firePoint2.transform.position - transform.position).normalized * speed;

                GameObject third = Instantiate(shot, firePoint3.transform.position, firePoint3.transform.rotation);
                first.GetComponent<Rigidbody2D>().velocity = (firePoint3.transform.position - transform.position).normalized * speed;

                GameObject fourth = Instantiate(shot, firePoint4.transform.position, firePoint4.transform.rotation);
                first.GetComponent<Rigidbody2D>().velocity = (firePoint4.transform.position - transform.position).normalized * speed;
            
            
        }
	}
}
