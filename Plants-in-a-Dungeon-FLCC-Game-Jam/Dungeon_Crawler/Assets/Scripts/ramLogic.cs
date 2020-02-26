using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ramLogic : MonoBehaviour {
    public GameObject target;
    Vector2 targetOrigin;
    float timeCount;
    bool onetime = false;
	// Use this for initialization
	void Start () {
		 
	}
	
	// Update is called once per frame
	void Update () {
        transform.right = target.transform.position - transform.position;

        /*
        timeCount += Time.deltaTime;
        if (!onetime)
        {
            targetOrigin = target.transform.position;
            targetOrigin.Normalize();

            onetime = true;
        }

        if (timeCount > 5)
        {
            Charge();
            
        }*/

        ChargeAbility();
    }
    public void Charge()
    {
        

        transform.position = Vector2.MoveTowards(new Vector2(transform.position.x, transform.position.y), targetOrigin, 20 * Time.deltaTime);
        //timeCount = 0;

    }
    public void ChargeAbility()
    {
        timeCount += Time.deltaTime;
        if (!onetime)
        {
            targetOrigin = target.transform.position;

            onetime = true;
        }

        if (timeCount > 1)
        {
            Charge();
            
        }
        if (transform.position.x == targetOrigin.x && transform.position.y == targetOrigin.y&&timeCount!=0)
        {
            onetime = false;
            timeCount = 0;
        }
    }
}
