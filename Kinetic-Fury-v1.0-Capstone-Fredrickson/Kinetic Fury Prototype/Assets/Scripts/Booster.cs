/* A script for a boost pads in the levels. While a player is 
 * inside one, it pushes the player in a direction by some boost force.
 * 
 * Author: Joshua Fredrickson
 */ 

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Booster : MonoBehaviour {

    //Enum to describe the aiming direction of the boost pad
    public enum Direction
    {
        Up,
        Down,
        Left,
        Right
    }

    public float boostForce;
    //how much force is added per frame
    public Direction direction;
    //this pads direction to push

    /* 
     * Collision method, while  aplayer is inside the collider it pushes the player
     * based on the direction enum of the pad
     */ 
    private void OnTriggerStay2D(Collider2D collision)
    {
        if (collision.gameObject.CompareTag("Player"))
        {
            switch (direction)
            {
                case Direction.Up:
                    collision.GetComponent<Rigidbody2D>().AddForce(Vector2.up * boostForce);
                    break;

                case Direction.Down:
                    collision.GetComponent<Rigidbody2D>().AddForce(Vector2.down * boostForce);
                    break;

                case Direction.Left:
                    collision.GetComponent<Rigidbody2D>().AddForce(Vector2.left * boostForce);
                    break;

                case Direction.Right:
                    collision.GetComponent<Rigidbody2D>().AddForce(Vector2.right * boostForce);
                    break;

            }
        }
    }
}
