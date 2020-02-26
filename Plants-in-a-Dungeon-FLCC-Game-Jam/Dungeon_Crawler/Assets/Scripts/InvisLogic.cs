using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class InvisLogic : MonoBehaviour {
    public GameObject player;
    private float colorR;
    private float colorG;
    private float colorB;

    // Use this for initialization
    void Start () {
       // this.GetComponent<SpriteRenderer>().material.color = new Color(0, 0, 0, 0f);
colorR = this.GetComponent<SpriteRenderer>().material.color.r;
colorG = this.GetComponent<SpriteRenderer>().material.color.g;
colorB = this.GetComponent<SpriteRenderer>().material.color.b;
	}
	
	// Update is called once per frame
	void Update () {
        float difx = player.transform.position.x - this.transform.position.x;
        float dify = player.transform.position.y - this.transform.position.y;
        float distance = Vector2.Distance(player.transform.position, this.transform.position);

       Debug.Log(distance);
        float tranparent =(distance / 100f);
        if (tranparent > 1)
            tranparent = 1;
        



            //this.GetComponent<SpriteRenderer>().material.color = new Color(colorR, colorG, colorB, tranparent);
        
	}
}
