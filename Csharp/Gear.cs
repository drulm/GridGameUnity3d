
//======================================================================
// GRID GAME:	Gear.cs
// 			Attached to gear object.
//				Used for (gear objects in):
//					* Start.cs
//					* Lose.cs
//					* SceneManager.cs
//======================================================================

using UnityEngine;
//using System.Collections;
//using UnityEngine.SceneManagement;


public class Gear : MonoBehaviour
{
    //======================================================================
    // Methods
    //======================================================================

    //----------------------------------------------------------------------
    // Unity: Update method
    void Update()
    {
        string name = GetName();            // Get name of this object
        int x = GetTileX(name);             // The tile loc X
        bool turnGear;                      // Turn the gear, yes-no

        // turnGear = true if this gear should be turning
        string sceneName = UnityEngine.SceneManagement.SceneManager.GetActiveScene().name;
        //turnGear = Application.loadedLevelName == "sceneStart" || Application.loadedLevelName == "sceneLose";
        //turnGear = (Application.loadedLevelName == "scene1") ? GetCoinsMoving() : turnGear;
        turnGear = sceneName == "sceneStart" || sceneName == "sceneLose";
        turnGear = (sceneName == "scene1") ? GetCoinsMoving() : turnGear;

        // Rotate the gear forwards or backwards
        if (turnGear)
        {
            // Turn even named gears forwards
            if (x % 2 == 0)
            {
                transform.Rotate(new Vector3(0f, 1f, 0f) * Time.deltaTime * 100);
            }
            // Turn odd named gears backwards
            else
            {
                transform.Rotate(new Vector3(0f, -1f, 0f) * Time.deltaTime * 100);
            }
        }

    }


    //----------------------------------------------------------------------
    // Is any coin moving?
    bool GetCoinsMoving()
    {
        return Camera.main.GetComponent<SceneManager>().coinsMoving();
    }


    //----------------------------------------------------------------------
    // Get current name string from the object.name
    string GetName()
    {
        return transform.gameObject.name;
    }


    //----------------------------------------------------------------------
    // Get the X Coord based on the name
    int GetTileX(string tileName)
    {
        return int.Parse(GetFromName(tileName, 1));
    }


    //----------------------------------------------------------------------
    // Tokenize an Object name and return the object name
    string GetFromName(string objectName, int i)
    {
        string[] splitarray = objectName.Split("_"[0]);
        return splitarray[i];
    }

}
