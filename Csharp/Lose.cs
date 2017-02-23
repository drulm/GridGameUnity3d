
//======================================================================
// GRID GAME: Lose.cs
// 		Win or Lose page, show score, etc.
//======================================================================

using UnityEngine;
using System.Collections;

public class Lose : MonoBehaviour
{
	//======================================================================
	// Variables
	//======================================================================

	// Public Unity Variables
	//----------------------------------------------------------------------
	public Font font;						// The gui font
	public GUISkin CustomGUISkin;			// The gui skin


	// Private Variables
	//----------------------------------------------------------------------
	private float _oldWidth;				// For recalculating dimensions
	private float _oldHeight;				// For recalculating dimensions
	private int fontSize;					// Recalculate font size if resize window


	//======================================================================
	// Methods
	//======================================================================
	

	//----------------------------------------------------------------------
	// Unity: Update method
	void Update()
	{
		float mn;					// Used for gui resize if needed

		// If gui needs resized
		if (_oldWidth != Screen.width || _oldHeight != Screen.height) 
		{
			_oldWidth = Screen.width;
			_oldHeight = Screen.height;
			mn = Screen.width < Screen.height ? Screen.width : Screen.height;
			fontSize = (int)(mn / Global.ScreenRatio);
		}

		// Go back if they hit the Android quit button
		if (Input.GetKeyDown(KeyCode.Escape))
		{ 
			Application.LoadLevel("sceneStart");
		}

	}


	//----------------------------------------------------------------------
	// Unity: OnGUI method
	void OnGUI()
	{
		int screenHeight = Screen.height;		// Setup gui height based on screen size
		int screenWidth = Screen.width;			// Setup gui width based on screen size
		int r = screenHeight / 10;				// Get width to height ratio
		string endMsg;							// Just a gui msg
	
		// Setup Unity gui skin custimization
		GUI.skin = CustomGUISkin;
		GUI.skin.label.font = GUI.skin.button.font = GUI.skin.box.font = font;
		GUI.skin.label.fontSize = GUI.skin.box.fontSize = GUI.skin.button.fontSize = fontSize;

		// Create a gui group on the center of the screen
		GUI.BeginGroup(new Rect(
			screenWidth/4, 
			screenHeight/4 + r, 
			screenWidth/2, 
			screenHeight/4 + r*6)
		);

		// Determine end message based on levels completed
		endMsg = GetLevel() >= Global.Levels ? endMsg = "WELL DONE!" : "PARLOUR GAME OVER";

		// Make a text box on the GUI
		GUI.Box(new Rect(0, 0, screenWidth/2, r*7), "\n\n" + endMsg
				+ "\nLevel: " + (GetLevel() - Global.TutorialLevels)
				+ "\n   Score: " + GetScore()
				+ "\nGrand Score: " + GetHiScore()
			);

		// Tweet high score button
		if (GUI.Button(new Rect(10, r*4.3f, screenWidth/2-20, r), "@Tweet Your Hi-Score!")) 
		{
			Application.OpenURL("http://twitter.com/home?status=Made%20a%20High-Score%20of%20" + GetHiScore() + "%20on%20Clank%20Steampunk%2C%20a%20Cool%20%23Android%20%23Game.%20Available%20at%3A%20https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.AwakeLand.SteamTileInfiniteFree");
		}

		// Return to main menu button
		if (GUI.Button(new Rect(10, r*5.3f, screenWidth/2-20, r), "To Main Menu")) 
		{
			Application.LoadLevel("sceneStart");
		}

		GUI.EndGroup();
	}
	
	
	//----------------------------------------------------------------------
	// Method to return the shared score
	int GetScore()
	{
		return Global.Instance.score;
	}


	//----------------------------------------------------------------------
	// Return the shared level
	int GetLevel()
	{
		return Global.Instance.level + 1;
	}


	//----------------------------------------------------------------------
	// Return the shared hiscore
	int GetHiScore()
	{
		return Global.Instance.hiscore;
	}

}
