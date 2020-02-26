using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class getArrow : MonoBehaviour {
    public Text textArrow;
    private GameObject player;
    private GameController controller;

    // Use this for initialization
    void Start () {
        controller = FindObjectOfType<GameController>();
	}
	
	// Update is called once per frame
	void Update () {
        player = controller.player1;
        textArrow.text = "";


        if (this.CompareTag("Fire Arrow"))
        {
            textArrow.text = "Fire Arrows: " + player.GetComponent<Inventory>().numFireArrows.ToString();
        }
        else if(this.CompareTag("Ice Arrow"))
        {
            textArrow.text = "Ice Arrows: " + player.GetComponent<Inventory>().numIceArrows.ToString();
        }
        else if (this.CompareTag("Key"))
        {
            if(player.GetComponent<Inventory>().hasKey)
                textArrow.text = "Key found! Go to the boss!";
            else
            {
                textArrow.text = "Find the Key!";
            }
        }
        else if (this.CompareTag("Health"))
        {
            GetHealth();
        }
    }

    public void GetHealth()
    {
        textArrow.text = "Health: " + player.GetComponent<CombatLogic>().health.ToString();
    }
}
