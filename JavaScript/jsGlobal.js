// GLOBALS!
#pragma strict
//======================================================================
// GRID GAME:
// 		jsGlobal.js
// 		GLOBAL VARIABLES
//======================================================================

// Game mode constants
private var MODE_STANDARD: int = 0;
private var MODE_TIMED: int = 1;
private var MODE_RANDOM: int = 2;
private var MODE_TUT: int = 3;

// Set Global Variables Here
var score : 					int;		// Final Score
var level : 					int;		// Final Level
var hiscore : 					int;		// Final Score

var gameMode : 					int;		// Mode of the game

// Make this game object and all its transform children
// survive when loading a new scene.
function Awake () {
	DontDestroyOnLoad (transform.gameObject);
}

function Start () {
	hiscore = 0;
	score = 0;
	level = 0;
	gameMode = MODE_STANDARD;
}

function Update () {

}
