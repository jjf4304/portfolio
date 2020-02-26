/* Script for Pendulum traps in the Chambre levels. Controls 
 * the rotation and movement of the pendulum using hinge joints
 * and line renderers. Applies damage to a player if they impact one
 * 
 * Author: Joshua Fredrickson
 */ 

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PendulumTrap : MonoBehaviour {

    public float timer, damage;
    //count up timer and damage of the pendulum
    public Transform hingeAnchor, pivot;
    //hinge anchor and pivor transform
    public LineRenderer line;
    //the line between the hinge and the pendulum head
    public HingeJoint2D hingeJoint;
    //the hingejoint component

    private bool start, switchDirection;
    //bool for start swinging, and if the pendulum needs to switch direction

	// Use this for initialization
	void Start () {
        line = GetComponent<LineRenderer>();
        hingeJoint = GetComponent<HingeJoint2D>();
        switchDirection = false;

    }
	
	// Update is called once per frame
    /*
     * Update controls if the pendulum needs to switch direction, and if so
     * changes the hinge joints motor speed to reverse the rotate speed 
     * (which is controlled by the hinge Joint)
     */ 
	void Update () {
        if (switchDirection)
        {
            timer += Time.deltaTime;
            if(timer >= .1f)
            {
                switchDirection = false;
            }
        }

        if (!switchDirection && Mathf.Abs(hingeJoint.jointAngle) >= hingeJoint.limits.max)
        {
            timer = 0f;
            switchDirection = true;
            JointMotor2D motor = hingeJoint.motor;
            motor.motorSpeed = motor.motorSpeed * -1;
            hingeJoint.motor = motor;

            //transform.Rotate()
        }
	}

    //Collider with player, on collision damages them
    private void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.gameObject.CompareTag("Player"))
        {
            collision.gameObject.GetComponent<Health>().Decrement(damage, 5);
        }
    }

    public void InitiateTraps()
    {
        //called in game manager after starting countdown begins
        start = true;
    }

    public void DeactivateTraps()
    {
        start = false;
        timer = 0f;
    }
}
