/* A simple rotate script for pickups. I believe its very similar 
 * if not the same as the unity ufo tutorial, and if so they hold rights
 * to the script beyond the check for my own object. I can't be sure but 
 * since we re-did that tutorial in CSC 246, i probably remembered this code 
 * from there.
 * 
 * 
 */ 

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Rotator : MonoBehaviour {

    //Update is called every frame
    //rotates the object over time
    void Update()
    {
        if (!FindObjectOfType<LevelManager>().paused)
            transform.Rotate(new Vector3(0, 0, 45) * Time.deltaTime);
    }
}
