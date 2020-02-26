/*A scipt whose job is purely to hold references to Texts and 
 * Images of a PLayerUIPanel Prefab. These references are used 
 * by the LevelManager to set up each player's UI
 * 
 * Author: Joshua Fredrickson 
 */ 

using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PlayerPanel : MonoBehaviour {

    public Text playerWeapontext, playerAmmoText, playerCountText;
    //Texts for the players current weapon, current ammo, and how many 
    //lives they have left
    public Image healthBar, boostBar, powerBar, skullImage;
    //images for healthbars, boost bars, power bars, and a skull image (which 
    //apepars when that player is out of lives

}
