using System.Collections;
using System.Collections.Generic;
using UnityEngine.UI;
using UnityEngine;

public class Chest : MonoBehaviour {

    public enum LootType
    {
        Health,
        Key,
        IceArrow,
        FireArrow
    }

    public Text health;
    public Text iceArrowText;
    public Text fireArrowText;
    public Text keyText;

    public LootType loot;
    public float timeTillDestroy;
    public bool gainedLoot;
    public GameObject pointToShowLoot;
    public Sprite heart, fireArrow, key, iceArrow;


    private float timer;

	// Use this for initialization
	void Start () {
        timer = 0f;
        gainedLoot = false;
	}
	
	// Update is called once per frame
	void Update () {
        if (gainedLoot)
        {
            timer += Time.deltaTime;
            

            if (timer >= timeTillDestroy)
            {
                
                Destroy(this.gameObject);
            }
        }
	}

    public void SetLootSprite()
    {
        switch (loot)
        {
            case LootType.Health:
                Debug.Log("Health");
                pointToShowLoot.GetComponent<SpriteRenderer>().sprite = heart;
                //Message that gained health, gain health in player script in the collider

                break;
            case LootType.Key:
                Debug.Log("Key");
                pointToShowLoot.GetComponent<SpriteRenderer>().sprite = key;
                break;
            case LootType.FireArrow:
                Debug.Log("FireArrow");
                pointToShowLoot.GetComponent<SpriteRenderer>().sprite = fireArrow;
                //gameObject.GetComponent<Movement>().changeArrow("Fire Arrow");
                break;
            case LootType.IceArrow:
                Debug.Log("Ice");
                pointToShowLoot.GetComponent<SpriteRenderer>().sprite = iceArrow;
                //gameObject.GetComponent<Movement>().changeArrow("Ice Arrow");
                break;
        }
    }

    private void OnTriggerStay2D(Collider2D collision)
    {
        if (!gainedLoot && collision.gameObject.CompareTag("Player") && (Input.GetButtonDown("InteractP1") || Input.GetButtonDown("InteractP2")))
        {
            SetLootSprite();
            gainedLoot = true;
            if (loot == LootType.Key)
            {
                collision.GetComponent<Inventory>().HasKey = true;
                keyText.text = "You found the key!";
            }
            else if (loot == LootType.Health)
            {
                //heal player
                collision.GetComponent<CombatLogic>().health++;
                health.text = "Health: " + collision.GetComponent<CombatLogic>().health;
            }
            else if (loot == LootType.FireArrow)
            {
                collision.GetComponent<Inventory>().NumFireArrows = collision.GetComponent<Inventory>().NumFireArrows + 3;
                fireArrowText.text = "Fire Arrows: " + collision.GetComponent<Inventory>().numFireArrows;
            }
            else if (loot == LootType.IceArrow)
            {
                collision.GetComponent<Inventory>().NumIceArrows = collision.GetComponent<Inventory>().NumIceArrows + 3;
                iceArrowText.text = "Ice Arrows: " + collision.GetComponent<Inventory>().numIceArrows;

            }
        }
    }

    public LootType Loot
    {
        get
        {
            return loot;
        }
        set
        {
            loot = value;
        }
    }

    public bool GainedLoot
    {
        get
        {
            return gainedLoot;
        }
        set
        {
            gainedLoot = value;
        }
    }
}
