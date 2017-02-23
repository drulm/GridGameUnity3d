// Scene Lose

#pragma strict
//======================================================================
// GRID GAME:
// 		jsSceneLose.js
// 		Start Page and Menu
//======================================================================
private var globalObject : GameObject;

//======================================================================
// !VARIABLES
//======================================================================
var font : 								Font;
var fontSize  : 						int = 16;
var loadingText : 						GameObject;

var CustomGUISkin : 					GUISkin;

private var _oldWidth : 				float;
private var _oldHeight : 				float;
private var ratio: 						float = 15;

static private var TUTORIAL_LEVELS : 	int	= 7;
static private var LEVELS : 			int = 25;		// Number of levels

function Start () {
    globalObject = GameObject.Find("preGlobal");
}

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
	var endMsg : String;
	
	GUI.skin = CustomGUISkin;

	GUI.skin.label.font = GUI.skin.button.font = GUI.skin.box.font = font;
    GUI.skin.label.fontSize = GUI.skin.box.fontSize = GUI.skin.button.fontSize = fontSize;
    
	// Make a group on the center of the screen
	GUI.BeginGroup(Rect(screenWidth/4, screenHeight/4 + r, screenWidth/2, screenHeight/4 + r*6));
	// Make a box on GUI
	endMsg = "PARLOUR GAME OVER";
	if (GetLevel() >= LEVELS) {
		endMsg = "WELL DONE!";
	}
	GUI.Box(Rect(0, 0, screenWidth/2, r*7), "\n\n" + endMsg
		+ "\nLevel: " + (parseInt(GetLevel()) - TUTORIAL_LEVELS)
		+ "   Score: " + GetScore()
		+ "\nGrand Score: " + GetHiScore()
		);
	// GUI.Box(Rect(0, 0, screenWidth/2, r*5), "End of Game");
	if (GUI.Button(Rect(10, r*4.3, screenWidth/2-20, r), "@Tweet Your Hi-Score!")) {
		Application.OpenURL("http://twitter.com/home?status=Made%20a%20High-Score%20of%20" + GetHiScore() + "%20on%20Clank%20Steampunk%2C%20a%20Cool%20%23Android%20%23Game.%20Available%20at%3A%20https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.AwakeLand.SteamTileInfiniteFree");
	}
	if (GUI.Button(Rect(10, r*5.3, screenWidth/2-20, r), "To Main Menu")) {
		Application.LoadLevel("sceneStart");
	}
	/*if (GUI.Button(Rect(10, r*4, screenWidth/2-20, r), "Game WWW Homepage")) {
		Application.OpenURL("http://awakeland.com");
	}*/
	GUI.EndGroup();
}


//----------------------------------------------------------------------
// Get the score
function GetScore():int {
	return globalObject.GetComponent(jsGlobal).score;
}

//----------------------------------------------------------------------
// Get the level
function GetLevel():int {
	return globalObject.GetComponent(jsGlobal).level + 1;
}

// Get the hiscore
function GetHiScore():int {
	return globalObject.GetComponent(jsGlobal).hiscore;
}


