
//======================================================================
// GRID GAME:	Global.cs
// 		Code attached to 1st scene for shared variables.
//			Used for:
//				*	All other scenes, scripts that need shared variables.
//======================================================================

using UnityEngine;
using System.Collections;

public class Global : MonoBehaviour 
{
	//======================================================================
	// Variables
	//======================================================================

	// Singleton instance: for shared variables
	//----------------------------------------------------------------------
	public static Global Instance;


	// Public shared Unity constants
	//----------------------------------------------------------------------
	public const bool 	Debug = false;
	public const int 	DebugSpecial = 0;
	public const int 	ModeStandard = 0;
	public const int 	ModeTimed = 1;
	public const int 	ModeRandom = 2;
	public const int 	ModeTut = 3;
	public const int 	TileIdFlip = -100;		// Flip code
	public const int 	TileIdClear = -1;		// Clear code
	public const int 	TileIdGear = -200;		// GEAR code
	public const float 	ScreenRatio = 15;
	public const int 	Levels = 15;
	public const int 	TutorialLevels = 7;


	// Public shared Unity variables
	//----------------------------------------------------------------------
	public int score = 0;					// Final Score
	public int level = 0;					// Final Level
	public int hiscore = 0;					// Final Score
	public int gameMode = 0;				// Mode of the game


	//======================================================================
	// Methods
	//======================================================================

	//----------------------------------------------------------------------
	// Unity Awake method
	// This game object and children survive when loading a new scene.
	void Awake()
	{
		// A singleton to save variables
		Instance = this;
		DontDestroyOnLoad(Instance);
	}


	//----------------------------------------------------------------------
	// Unity Start method
	void Start()
	{
		// Just load the first real scene
		//Application.LoadLevel("sceneStart");
        UnityEngine.SceneManagement.SceneManager.LoadScene("sceneStart");
    }

}
