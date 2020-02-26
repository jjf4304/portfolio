using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class HealthBar : MonoBehaviour {

    Vector3 localScale;
    public GameObject enemy;
    Quaternion rotation;
    Vector3 position;

    // Use this for initialization
    void Start()
    {
        localScale = transform.localScale;
    }

    // Update is called once per frame
    void Update()
    {
        localScale.x = enemy.GetComponent<CombatLogic>().health/10;
       // transform.position = enemy.transform.position;
    }
    private void FixedUpdate()
    {
        Vector2 toTarget = enemy.transform.position - transform.position;
        float speed = 1.5f;
        toTarget.y += .6f;
        transform.Translate(toTarget * speed);

    }
    void Awake()
    {
        rotation = transform.rotation;
        //position = transform.position;
    }
    void LateUpdate()
    {
        transform.rotation = rotation;
        //transform.position = position;
    }
}
