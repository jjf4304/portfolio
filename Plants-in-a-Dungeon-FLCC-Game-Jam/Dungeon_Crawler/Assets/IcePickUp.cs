﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class IcePickUp : MonoBehaviour {

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		
	}


    private void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.gameObject.CompareTag("Player"))
        {
            Debug.Log("Ice Arrow!");
            collision.gameObject.GetComponent<Movement>().changeArrow("Ice Arrow");
        }
       Destroy(this.gameObject);
    }
    }
