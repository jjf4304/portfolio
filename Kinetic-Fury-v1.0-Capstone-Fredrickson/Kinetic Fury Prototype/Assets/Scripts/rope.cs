/**
 * This script is based off of a tutorial script from https://www.raywenderlich.com/348-make-a-2d-grappling-hook-game-in-unity-part-1
 * (Part 1 and part 2). This is a modified version of the end result of that tutorial, adding different input, taking away 
 * some parts (like the crosshair use that the original used), a method, and changing some of the logic.
 * 
 * I take no Ownership of the non-modified parts of this script which are owned by 
 * raywendelich.com and the tutorial author Sean Duffy.
 * 
 * 
 */



using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;

public class rope : MonoBehaviour {


    public LineRenderer ropeRenderer;
    public LayerMask ropeLayerMask;
    public float pullForce;
    public GameObject ropeHingeAnchor;
    public DistanceJoint2D ropeJoint;
    public PlayerController playerController;
    private bool ropeAttached, isColliding, distanceSet;
    private Vector2 playerPosition;
    private List<Vector2> ropePositions = new List<Vector2>();
    private float ropeMaxCastDistance = 20f;
    private Rigidbody2D ropeHingeAnchorRb;
    private Dictionary<Vector2, int> wrapPointsLookup = new Dictionary<Vector2, int>();
    private SpriteRenderer ropeHingeAnchorSprite;

    void Awake()
    {
        ropeJoint.enabled = false;
        playerPosition = transform.position;
        ropeHingeAnchorRb = ropeHingeAnchor.GetComponent<Rigidbody2D>();
        ropeHingeAnchorSprite = ropeHingeAnchor.GetComponent<SpriteRenderer>();
        playerController = GetComponent<PlayerController>();
    }

    /// <summary>
    /// Figures out the closest Polygon collider vertex to a specified Raycast2D hit point in order to assist in 'rope wrapping'
    /// </summary>
    /// <param name="hit">The raycast2d hit</param>
    /// <param name="polyCollider">the reference polygon collider 2D</param>
    /// <returns></returns>
    private Vector2 GetClosestColliderPointFromRaycastHit(RaycastHit2D hit, PolygonCollider2D polyCollider)
    {
        // Transform polygoncolliderpoints to world space (default is local)
        Dictionary<float, Vector2> distanceDictionary = polyCollider.points.ToDictionary<Vector2, float, Vector2>(
            position => Vector2.Distance(hit.point, polyCollider.transform.TransformPoint(position)),
            position => polyCollider.transform.TransformPoint(position));

        IOrderedEnumerable<KeyValuePair<float, Vector2>> orderedDictionary = distanceDictionary.OrderBy(e => e.Key);
        return orderedDictionary.Any() ? orderedDictionary.First().Value : Vector2.zero;
    }

    // Update is called once per frame
    void Update()
    {
        if (playerController.alive)
        {
            //Controller Input - my work
            float horizontal = Input.GetAxis("Horizontal" + playerController.playerString), vertical = Input.GetAxis("Vertical" + playerController.playerString);
            Vector2 facingDirection = new Vector2(horizontal, vertical);

            float aimAngle = Mathf.Atan2(facingDirection.y, facingDirection.x);
            if (aimAngle < 0f)
            {
                aimAngle = Mathf.PI * 2 + aimAngle;
            }

            Vector2 aimDirection = Quaternion.Euler(0, 0, aimAngle * Mathf.Rad2Deg) * Vector2.right;
            playerPosition = transform.position;

            if (!ropeAttached)
            {
                playerController.isSwinging = false;
            }
            else
            {
                playerController.isSwinging = true;

                // Wrap rope around points of colliders if there are raycast collisions between player position and their closest current wrap around collider / angle point.
                if (ropePositions.Count > 0)
                {
                    Vector2 lastRopePoint = ropePositions.Last();
                    RaycastHit2D playerToCurrentNextHit = Physics2D.Raycast(playerPosition, (lastRopePoint - playerPosition).normalized, Vector2.Distance(playerPosition, lastRopePoint) - 0.1f, ropeLayerMask);
                    if (playerToCurrentNextHit)
                    {
                        PolygonCollider2D colliderWithVertices = playerToCurrentNextHit.collider as PolygonCollider2D;
                        if (colliderWithVertices != null)
                        {
                            Vector2 closestPointToHit = GetClosestColliderPointFromRaycastHit(playerToCurrentNextHit, colliderWithVertices);
                            if (wrapPointsLookup.ContainsKey(closestPointToHit))
                            {
                                // Reset the rope if it wraps around an 'already wrapped' position.
                                ResetRope();
                                return;
                            }

                            ropePositions.Add(closestPointToHit);
                            wrapPointsLookup.Add(closestPointToHit, 0);
                            distanceSet = false;
                        }
                    }
                }
            }

            UpdateRopePositions();

            //My work on handling when the grappling hook is deployed or not. Either throws out the hook or has it pull the player towards
            //the hook location
            if (Input.GetButtonDown("Hook" + playerController.playerString) && !playerController.CanHook() && !playerController.isSwinging)
                HandleInput(aimDirection);
            else if (Input.GetButtonDown("Hook" + playerController.playerString) && !playerController.CanHook() && playerController.isSwinging)
            {
                PullRope();
                ResetRope();
            }
            HandleRopeUnwrap();
        }
        
    }

    /// <summary>
    /// Handles input within the RopeSystem component
    /// </summary>
    /// <param name="aimDirection">The current direction for aiming based on mouse position</param>
    public void HandleInput(Vector2 aimDirection)
    {
        if (ropeAttached) return;
        ropeRenderer.enabled = true;

        RaycastHit2D hit = Physics2D.Raycast(playerPosition, aimDirection, ropeMaxCastDistance, ropeLayerMask);

        if (hit.collider != null)
        {
            ropeAttached = true;
            if (!ropePositions.Contains(hit.point))
            {
                ropePositions.Add(hit.point);
                wrapPointsLookup.Add(hit.point, 0);
                ropeJoint.distance = Vector2.Distance(playerPosition, hit.point);
                ropeJoint.enabled = true;
                ropeHingeAnchorSprite.enabled = true;
            }
        }
        else
        {
            ropeRenderer.enabled = false;
            ropeAttached = false;
            ropeJoint.enabled = false;
        }
    }

    /*
     * Method to have the character reel themselves in and pull towards either the hook location or the closest
     * wrap location by a pull force
     */ 
    public void PullRope()
    {
        Vector2 direction = (ropeHingeAnchor.transform.position - transform.position).normalized;
        GetComponent<Rigidbody2D>().AddForce(direction*pullForce, ForceMode2D.Impulse);
    }


    /*
     * Resets the grappling hook, turning off graphics and resetting
     * points in the line renderer and dictionary
     */
    public void ResetRope()
    {
        ropeJoint.enabled = false;
        ropeAttached = false;
        playerController.isSwinging = false;
        ropeRenderer.positionCount = 2;
        ropeRenderer.SetPosition(0, transform.position);
        ropeRenderer.SetPosition(1, transform.position);
        ropePositions.Clear();
        wrapPointsLookup.Clear();
        ropeHingeAnchorSprite.enabled = false;
    }

    /// <summary>
    /// Handles updating of the rope hinge and anchor points based on objects the rope can wrap around. These must be PolygonCollider2D physics objects.
    /// </summary>
    private void UpdateRopePositions()
    {
        if (ropeAttached)
        {
            ropeRenderer.positionCount = ropePositions.Count + 1;

            for (var i = ropeRenderer.positionCount - 1; i >= 0; i--)
            {
                if (i != ropeRenderer.positionCount - 1) // if not the Last point of line renderer
                {
                    ropeRenderer.SetPosition(i, ropePositions[i]);

                    // Set the rope anchor to the 2nd to last rope position (where the current hinge/anchor should be) or if only 1 rope position then set that one to anchor point
                    if (i == ropePositions.Count - 1 || ropePositions.Count == 1)
                    {
                        if (ropePositions.Count == 1)
                        {
                            Vector2 ropePosition = ropePositions[ropePositions.Count - 1];
                            ropeHingeAnchorRb.transform.position = ropePosition;
                            if (!distanceSet)
                            {
                                ropeJoint.distance = Vector2.Distance(transform.position, ropePosition);
                                distanceSet = true;
                            }
                        }
                        else
                        {
                            Vector2 ropePosition = ropePositions[ropePositions.Count - 1];
                            ropeHingeAnchorRb.transform.position = ropePosition;
                            if (!distanceSet)
                            {
                                ropeJoint.distance = Vector2.Distance(transform.position, ropePosition);
                                distanceSet = true;
                            }
                        }
                    }
                    else if (i - 1 == ropePositions.IndexOf(ropePositions.Last()))
                    {
                        // if the line renderer position we're on is meant for the current anchor/hinge point...
                        Vector2 ropePosition = ropePositions.Last();
                        ropeHingeAnchorRb.transform.position = ropePosition;
                        if (!distanceSet)
                        {
                            ropeJoint.distance = Vector2.Distance(transform.position, ropePosition);
                            distanceSet = true;
                        }
                    }
                }
                else
                {
                    // Player position
                    ropeRenderer.SetPosition(i, transform.position);
                }
            }
        }
    }


    /*
     * When the rope "unwraps" around a corner, this method is called. It takes
     * points out of their holding structures, sets the points, direction, position and angles
     * for the hinge and anchors, and handles how to remove information as needed when the 
     * player goes back around a point they've wrapped around.
     */ 
    private void HandleRopeUnwrap()
    {
        if (ropePositions.Count <= 1)
        {
            return;
        }

        // Hinge = next point up from the player position
        // Anchor = next point up from the Hinge
        // Hinge Angle = Angle between anchor and hinge
        // Player Angle = Angle between anchor and player

        // 1
        int anchorIndex = ropePositions.Count - 2;
        // 2
        int hingeIndex = ropePositions.Count - 1;
        // 3
        Vector2 anchorPosition = ropePositions[anchorIndex];
        // 4
        Vector2 hingePosition = ropePositions[hingeIndex];
        // 5
        Vector2 hingeDir = hingePosition - anchorPosition;
        // 6
        float hingeAngle = Vector2.Angle(anchorPosition, hingeDir);
        // 7
        Vector2 playerDir = playerPosition - anchorPosition;
        // 8
        float playerAngle = Vector2.Angle(anchorPosition, playerDir);

        if (!wrapPointsLookup.ContainsKey(hingePosition))
        {
            return;
        }

        if (playerAngle < hingeAngle)
        {
            // 1
            if (wrapPointsLookup[hingePosition] == 1)
            {
                UnwrapRopePosition(anchorIndex, hingeIndex);
                return;
            }

            // 2
            wrapPointsLookup[hingePosition] = -1;
        }
        else
        {
            // 3
            if (wrapPointsLookup[hingePosition] == -1)
            {
                UnwrapRopePosition(anchorIndex, hingeIndex);
                return;
            }

            // 4
            wrapPointsLookup[hingePosition] = 1;
        }
    }

    //Removes old wrap points from the lists and dictionaries that held them
    private void UnwrapRopePosition(int anchorIndex, int hingeIndex)
    {
        // 1
        Vector2 newAnchorPosition = ropePositions[anchorIndex];
        wrapPointsLookup.Remove(ropePositions[hingeIndex]);
        ropePositions.RemoveAt(hingeIndex);

        // 2
        ropeHingeAnchorRb.transform.position = newAnchorPosition;
        distanceSet = false;

        // Set new rope distance joint distance for anchor position if not yet set.
        if (distanceSet)
        {
            return;
        }
        ropeJoint.distance = Vector2.Distance(transform.position, newAnchorPosition);
        distanceSet = true;
    }

    void OnTriggerStay2D(Collider2D colliderStay)
    {
        isColliding = true;
    }

    private void OnTriggerExit2D(Collider2D colliderOnExit)
    {
        isColliding = false;
    }


}
