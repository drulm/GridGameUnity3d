
//======================================================================
// GRID GAME:	SceneStart
// 			Start page and main menu
//======================================================================

using UnityEngine;
//using System.Collections;
using UnityEngine.SceneManagement;

public class SceneStart : MonoBehaviour 
{
	//======================================================================
	// Variables
	//======================================================================

	// Public Unity Variables
	//----------------------------------------------------------------------
	//public bool staticObject;					// Is this coin in motion or not
	public Font font;							// The gui font
	public GameObject loadingText;				// Loading 3d text object
	public bool gameSelectMenu = false;			// 2nd menu, select game type
	public bool mainMenu = true;				// True if main menu is on
	public GUISkin CustomGUISkin;				// The gui skin


	// Private Unity constants
	//----------------------------------------------------------------------
	private const int LevelTest 	= 0;		// For devel. testing levels
	private const int MaxSounds 	= 20;		// Maximum sounds to load


	// Private Variables
	//----------------------------------------------------------------------
	private AudioSource[] myAudio;				// Audio used in start menu scene
	private int fontSize;						// Recalculate font size if resize window		
	private float _oldWidth;					// For recalculating dimensions
	private float _oldHeight;					// For recalculating dimensions


	//======================================================================
	// Methods
	//======================================================================
	
	//----------------------------------------------------------------------
	// Unity Start method
	void Start()
	{
		SetupAudio();							// Load all the audio
	}


	//----------------------------------------------------------------------
	// Unity Update method
	void Update()
	{
		float mn;				// Used for gui resize if needed

		// If gui needs resized
		if (_oldWidth != Screen.width || _oldHeight != Screen.height) 
		{
			_oldWidth = Screen.width;
			_oldHeight = Screen.height;
			mn = Screen.width < Screen.height ? Screen.width : Screen.height;
			fontSize = (int)(mn / Global.ScreenRatio /1.5);
		}

		// Go back if they hit the Android quit button
		if (Input.GetKeyDown(KeyCode.Escape))
		{ 
			Application.Quit();
		}

	}


	//----------------------------------------------------------------------
	// Pull in audio sources
	void SetupAudio()
	{
		int i;
		
		// Pull in all AudioSources from unity
		AudioSource[] aSources = GetComponents<AudioSource>();

		// Setup this routines audio
		myAudio = new AudioSource[MaxSounds];
		for (i=0; i < aSources.Length; i++) 
		{
			myAudio[i] = aSources[i];
		}
	}


	//----------------------------------------------------------------------
	// Unity OnGUI method
	void OnGUI()
	{
		int screenHeight = Screen.height;			// Setup gui height based on screen size
		int r = screenHeight / 10;					// Get width to height ratio
		GameObject loadingMsg;						// The loading message 3d Text

		// Setup Unity gui skin custimization
		GUI.skin = CustomGUISkin;
		GUI.skin.label.font = GUI.skin.button.font = GUI.skin.box.font = font;
		GUI.skin.label.fontSize = GUI.skin.box.fontSize = GUI.skin.button.fontSize = fontSize;

		// Show the main menu, if not in game select sub-menu
		//----------------------------------------------------------------------
		if (mainMenu && !gameSelectMenu)
		{
			// Make a group on the center of the screen
			GUI.BeginGroup(new Rect(r*2, r*3, Screen.width-r, r*8));

			// Make a box on GUI
			if (GetHiScore() > 0)
			{
				GUI.Box(new Rect(0, 0, Screen.width-r*3, r*7.5f), "\n\n\n  Grand Score: " + GetHiScore());
			}
			else 
			{
				GUI.Box(new Rect(0, 0, Screen.width-r*4, r*6.5f), "\n\n\n  Select:");
			}

			// Start game button
			if (GUI.Button(new Rect(r/2, r*3, Screen.width-r*5, r), "Start Game")) 
			{
				myAudio[3].Play();
				gameSelectMenu = true;
				mainMenu = false;
			}

			// End game button
			if (GUI.Button(new Rect(r/2, r*4, Screen.width-r*5, r), "End Game")) 
			{
				Application.Quit();
			}

			// Rate this game button
			if (GUI.Button(new Rect(r/2, r*5, Screen.width-r*5, r), "Rate This!")) 
			{
				myAudio[3].Play();
				Application.OpenURL("market://details?id=com.AwakeLand.SteamTileInfiniteFree");
			}
			/*
			// Row 2 - Social Links
			if (GUI.Button(new Rect(Screen.width-r*9.5f, r*2, r*5, r), "@Tweet!")) 
			{
				myAudio[3].Play();
				Application.OpenURL("http://twitter.com/home?status=Playing%20a%20groovy%20new%20%23Game%20%23App%20(%23free)%20for%20%23Android%2C%20Clank%20%23SteamPunk%20%2C%20Try%20it%20at%20https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.AwakeLand.SteamTileInfiniteFree%20%40AwakeLandGames");
			}
			if (GUI.Button(new Rect(Screen.width-r*9.5f, r*3, r*5, r), "@FB-Share!")) 
			{
				myAudio[3].Play();
				Application.OpenURL("https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.AwakeLand.SteamTileInfiniteFree");
			}
			if (GUI.Button(new Rect(Screen.width-r*9.5f, r*4, r*5, r), "Devel. WWW")) 
			{
				myAudio[3].Play();
				Application.OpenURL("http://awakeland.com");
			}
			*/
			GUI.EndGroup();
		}


		// Select type of new game sub-menu
		//----------------------------------------------------------------------
		if (gameSelectMenu) 
		{
			// Make a group on the center of the screen
			GUI.BeginGroup(new Rect(r*2, r*3, Screen.width-r*2, r*7));

			// Make a box on the GUI
			GUI.Box( new Rect(0, 0, Screen.width-r*4, r*6.5f), "");

			// Pre-made level option
			if (GUI.Button( new Rect(r/2, r*1.4f, Screen.width-r*5, r), "VICTORIAN SET - preset")) 
			{
				myAudio[3].Play();
				SetLevel(Global.TutorialLevels + LevelTest);
				SetMode(Global.ModeStandard);
				loadingMsg = (GameObject)Instantiate(loadingText, new Vector3(-3, 5.5f, -5), Quaternion.identity);
				loadingMsg.GetComponent<TextMesh>().text = "LOADING...";
				//Application.LoadLevel("scene1");
                UnityEngine.SceneManagement.SceneManager.LoadScene("scene1");
            }
			// Random levels option
			if (GUI.Button( new Rect(r/2, r*2.4f, Screen.width-r*5, r), "BAGS OF MYSTERY - random")) 
			{
				myAudio[3].Play();
				SetLevel(Global.TutorialLevels + LevelTest);  
				SetMode(Global.ModeRandom);
				loadingMsg = (GameObject) Instantiate(loadingText, new Vector3(-3, 5.5f, -5), Quaternion.identity);
				loadingMsg.GetComponent<TextMesh>().text = "LOADING...";
				//Application.LoadLevel("scene1");
                UnityEngine.SceneManagement.SceneManager.LoadScene("scene1");
            }
			// Timed levels option
			if (GUI.Button( new Rect(r/2, r*3.4f, Screen.width-r*5, r), "MESMERISM - timed")) 
			{
				myAudio[3].Play();
				SetLevel(Global.TutorialLevels + LevelTest);  
				SetMode(Global.ModeTimed);
				loadingMsg = (GameObject) Instantiate(loadingText, new Vector3(-3, 5.5f, -5), Quaternion.identity);
				loadingMsg.GetComponent<TextMesh>().text = "LOADING...";
				//Application.LoadLevel("scene1");
                UnityEngine.SceneManagement.SceneManager.LoadScene("scene1");
            }
			// Tutorial, removed for now.
			/*
			if (GUI.Button( new Rect(10, r*4.4f, Screen.width-r*4.2f, r), "PRIMER - tutorial")) {
				myAudio[3].Play();
				SetLevel(0);
				SetMode(MODE_STANDARD);
				loadingMsg = Instantiate(loadingText, Vector3(-3, 5.5f, -5), Quaternion.identity);
				loadingMsg.renderer.material.color = Color(0.0f, 0.2f, 0.0f, 1.0f);
				loadingMsg.GetComponent<TextMesh>().text = "LOADING TUTORIAL...";
				SetMode(MODE_TUT);
				Application.LoadLevel("scene1");
			}*/
			// Back to main menu
			if (GUI.Button( new Rect(r/2, r*5.4f, Screen.width-r*5, r), "Return to Main Menu")) 
			{
				myAudio[3].Play();
				gameSelectMenu = false;
				mainMenu = true;
			}
			GUI.EndGroup();
		}
	}


	//----------------------------------------------------------------------
	// Get the hiscore
	int GetHiScore()
	{
		return Global.Instance.hiscore;
	}


	//----------------------------------------------------------------------
	// Set the Level
	void SetLevel(int lvl)
	{
		Global.Instance.level = lvl;
	}


	//----------------------------------------------------------------------
	// Set the Gamemode
	void SetMode(int mode)
	{
		Global.Instance.gameMode = mode;
	}

}
