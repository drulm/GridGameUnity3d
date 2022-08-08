
//======================================================================
// GRID GAME:	Coins.cs
// 		Attached to prefab preCoin
//			Used for:
//				*	Check if coins are moving
//======================================================================

using UnityEngine;
using System.Collections;

public class Coins : MonoBehaviour
{
    //======================================================================
    // Variables
    //======================================================================

    // Public Unity Variables
    //----------------------------------------------------------------------
    public bool staticObject;       // Is this coin in motion or not


    // Private Variables
    //----------------------------------------------------------------------
    private Vector3 lastPos;        // Save last position, to see if in motion


    //======================================================================
    // Methods
    //======================================================================

    //----------------------------------------------------------------------
    // Unity: Update method
    void Update()
    {
        SetCoinMotion();
    }


    //----------------------------------------------------------------------
    // Set flag staticObject to true if coin not moving
    void SetCoinMotion()
    {
        Vector3 curPos;                     // To save the current position


        staticObject = true;                // Assume we did not move
        curPos = transform.position;        // Save the current position

        // Set stationary position if we did not move
        if (curPos != lastPos)
        {
            staticObject = false;           // We moved
        }

        lastPos = curPos;                   // Save old pos
    }

}
