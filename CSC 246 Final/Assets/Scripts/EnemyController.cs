/* Method to handle enemy movement and attacking
 * 
 * Moves directly towards a player and on collision 
 * plays attack animation and damages them
 */ 

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnemyController : MonoBehaviour {

    public float speed, damage, rotationSpeed;
    public bool attacking, canAttack;
    public Transform target;
    public Animator anim;
    private Rigidbody rigid;

    void Start()
    {
        rigid = GetComponentInChildren<Rigidbody>();
        target = FindObjectOfType<Movement>().GetComponent<Transform>();
        anim = GetComponentInChildren<Animator>();
    }

    private void Update()
    {
        Vector3 direction = (target.position - transform.position).normalized;
        //rigid.velocity = direction * speed;
        transform.LookAt(target);

        transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(direction), rotationSpeed * Time.deltaTime);

        //when not attacking move towards player
        if (!attacking)
            transform.position += transform.forward * speed * Time.deltaTime;

    }

    //on collision with player start attack animation and coroutine
    private void OnCollisionEnter(Collision collision)
    {
        if (collision.gameObject.CompareTag("Player"))
        {
            if (!attacking)
            {
                anim.SetTrigger("Attack");
                attacking = true;
                StartCoroutine("Attack");
            }
        }
    }

    //coroutine for attacking, hurting player then going back to run animation
    IEnumerator Attack()
    {
        target.gameObject.GetComponent<Health>().DecrementHealth(damage);
        yield return new WaitForSeconds(1f);
        attacking = false;
        anim.SetTrigger("Run");

    }
}
