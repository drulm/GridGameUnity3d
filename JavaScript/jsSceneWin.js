// Scene Lose

#pragma strict
//======================================================================
// GRID GAME:
// 		jsSceneLose.js
// 		Start Page and Menu
//======================================================================

//======================================================================
// !VARIABLES
//======================================================================
var font : 					Font;
var fontSize  : 			int		= 16;
var loadingText : 			GameObject;

var CustomGUISkin : 		GUISkin;

private var _oldWidth: float;
private var _oldHeight: float;
private var ratio: float = 15;

function Start () {
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
	
	GUI.skin = CustomGUISkin;

	GUI.skin.label.font = GUI.skin.button.font = GUI.skin.box.font = font;
    GUI.skin.label.fontSize = GUI.skin.box.fontSize = GUI.skin.button.fontSize = fontSize;
    
	// Make a group on the center of the screen
	GUI.BeginGroup(Rect(screenWidth/4, screenHeight/4 + r, screenWidth/2, screenHeight/4 + r*6));
	// Make a box on GUI
	GUI.Box(Rect(0, 0, screenWidth/2, r*5), "End of Game");
	if (GUI.Button(Rect(10, r, screenWidth/2-20, r), "To Main Page")) {
		Application.LoadLevel("sceneStart");
	}
	if (GUI.Button(Rect(10, r*2, screenWidth/2-20, r), "Game WWW Homepage")) {
		Application.OpenURL("http://awakeland.com");
	}
	GUI.EndGroup();
/*
	var boxStartX = Screen.width / 8.0;
	var boxStartY = Screen.height / 4.0;
	var boxHeight = Screen.height / 2.0;
	var boxWidth = Screen.width * 6.0 / 8.0;
	
	GUI.skin.label.font = GUI.skin.button.font = GUI.skin.box.font = font;
    GUI.skin.label.fontSize = GUI.skin.box.fontSize = GUI.skin.button.fontSize = fontSize;
	// Make a group on the center of the screen
	GUI.BeginGroup(Rect(boxStartX, boxStartY, boxWidth, boxHeight));
	// Make a box on GUI
	GUI.Box(Rect(0, 0, boxWidth, boxHeight), "End of Game");
	if (GUI.Button(Rect(10, 40, boxWidth, 40), "To Main Page")) {
		Application.LoadLevel("sceneStart");
	}
	//if (GUI.Button(Rect(10, 80, screenWidth/2-20, 30), "End Game")) {
	//	Application.Quit();
	//}
	GUI.EndGroup();
	*/
}

