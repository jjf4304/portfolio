using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Inventory : MonoBehaviour {

    public GameObject player;
    public int numFireArrows, numIceArrows;
    public bool hasKey;

    private GameController controller;

	// Use this for initialization
	void Start () {
        controller = FindObjectOfType<GameController>();
        hasKey = false;
        player = this.gameObject;
    }

    public int NumFireArrows
    {
        get
        {
            return numFireArrows;
        }
        set
        {
            numFireArrows = value;
            //Set Ui Text from player.
            //player.GetComponent<UI>().fireArrowText.text = "Num Of Fire Arrows: " + numOfFireArrows;
        }
    }

    public int NumIceArrows
    {
        get
        {
            return numIceArrows;
        }
        set
        {
            numIceArrows = value;
            //Set Ui Text from player.
            //player.GetComponent<UI>().iceArrowText.text = "Num Of Ice Arrows: " + numOfIceArrows;
        }
    }

    public bool HasKey
    {
        set
        {
            hasKey = value;
            if(hasKey == true)
                controller.FoundKey();
        }
    }
}
