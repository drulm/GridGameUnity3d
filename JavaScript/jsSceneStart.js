// Scene Start

#pragma strict
#pragma downcast

//======================================================================
// GRID GAME:
// 		jsSceneStart.js
// 		Start Page and Menu
//======================================================================
private var globalObject : GameObject;

static var LEVEL_TEST : 	int = 0;			// TEST LEVEL TO START
static var MAX_SOUNDS : 	int = 20;

// Game mode constants
private var MODE_STANDARD: int = 0;
private var MODE_TIMED: int = 1;
private var MODE_RANDOM: int = 2;
private var MODE_TUT: int = 3;

private var myAudio : AudioSource[];

function SetupAudio() {
	var i : int;
	var aSources = GetComponents(AudioSource);
	
	myAudio = new AudioSource[MAX_SOUNDS];
    for (i=0; i < aSources.length; i++) {
    	myAudio[i] = aSources[i];
    }
}

//======================================================================
// !VARIABLES
//======================================================================
var font : 					Font;
var fontSize  : 			int  = 16;
var loadingText : 			GameObject;

var gameSelectMenu : 		boolean = false;
var mainMenu : 				boolean = true;

var CustomGUISkin : 		GUISkin;

static var score : int;

private var _oldWidth: float;
private var _oldHeight: float;
private var ratio: float = 15;

// Start function
function Start () {
	globalObject = GameObject.Find("preGlobal");
	SetupAudio();
}

// Update funtion
function Update () {
	var mn : float;
    if (_oldWidth != Screen.width || _oldHeight != Screen.height) {
        _oldWidth = Screen.width;
        _oldHeight = Screen.height;
        mn = Screen.width < Screen.height ? Screen.width : Screen.height;
        fontSize = mn / ratio;
    }
}

function OnGUI() {
	var screenHeight : int = Screen.height;
	var screenWidth : int = Screen.width;
	var r : int = screenHeight / 10;
	var loadingMsg : GameObject;

	GUI.skin = CustomGUISkin;
	GUI.skin.label.font = GUI.skin.button.font = GUI.skin.box.font = font;
    GUI.skin.label.fontSize = GUI.skin.box.fontSize = GUI.skin.button.fontSize = fontSize;

	if (mainMenu && !gameSelectMenu) {
		// Make a group on the center of the screen
		GUI.BeginGroup(Rect(r*2, r*3, Screen.width-r, r*8));
		// Make a box on GUI
		if (GetHiScore() > 0) {
			GUI.Box(Rect(0, 0, Screen.width-r*3, r*7.5), "\n\n"
				+ "  Grand Score: " + GetHiScore()
				);
			}
		else {
			GUI.Box(Rect(0, 0, Screen.width-r*4, r*6.5), "\n\nWELCOME!");
		}
		if (GUI.Button(Rect(r/2, r*2, Screen.width-r*11, r), "Start Game")) {
			myAudio[3].Play();
			gameSelectMenu = true;
			mainMenu = false;
		}
		if (GUI.Button(Rect(r/2, r*4, Screen.width-r*11, r), "End Game")) {
			//myAudio[3].Play();
			Application.Quit();
		}
		if (GUI.Button(Rect(r/2, r*5, Screen.width-r*11, r), "Rate This!")) {
			myAudio[3].Play();
			Application.OpenURL("market://details?id=com.AwakeLand.SteamTileInfiniteFree");
		}
		// Row 2 - Social Links
		if (GUI.Button(Rect(Screen.width-r*9.5, r*2, r*5, r), "@Tweet!")) {
			myAudio[3].Play();
			Application.OpenURL("http://twitter.com/home?status=Playing%20a%20groovy%20new%20%23Game%20%23App%20(%23free)%20for%20%23Android%2C%20Clank%20%23SteamPunk%20%2C%20Try%20it%20at%20https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.AwakeLand.SteamTileInfiniteFree%20%40AwakeLandGames");
		}
		if (GUI.Button(Rect(Screen.width-r*9.5, r*3, r*5, r), "@FB-Share!")) {
			myAudio[3].Play();
			Application.OpenURL("https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.AwakeLand.SteamTileInfiniteFree");
		}
		if (GUI.Button(Rect(Screen.width-r*9.5, r*4, r*5, r), "Devel. WWW")) {
			myAudio[3].Play();
			Application.OpenURL("http://awakeland.com");
		}
		GUI.EndGroup();
	}

	if (gameSelectMenu) {
		// Make a group on the center of the screen
		GUI.BeginGroup(Rect(r*2, r*3, Screen.width-r*2, r*7));
		// Make a box on GUI
		GUI.Box(Rect(0, 0, Screen.width-r*4, r*6.5), "");
		if (GUI.Button(Rect(r/2, r*1.4, Screen.width-r*5, r), "VICTORIAN SET - preset")) {
			myAudio[3].Play();
			SetLevel(7 + LEVEL_TEST);  // gives + 1 level
			SetMode(MODE_STANDARD);
			loadingMsg = Instantiate(loadingText, Vector3(-3, 5.5, -5), Quaternion.identity);
			loadingMsg.GetComponent.<Renderer>().material.color = Color(0.5, 1.0, 0.5, 1.0);
			loadingMsg.GetComponent(TextMesh).text = "LOADING...";
			Application.LoadLevel("scene1");
		}
		if (GUI.Button(Rect(r/2, r*2.4, Screen.width-r*5, r), "BAGS OF MYSTERY - random")) {
			myAudio[3].Play();
			SetLevel(7 + LEVEL_TEST);  
			SetMode(MODE_RANDOM);
			loadingMsg = Instantiate(loadingText, Vector3(-3, 5.5, -5), Quaternion.identity);
			loadingMsg.GetComponent.<Renderer>().material.color = Color(0.0, 0.2, 0.0, 1.0);
			loadingMsg.GetComponent(TextMesh).text = "LOADING...";
			Application.LoadLevel("scene1");
		}
		if (GUI.Button(Rect(r/2, r*3.4, Screen.width-r*5, r), "MESMERISM - timed")) {
			myAudio[3].Play();
			SetLevel(7 + LEVEL_TEST);  
			SetMode(MODE_TIMED);
			loadingMsg = Instantiate(loadingText, Vector3(-3, 5.5, -5), Quaternion.identity);
			loadingMsg.GetComponent.<Renderer>().material.color = Color(0.0, 0.2, 0.0, 1.0);
			loadingMsg.GetComponent(TextMesh).text = "LOADING...";
			Application.LoadLevel("scene1");
		}
		/*if (GUI.Button(Rect(10, r*4.4, Screen.width-r*4.2, r), "PRIMER - tutorial")) {
			myAudio[3].Play();
			SetLevel(0);
			SetMode(MODE_STANDARD);
			loadingMsg = Instantiate(loadingText, Vector3(-3, 5.5, -5), Quaternion.identity);
			loadingMsg.renderer.material.color = Color(0.0, 0.2, 0.0, 1.0);
			loadingMsg.GetComponent(TextMesh).text = "LOADING TUTORIAL...";
			SetMode(MODE_TUT);
			Application.LoadLevel("scene1");
		}*/
		if (GUI.Button(Rect(r/2, r*5.4, Screen.width-r*5, r), "Return to Main Menu")) {
			myAudio[3].Play();
			gameSelectMenu = false;
			mainMenu = true;
		}
		GUI.EndGroup();
	}
}

// Get the hiscore
function GetHiScore():int {
	return globalObject.GetComponent(jsGlobal).hiscore;
}

// Set the Level
function SetLevel(lvl: int) {
	globalObject.GetComponent(jsGlobal).level = lvl;
}

// Set the Gamemode
function SetMode(mode: int) {
	globalObject.GetComponent(jsGlobal).gameMode = mode;
}

