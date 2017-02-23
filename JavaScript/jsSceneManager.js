// Scene Manager

#pragma strict
#pragma downcast

//======================================================================
// GRID GAME:
// 		jsSceneManager.js
// 		Attached to the camera currently.
//======================================================================

//----------------------------------------------------------------------
@script RequireComponent(AudioSource)

//======================================================================
// !VARIABLES
//======================================================================
private var globalObject : GameObject;

// Game mode constants
private var MODE_STANDARD : 			int 				= 0;
private var MODE_TIMED : 				int 				= 1;
private var MODE_RANDOM : 				int 				= 2;
private var MODE_TUT : 					int 				= 3;

private var START_MUSIC : 				int 				= 17;
private var MAX_VOLUME : 				float 				= 0.2;

// GUI vars
var font : 								Font;
var fontSize  : 						int  				= 16;
var loadingText : 						GameObject;
var CustomGUISkin : 					GUISkin;
var soundOn = true;
var panicButton : 						GameObject;

private var panicMeter: 				int;
private var scrambleMeter: 				int;

private var _oldWidth: 					float;
private var _oldHeight: 				float;
private var ratio: 						float 				= 15;

private var menuOn : 					boolean 			= false;
private var tutorialOn :				boolean			 	= false;
private var levelEndOn : 				boolean 			= false;

private var levelScore : 				int 				= 0;
private var totalGoals : 				int 				= 0;

private var lastLevelName : 			String;

private var timer : 					float 				= 60;

//----------------------------------------------------------------------
// Private Vars
static private var MAX_PANIC : 			int					= 20;
static private var MAX_SCRAMBLE : 		int					= 5;

static private var MAX_SOUNDS : 		int 				= 50;

static private var DEBUG : 				boolean				= false;
static private var DEBUG_SPECIAL : 		int					= 0;

static private var TILEID_FLIP : 		int 				= -100;		// Flip code
static private var TILEID_CLEAR : 		int 				= -1;		// Clear code
static private var TILEID_GEAR : 		int 				= -200;		// GEAR code

static private var TUTORIAL_LEVELS : 	int					= 7;
static private var MAX_COINS : 			int					= 50;
static private var START_COINS : 		int					= 25;
static private var MAX_BOARD_SIZE : 	int					= 8;		// Max size

static private var BOARDCOLORS : 		int					= 9;		// Max colors
static private var rayDistance : 		float 				= 100.0;	// The click-ray distance
static private var MINSHAPESIZE : 		int 				= 3;		// The min match ALGORITHM size
static private var MOVE_DELAY : 		float 				= 0.2;		// Time until another move allowed
static private var NUM_GOALS : 			int					= 6;		// How many goals

static private var comp : 				int[];

private var RandomFlipListX : 			int[];							// Random Flip
private var RandomFlipListY : 			int[];							// Random Flip

// Store levels as characters
static private var LEVELS : 			int 				= 25;		// Number of levels

static private var GOAL_LIMITS : 		int[] 				=			// The set goals
	[
		3,0,0,0,0,0,				// Tutorial Level 1
		3,0,0,0,0,0,				// Tutorial Level 2
		3,0,0,0,0,0,				// Tutorial Level 3
		3,0,0,0,0,0,				// Tutorial Level 4
		3,0,0,0,0,0,				// Tutorial Level 5
		3,0,0,0,0,0,				// Tutorial Level 6
		3,0,0,0,0,0,				// Tutorial Level 7
		6,0,0,0,0,0,				// Level 0
		6,1,0,0,0,0,				// Level 1
		6,0,1,0,0,0,				// Level 2
		5,1,1,0,0,0,				// Level 3 *
		4,2,0,1,0,0,				// Level 4
		3,2,2,0,0,0,				// Level 5
		3,2,0,2,0,0,				// Level 6
		6,3,1,0,0,0,				// Level 7 *
		6,3,2,2,0,0,				// Level 8
		5,1,1,1,0,0,				// Level 9
		5,2,1,0,0,0,				// Level 10 *
		5,4,3,2,1,0,				// Level 11
		6,5,1,0,0,0,				// Level 12
		6,3,1,0,0,0,				// Level 13 *
		6,3,2,0,0,0,				// Level 14
		5,3,1,0,0,0,				// Level 15
		6,3,1,1,0,0,				// Level 16 *
		3,2,1,1,1,0,				// Level 17 *
		1,0,0,0,0,0					// Level 18 *			// Last Level Random
	];
static private var GOAL_RANDOM : 		int[] 				=			// Random goal additions
	[
		0,0,0,0,0,0,				// Tutorial Level 1
		0,0,0,0,0,0,				// Tutorial Level 2
		0,0,0,0,0,0,				// Tutorial Level 3
		0,0,0,0,0,0,				// Tutorial Level 4
		0,0,0,0,0,0,				// Tutorial Level 5
		0,0,0,0,0,0,				// Tutorial Level 6
		0,0,0,0,0,0,				// Tutorial Level 7
		3,2,1,0,0,0,				// Level 0
		3,2,1,0,0,0,				// Level 1
		3,2,1,0,0,0,				// Level 2
		3,2,1,0,0,0,				// Level 3 *
		3,2,1,0,0,0,				// Level 4
		3,2,1,0,0,0,				// Level 5
		3,2,1,0,0,0,				// Level 6
		3,2,1,0,0,0,				// Level 7 *
		3,2,1,0,0,0,				// Level 8
		3,2,1,0,0,0,				// Level 9
		3,2,1,1,0,0,				// Level 10 *
		3,2,1,0,0,0,				// Level 11
		3,2,1,1,0,0,				// Level 12
		3,2,1,0,0,0,				// Level 13 *
		3,2,1,1,0,0,				// Level 14
		3,2,1,1,0,0,				// Level 15
		3,2,2,2,1,1,				// Level 16 *
		3,2,2,2,2,1,				// Level 17 *
		5,4,3,2,1,0					// Level 18 *		// Last Level Random
	];

// How many tile types per level
static private var GOAL_TYPES : 		int[] 				=
	[
		4, 							// Tutorial Level 1
		4, 							// Tutorial Level 2
		4, 							// Tutorial Level 3
		4, 							// Tutorial Level 4
		4, 							// Tutorial Level 5
		5, 							// Tutorial Level 6
		5, 							// Tutorial Level 7
		4, 							// Level 0
		6, 							// Level 1
		4, 							// Level 2
		6, 							// Level 3 *
		5, 							// Level 4
		6, 							// Level 5
		6,							// Level 6
		7,							// Level 7 *
		4,							// Level 8					
		6,							// Level 9
		5,							// Level 10 *
		4,							// Level 11
		7,							// Level 12
		5,							// Level 13 *
		7,							// Level 14
		4,							// Level 15
		5,							// Level 16 *
		9,							// Level 17 *
		9							// Level 18 *
	];
// Map the tiles used per
static private var GOAL_TILE_TYPES : 	int[] 					=
	[
		1,2,3,4,5,6,7,8,9,			// Tutorial Level 1
		1,2,3,4,5,6,7,8,9,			// Tutorial Level 2
		1,2,3,4,5,6,7,8,9,			// Tutorial Level 3
		1,2,3,4,5,6,7,8,9,			// Tutorial Level 4
		1,2,3,4,5,6,7,8,9,			// Tutorial Level 5
		5,6,7,8,9,1,2,3,4,			// Tutorial Level 6
		1,2,3,4,5,6,7,8,9,			// Tutorial Level 7
		1,2,3,4,5,6,7,8,9,			// Level 0
		1,2,3,4,5,6,7,8,9,			// Level 1
		1,2,3,4,5,6,7,8,9,			// Level 2
		8,7,3,4,6,5,1,2,9,			// Level 3 *
		1,2,3,4,5,6,7,8,9,			// Level 4
		7,2,3,4,6,5,1,8,9,			// Level 5
		1,2,3,4,5,6,7,8,9,			// Level 6
		1,2,3,4,5,6,7,8,9,			// Level 7 *
		1,2,3,4,5,6,7,8,9,			// Level 8
		9,8,7,6,5,4,3,2,1,			// Level 9
		1,2,3,4,7,6,5,8,9,			// Level 10 *
		9,7,6,5,4,3,2,1,8,			// Level 11
		1,2,3,4,5,6,7,8,9,			// Level 12
		9,8,7,6,5,4,3,2,1,			// Level 13 *
		9,1,8,2,7,3,6,4,5,			// Level 14
		9,7,6,5,4,3,2,1,8,			// Level 15
		9,8,7,6,5,4,3,2,1,			// Level 16 *
		1,2,3,4,5,6,7,8,9,			// Level 17 *
		1,2,3,4,5,6,7,8,9			// Level 18 *
	];
// Map the tiles used per
static private var LEVEL_SIZE : 		int[] 					=
	[
		8,8,			// Tutorial Level 1
		8,8,			// Tutorial Level 2
		8,8,			// Tutorial Level 3
		8,8,			// Tutorial Level 4
		8,8,			// Tutorial Level 5
		8,8,			// Tutorial Level 6
		5,7,			// Tutorial Level 7
		8,8,			// Level 0
		7,6,			// Level 1
		8,8,			// Level 2
		8,6,			// Level 3 *
		6,8,			// Level 4
		8,7,			// Level 5
		7,8,			// Level 6
		7,8,			// Level 7 *
		8,6,			// Level 8
		7,7,			// Level 9
		4,8,			// Level 10 *
		8,8,			// Level 11
		6,7,			// Level 12
		6,8,			// Level 13 *
		8,7,			// Level 14
		7,8,			// Level 15
		8,6,			// Level 16 *
		8,8,			// Level 17 *
		8,8				// Level 18 *
	];
// Names of the levels
static private var LEVEL_NAME : 		String[] 				=
	[
		"WELCOME!",						// Tutorial Level 1
		"DOWN TILES",					// Tutorial Level 2
		"LEFT TILES",					// Tutorial Level 3
		"RIGHT TILES",					// Tutorial Level 4
		"FLIP BLANK TILES",				// Tutorial Level 5
		"SPECIAL TILES",				// Tutorial Level 6
		"BOARD SIZE",					// Tutorial Level 7
		"CAT-LAP",						// Level 0
		"AFTERNOONIFIED",				// Level 1
		"RHINO",						// Level 2
		"TO THE ELEPHANT",				// Level 3 *
		"BATTY-FANG",					// Level 4
		"BRICKY",						// Level 5
		"BUTTER UPON BACON",			// Level 6
		"DOOR-KNOCKER",					// Level 7 *
		"ENTHUZIMUZZY",					// Level 8
		"FIFTEEN PUZZLE",				// Level 9
		"GAS-PIPES",					// Level 10 *
		"GIGGLEMUG",					// Level 11 Fix this one!
		"PODSNAPPERY",					// Level 12
		"RAIN NAPPER",					// Level 13 *
		"SKILAMALINK",					// Level 14
		"SUGGESTIONIZE",				// Level 15
		"LONDON PARTICULAR",			// Level 16
		"TAKE THE EGG",					// Level 17
		"S.T. INFINITE"					// Level 18	
	];

static private var LEVEL_TEXT : 		String[] 				=
	[								
		"Can you MATCH cubes of the SAME types?\n"				// Tutorial Level 1
			+"Use ARROW buttons\n"
			+"to SLIDE whole ROWS and COLUMNS.\n"
			+"END cubes WRAP around!\n"
			+"After matching UP cubes, those\n"
			+"cubes will slide up one space.\n\n"
			+"NOW, match exactly 3 UP cubes, thrice!"
			,
		"are basically the SAME as UP cubes\n"					// Tutorial Level 2
			+"except matched DOWN cubes\n"
			+"SLIDE DOWN after matches. The\n\n"
			+"GOALS to the right, COUNT MATCHES made.\n\n"
			+"Match exactly 3 DOWN cubes, thrice."
			,									
		"are similar to other arrow cubes\n"					// Tutorial Level 3
			+"except matched LEFT cubes slide left\n"
			+"after a match.\n\n"
			+"When a GOAL on the right, is GREEN,\n"
			+"not RED, the goal is COMPLETE!\n\n"
			+"Match exactly 3 LEFT cubes, three times."
			,								
		"are almost the same as other arrow cubes\n"			// Tutorial Level 4
			+"except matched RIGHT cubes slide right\n"
			+"after a match.\n\n"
			+"Matched cubes can CHANGE the board!\n\n"
			+"Match exactly 3 RIGHT cubes, thrice!"
			,					
		"Clicking MUSTACHE cubes\n"								// Tutorial Level 5	
			+"RESET cubes in a cross pattern.\n\n"
			+"Matched cubes turn into MUSTACHE cubes.\n"
			+"These must be RE-FLIPPED to be REUSED.\n\n"
			+"FLIP ENOUGH rows and columns to match\n"
			+"three cubes thrice to continue!"
			,		
		"Other cubes act DIFFERENTLY when matched.\n\n"			// Tutorial Level 6	
			+"As MORE LEVELS are played,\n"
			+"more cube types are REVEALED!\n\n"
			+"Again, match 3 sets thrice to advance!"
			,					
		"The board DIMENSIONS can change\n"						// Tutorial Level 7
			+"offering UNIQUE challenges!\n\n"
			+"Match 3 sets of 3 cubes to contine."
			,	
		"This is the first level!\n\n"							// Level 1
			+"Try to use as few moves as\n"
			+"possible to match many cubes.\n\n"
			+"Matching 4, 5, cubes and multiple matches\n"
			+"give BONUS coins! Good Luck!\n\n"
			,	
		"","","","","","","","","","","","","","","","","",
		"","","","","","","","","","","","","","","","","",
		"","","","","","","","","","","","","","","","",""
	];
	
// Map the tiles used per
static private var TILE_TYPES_REMOVE : 		int[] =
	[
		1,0,0,0,0,0,0,0,0,			// Tutorial Level 1
		0,1,0,0,0,0,0,0,0,			// Tutorial Level 2
		0,0,0,1,0,0,0,0,0,			// Tutorial Level 3
		0,0,1,0,0,0,0,0,0,			// Tutorial Level 4
		0,0,0,0,0,0,0,0,0,			// Tutorial Level 5
		1,1,1,0,1,1,1,1,1,			// Tutorial Level 6
		1,1,1,0,1,1,1,1,1,			// Tutorial Level 7
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1
	];	
	
	
//----------------------------------------------------------------------
// Inspector Vars
static var boardWidth : 		int					= 8;		// Board size init. Can change.
static var boardLength : 		int					= 8;
static var MAX_WIDTH : 			int					= 8;		// Board size
static var MAX_LENGTH : 		int					= 8;

var tilesTypesLevel : 			int;							// Num of tile types per level

var tile : 						GameObject;						// The game tile
var button : 					GameObject;						// The button Unity object
var colorRange : 				Color[];						// The colors of tiles

var background : 				GameObject;						// The game tile

var coin : 						GameObject;						// The game coin
var sparks : 					GameObject;						// Sparks
var lightningBall : 			GameObject;						// Lightning Ball
var lightningStrike : 			GameObject;						// Lightning Ball

var buttonDraw : 				GameObject[];					// The buttons as drawn
/*
var buys : 						int[];							// List of stuff to buy
var buysObjects : 				GameObject[];					// The game buy objects
var buySize :					int;							// The size of stuff to buy
*/
var goal : 						GameObject;						// Tile goal object

var goalId : 					int[];
var tileGoal : 					GameObject[];					// The tile goal object array
var tileGoalCount : 			GameObject[];					// The tile goal object array
var goalCount :	 				int;							// How many completed goals

var coinList : 					GameObject[];					// All the coins
var coinListSize : 				int;							// Current number of coins / moves

var levelGoalMax : 				int[];							// Max level goals + Rnd
var scoreLevels : 				int[];							// The level goals
var scoreRank : 				int[];							// The per goal count

var boardDraw : 				GameObject[ , ];				// The game board drawn
var boardId :					int[ , ];						// The game tile as grid
var boardIdMatch :				int[ , ];						// Save tileID when matched
var vMatch :					int[ , ];						// Vertical match grid
var hMatch :					int[ , ];						// Horizontal match grid

var matchCode :					int[ , ];						// Encode the matches
var matchCount : 				int;							// The current count of matches
var prevMatchCount : 			int;							// The current count of matches

private var score : 			int;							// Yep the score
var coins : 					int;							// Current number of coins / moves
var coinsPrev : 				int;							// Prev number of coins / moves
var scoreDisp : 				int;							// Displayed score
var coinsDisp : 				int;							// Displayed coins
var level : 					int;							// Current Level

var mode : 						int;							// type of game.

var coinText : 					GameObject;						// The score 3d Text
var scoreText : 				GameObject;
var levelText : 				GameObject;
var nameText :					GameObject;
var percentText : 				GameObject;
var timerText : 				GameObject;
//var ratingText : 				GameObject;

var lastClickedX : 				int;							// Save last clicked X,Y and button Pos
var lastClickedY : 				int;
var lastClickedH : 				int;
var lastClickedV : 				int;

var startMoveTime : 			float;							// How much time passed since last move?
var newFlips : 					boolean;						// If any flipped this move
var userClicked : 				boolean;						// User clicked a command

var cubeMaterials : 			Material[];						// Materials for the cube
var cubeMaterialClear : 		Material;
var cubeMaterialBlank : 		Material;
var cubeMaterialGear : 			Material;

var buttonMaterial : 			Material;						// Material for button

// Share the screen
var originPosition:Vector3;
var originRotation:Quaternion;
var shake_decay: float;
var shake_intensity: float;

//======================================================================
// !AUDIO FUNCTIONS
//======================================================================
// Audio files
/*private var audio1: AudioSource;		// BikeChain
private var audio2: AudioSource;		// BlenderHand
private var audio3: AudioSource;		// CoinDrop
private var audio4: AudioSource;		// CoinsDropping
private var audio5: AudioSource;		// MetalAmbientLoop1
private var audio6: AudioSource;		// MetalGears
private var audio7: AudioSource;		// MetalGears2
private var audio8: AudioSource;		// SwitchPushButtonOld
private var audio9: AudioSource;		// TypeWriter1
private var audio10: AudioSource;		// TypeWriterBell
private var audio11: AudioSource;		// TypeWriterFF
private var audio12: AudioSource;		// VinyleRecordEndNeedle
private var audio13: AudioSource;		// GUI Beep 1
*/
private var myAudio : AudioSource[];
private var music1 : AudioSource;
private var music2 : AudioSource;
private var musicFlip : boolean;

//----------------------------------------------------------------------
// Get Audio, load more as needed - kludge
function SetupAudio() {
	var i : int;
	var aSources = GetComponents(AudioSource);
    for (i=0; i < aSources.length; i++) {
    	myAudio[i] = aSources[i];
    }
    //print("AUDIO LENGTH: " + aSources.length);
}

//======================================================================
// !START AND !UPDATE
//======================================================================

//----------------------------------------------------------------------
// Unity Start function
function Start() {
	// Get the global object for global vars
    globalObject = GameObject.Find("preGlobal");
   	//globalObject.GetComponent(jsGlobal).score = 300;
   	//score = globalObject.GetComponent(jsGlobal).score;

	// Setup score levels
	scoreLevels = new int[NUM_GOALS];		// Create the score level array
	levelGoalMax = new int[NUM_GOALS];		// Create the score level array
	scoreRank = new int[NUM_GOALS];			// Need to bootstrap everything else
	// @TODO SETLEVEL
	level = GetLevel();						// Load the level 1st
	mode = GetGameMode();					// Load the game mode
	if (mode == MODE_STANDARD) {
		level = TUTORIAL_LEVELS;
	}
	
	LoadClankLevel(level);
	SetupDynamicArrays();					// Setup all dynamic arrays
	//SetupGameColors();					// Set the game colors
	CreateBoard();							// Create the board mainly
	CreateButtons();						// Create the buttons
	SetupButtonsLevel();					// Fix display of buttons
	CreateTileGoals();						// Create Tile Goals
											// Clear out the matches
	ClearIntBoard(matchCode, TILEID_CLEAR, MAX_WIDTH, MAX_LENGTH);		
	FindAllMatches();
	SetLastClickedXYHV(-1, -1, -1, -1);		// Init the last clicked global vars
	startMoveTime = Time.time;				// Init the time for move updates
	userClicked = false;
	NewGameScoreSetup();
	UpdateCoins();
	UpdateScore();
	UpdateLevel();
	CreateCoins();
	SetupAudio();
	if (DEBUG) {
		print("Start of Game ");
		print('==============');
		PrintBoard(boardId);
		print('==============');
	}
	yield WaitForSeconds(1);
	RemoveTiles();							// Remove tile types by level
	
	panicButton.GetComponent.<Renderer>().enabled = false;
	
	// Setup the music to fade in and out
	music1 = myAudio[START_MUSIC];
	music1.Play();
	music1.enabled = true;
    music1.volume = MAX_VOLUME;
    music2 = myAudio[START_MUSIC];
	music2.enabled = true;
    music2.volume = MAX_VOLUME;
	musicFlip = false;
	
	// Update the background color
	background.GetComponent.<Renderer>().material.color = Color(
		(level + Random.Range(0, 3)) % 5 / 10.0, 
		(level + Random.Range(0, 4)) % 4 / 8.0, 
		(level + Random.Range(0, 5)) % 3 / 6.0,
		 1.0);
}

//----------------------------------------------------------------------
// Setup all Dynamic memory / arrays
function SetupDynamicArrays() {
	// Creates the object array
	boardDraw = new GameObject[MAX_BOARD_SIZE, MAX_BOARD_SIZE];
	boardId = new int[MAX_BOARD_SIZE, MAX_BOARD_SIZE];
	boardIdMatch = new int[MAX_BOARD_SIZE, MAX_BOARD_SIZE];				// Setup the match 2d arrays
	matchCode = new int[MAX_BOARD_SIZE, MAX_BOARD_SIZE];
	vMatch = new int[MAX_BOARD_SIZE, MAX_BOARD_SIZE];
	hMatch = new int[MAX_BOARD_SIZE, MAX_BOARD_SIZE];
	coinList = new GameObject[MAX_COINS];								// Setup the coins array
	buttonDraw = new GameObject[MAX_BOARD_SIZE + MAX_BOARD_SIZE];		// Setup button arrays
	tileGoal = new GameObject[NUM_GOALS];								// Setup goal objects
	tileGoalCount = new GameObject[NUM_GOALS];
	goalId = new int[NUM_GOALS];
	
	RandomFlipListX = new int[MAX_BOARD_SIZE * MAX_BOARD_SIZE + 1];
	RandomFlipListY = new int[MAX_BOARD_SIZE * MAX_BOARD_SIZE + 1];
	
	myAudio = new AudioSource[MAX_SOUNDS];
	
	comp = new int[MAX_BOARD_SIZE];
	
//	colorRange = new Color[BOARDCOLORS + 1];							// Setup color arrays
//	buySize = 10;														// Setup buy arrays
//	buys = new int[buySize];
//	buysObjects = new GameObject[buySize];
}

//----------------------------------------------------------------------
// Setup starting scores and coins
function NewGameScoreSetup() {
	//score = 0;								// Score setup
	coins = START_COINS;
	coinsPrev = coins;
	coinListSize = coins;
	scoreDisp = 0;
	coinsDisp = coins;
}


//----------------------------------------------------------------------
//----------------------------------------------------------------------
// Unity: Update function
function Update() {
	var i : int;
// Gui stuff
	var mn : float;
    if (_oldWidth != Screen.width || _oldHeight != Screen.height) {
        _oldWidth = Screen.width;
        _oldHeight = Screen.height;
        mn = Screen.width < Screen.height ? Screen.width : Screen.height;
        fontSize = mn / ratio;
    }
    
	if (panicMeter > MAX_PANIC && coins <= 5) {					// Turn the panic button on
		panicButton.GetComponent.<Renderer>().enabled = true;
	}
	else {
		panicButton.GetComponent.<Renderer>().enabled = false;
	}
    
    // Decrease the timer.
    timer -= Time.deltaTime;

	CheckMouse();
	newFlips = true;						// Keep flipping tiles until cannot flip any.
	while (newFlips) {
		ScoreTiles();
		CheckLevelUp();
		CheckGameOver();
		CheckMoveAfterMatches();			//FillNewTiles();
		newFlips = CheckAnyMatch();
	}
	
	if (shake_intensity > 0){
      transform.position = originPosition + Random.insideUnitSphere * shake_intensity;
      transform.rotation = Quaternion(
      originRotation.x + Random.Range(-shake_intensity,shake_intensity)*.2,
      originRotation.y + Random.Range(-shake_intensity,shake_intensity)*.2,
      originRotation.z + Random.Range(-shake_intensity,shake_intensity)*.2,
      originRotation.w + Random.Range(-shake_intensity,shake_intensity)*.2);
      shake_intensity -= shake_decay;
   }
}

function Shake(si: float, sd: float){
   originPosition = transform.position;
   originRotation = transform.rotation;
   shake_intensity = si;
   shake_decay = sd;
}

//----------------------------------------------------------------------
// GUI!
//----------------------------------------------------------------------
// Unity: OnGUI Function
function OnGUI() {
	var endScore : String = '';
	var numStars : float = 0;
	var i : int;
	var t : float = parseInt(timer * 100.0) % 100 / 100.0;

	UpdateCoins();
	UpdateScore();
	UpdateTimer();
	UpdatePercent();
	UpdateLevel();
	UpdateAllScores();								// Updates all the goals
	
	// This is the GUI setup.
	var screenHeight : int = Screen.height;
	var screenWidth : int = Screen.width;
	var r : int = screenHeight / 10;
	var loadingMsg : GameObject;
	var soundState : String = soundOn ? "ON" : "OFF";
	var levelName : String;
	
	GUI.skin = CustomGUISkin;
	GUI.skin.label.font = GUI.skin.button.font = GUI.skin.box.font = font;
    GUI.skin.label.fontSize = GUI.skin.box.fontSize = GUI.skin.button.fontSize = fontSize;

	// LevelEnd Menu
	if (mode != MODE_TIMED) {
		if (levelEndOn && level > TUTORIAL_LEVELS) {
			numStars = 6.0 * totalGoals / levelScore;
			if (numStars > 5) {
				numStars = 5;
			}
			if (numStars < 1) {
				numStars = 1;
			}
			for (i=0; i < numStars; i++) {
				endScore += '(X)';
			}
			levelName = LEVEL_NAME[level];
			if (mode == MODE_RANDOM) {					// End of level for Random
				lastLevelName = "Random Scenario #" + (level - TUTORIAL_LEVELS);
				levelName = "Random Scenario #" + (level - TUTORIAL_LEVELS + 1);
			}
	
			GUI.BeginGroup(Rect(r*3, r*1, screenWidth-r*3, r*6));
			nameText.GetComponent.<Renderer>().material.color = Color(t, 1.0, 1.0 - t, 1.0);
			nameText.GetComponent(TextMesh).text = "Rating: " + endScore;
			GUI.Box(Rect(0, r, screenWidth-r*6, r*5 + 10), "\n\nfor: " + lastLevelName);
			if (GUI.Button(Rect(r/2, r*3, screenWidth-r*7, r*3), "Start: " + levelName)) {
				levelEndOn = false;
				coins += parseInt(numStars) * 2;
				levelScore = 0;
				myAudio[12].Play();
			}
			GUI.EndGroup();
		}
		else {
			UpdateLevelName();
			levelEndOn = false;
		}
	}
	else {
		levelEndOn = false;				// It should not be on!
	}

	// Tutorial Menu
	if (tutorialOn) {
		GUI.BeginGroup(Rect(r, r, screenWidth, screenHeight-r));
		GUI.Box(Rect(0, 0, screenWidth-r*2, screenHeight-r*2), "\n\n" + LEVEL_TEXT[level]);
		if (GUI.Button(Rect(10, screenHeight-r*3-20, screenWidth-r*2-20, r), "BEGIN!")) {
			myAudio[12].Play();
			tutorialOn = false;
		}
		GUI.EndGroup();
	}

	// In game menu
	if (menuOn) {
		GUI.BeginGroup(Rect(screenWidth/4, screenHeight/4 + r, screenWidth/2, screenHeight/4 + r*8));
		GUI.Box(Rect(0, 0, screenWidth/2, r*6), "\n\nIn Game Options");
		if (GUI.Button(Rect(10, r*2, screenWidth/2-20, r), "Return to Game")) {
			myAudio[12].Play();
			menuOn = false;
		}
		if (GUI.Button(Rect(10, r*3, screenWidth/2-20, r), "Sound [" + soundState + "]")) {
			myAudio[12].Play();
			soundOn = ! soundOn;
			if (!soundOn) {
				 AudioListener.pause = true;
			}
				else {
				 AudioListener.pause = false;	
			}
		}
		if (GUI.Button(Rect(10, r*4, screenWidth/2-20, r), "Quit to Main Menu")) {
			myAudio[12].Play();
			soundOn = true;
			AudioListener.pause = false;
			//globalObject.GetComponent(jsGlobal).score = score;
			SetGlobals();
			Application.LoadLevel("sceneStart");
		}
		GUI.EndGroup();
	}
	
	// This is the small in game menu button
	GUI.BeginGroup(Rect(screenWidth - r*3, screenHeight - r, r*3, r));
	GUI.Box(Rect(0, 0, r*3, r), "");
	if (GUI.Button(Rect(0, 0, r*3, r), "Menu")) {
		menuOn = true;
		myAudio[12].Play();
	}
	GUI.EndGroup();
}

//----------------------------------------------------------------------
// Remove tiles as per the level!
// @todo GOGO
function RemoveTiles() {
	var x : 				int;		// Index the grid by x
	var y : 				int;		// Index the grid by y
	for (x=0; x < boardWidth; x++) {
		for (y = 0; y < boardLength; y++) {				// Check for any objects moving
			if (boardId[x, y] >= 1 && boardId[x, y] <= 9) {
				if (! MapRemoveTilesByLevel(boardId[x, y])) {
					SetTileColorId(x, y, TILEID_CLEAR);
				}
			}
		}
	}
}

//----------------------------------------------------------------------
// Map tile by level tile mapping array
function MapRemoveTilesByLevel(id:int) {
	return TILE_TYPES_REMOVE[level * 9 + (id - 1)];
}

//======================================================================
// !AUX FUNCTIONS
//======================================================================

//----------------------------------------------------------------------
// Out of Moves and or Coins?
/// @todo Add Delay
function CheckGameOver() {
	var t : float = parseInt(timer * 100.0) % 100 / 100.0;
	if (coins <= 0) {								// If no more coins, game is over.
		nameText.GetComponent.<Renderer>().material.color = Color(1.0, 1.0 - t, t, 1.0);
		nameText.GetComponent(TextMesh).text = "Out of Moves!";
		SetGlobals();
		yield WaitForSeconds(3);
		Application.LoadLevel("sceneLose");
	}
	if (mode == MODE_TIMED && timer <= 0) {								// If no more timer, game is over.
		nameText.GetComponent.<Renderer>().material.color = Color(1.0, t, 1.0 - t, 1.0);
		nameText.GetComponent.<Renderer>().material.color = Color();
		nameText.GetComponent(TextMesh).text = "Out of Time!";
		SetGlobals();
		yield WaitForSeconds(3);
		Application.LoadLevel("sceneLose");
	}
}

//----------------------------------------------------------------------
// Load next level?
function CheckLevelUp() {
//	if (GoalsFinished() || (TutGoalsFinished() && level < TUTORIAL_LEVELS)) {
	if (GoalsFinished()) {							// Load new level unless out of levels
		if (level >= LEVELS + 1) {
			//globalObject.GetComponent(jsGlobal).score = score;
			SetGlobals();
			yield WaitForSeconds(3);
			Application.LoadLevel("sceneLose");
		} else {
			lastLevelName = LEVEL_NAME[level];
			if (level < LEVELS) {					// Last level goes random
				level++;
			}
			ClearAllTile();							// Clear all the tile out
			LoadClankLevel(level);
			ClearIntBoard(boardId, TILEID_FLIP, boardWidth, boardLength);
			SetupButtonsLevel();					// Setup the buttons per level
			if (level > TUTORIAL_LEVELS) {
				// coins += level / 4;
			}
			else {
				coins = START_COINS;				// reset the number of  coins during tutorial
				score = 0;							// reset the score!
				scoreDisp = 0;						// and the scoreDisplay
			}

			menuOn = false;
			levelEndOn = true;
			Shake(0.03, 0.001);
			
			if (!musicFlip) {
				music2 = myAudio[START_MUSIC + level % 14];
				music2.Play();
				music2.volume = MAX_VOLUME;
				StartCoroutine(FadeOut(6, music1));
			}
			else {
				music1 = myAudio[START_MUSIC + level % 14];
				music1.Play();
				music1.volume = MAX_VOLUME;
				StartCoroutine(FadeOut(6, music2));
			}
			musicFlip = !musicFlip;
			
			//yield WaitForSeconds(1);
			RemoveTiles();
			//yield WaitForSeconds(2);
		}
	}
}

function FadeOut(seconds : float, a : AudioSource)
{
    var initialVolume:float = a.volume;
    var t=0.0f;
    while(t < 1.0)
    {
        //Debug.Log(""+t);
        t += Time.deltaTime/seconds;
        a.volume = Mathf.Lerp(initialVolume, 0, t);
        yield ;
    }
}

//======================================================================
// !MOVE FUNCTIONS
//======================================================================

//----------------------------------------------------------------------
// Move a vertical col to up with wraparound
function MoveVertical(col: int) {
	var i: 				int;							// Loop veriable
	var lastTile:		int				= boardId[boardWidth - 1, col];
	var lastDraw:		GameObject		= boardDraw[boardWidth - 1, col];
	
	for (i = boardWidth - 1 ; i >= 1; i--) {			// Shift the ID array
		boardId[i, col] = boardId[i - 1, col];
		boardDraw[i, col] = boardDraw[i - 1, col];
	}
	boardId[0, col] = lastTile;							// Handle the 1st tile and last tile
	boardDraw[0, col] = lastDraw;
	for (i = 0 ; i < boardWidth; i++) {					// Move the Unity tiles, no animation for now.
		UpdateTileName(boardDraw, i, col);
		if (DEBUG) {
			print("=|=-|-=|=-> " + Vector3(col, i, col) + ' | ' + boardDraw[i, col].transform.name);
		}
	}
}

//----------------------------------------------------------------------
// Reverse Move a vertical col to up with wraparound
function MoveVerticalReverse(col: int) {
	var i: 				int;					// Loop veriable
	var lastTile:		int				= boardId[0, col];
	var lastDraw:		GameObject		= boardDraw[0, col];
	
	for (i = 0 ; i < boardWidth - 1; i++) {			// Shift the ID array
		boardId[i, col] = boardId[i + 1, col];
		boardDraw[i, col] = boardDraw[i + 1, col];
	}
	boardId[boardWidth - 1, col] = lastTile;			// Handle the 1st tile and last tile
	boardDraw[boardWidth - 1, col] = lastDraw;
	for (i = 0 ; i < boardWidth; i++) {				// Move the Unity tiles, no animation for now.
		UpdateTileName(boardDraw, i, col);
		if (DEBUG) {
			print("-> " + Vector3(col, i, col) + ' | ' + boardDraw[i, col].transform.name);
		}
	}
}

//----------------------------------------------------------------------
// Move a vertical col to up with wraparound
function MoveHorizontal(row: int) {
	var i: 				int;					// Loop veriable
	var lastTile:		int				= boardId[row, boardLength - 1];
	var lastDraw:		GameObject		= boardDraw[row, boardLength - 1];
	
	for (i = boardLength - 1 ; i >= 1; i--) {			// Shift the ID array
		boardId[row, i] = boardId[row, i - 1];
		boardDraw[row, i] = boardDraw[row, i - 1];
	}
	boardId[row, 0] = lastTile;							// Handle the 1st tile and last tile
	boardDraw[row, 0] = lastDraw;
	for (i = 0 ; i < boardLength; i++) {				// Move the Unity tile names
		UpdateTileName(boardDraw, row, i);
		if (DEBUG) {
			print("-> " + Vector3(row, i, 1) + ' | ' + boardDraw[row, i].transform.name);
		}
	}
}

//----------------------------------------------------------------------
// Reverse Move a vertical col to up with wraparound
function MoveHorizontalReverse(row: int) {
	var i: 				int;					// Loop veriable
	var lastTile:		int				= boardId[row, 0];
	var lastDraw:		GameObject		= boardDraw[row, 0];
	
	for (i = 0 ; i < boardLength - 1; i++) {			// Shift the ID array
		boardId[row, i] = boardId[row, i + 1];
		boardDraw[row, i] = boardDraw[row, i + 1];
	}
	boardId[row, boardLength - 1] = lastTile;			// Handle the 1st tile and last tile
	boardDraw[row, boardLength - 1] = lastDraw;
	for (i = 0 ; i < boardLength; i++) {				// Move the Unity tile names
		UpdateTileName(boardDraw, row, i);
		if (DEBUG) {
			print("-> " + Vector3(row, i, 1) + ' | ' + boardDraw[row, i].transform.name);
		}
	}
}

//----------------------------------------------------------------------
// Check if anything is still moving
function movingObjects() {
	var x : 				int;		// Index the grid by x
	var y : 				int;		// Index the grid by y
	for (x=0; x < boardWidth; x++) {
		for (y = 0; y < boardLength; y++) {				// Check for any objects moving
			if (! boardDraw[x, y].GetComponent(jsCube).staticObject) {
				return true;
			}
		}
	}
	return false;
}

//----------------------------------------------------------------------
// Check if anything is still moving
function coinsMoving() {
	var x : 				int;						// Index the grid by x
	var y : 				int;						// Index the grid by y
	for (x=0; x < coinListSize; x++) {					// Check if any coins moving
		if (! coinList[x].GetComponent(jsCoins).staticObject) {
			return true;
		}
	}
	return false;
}


//======================================================================
// !SCORE AND !CLEANUP?
//======================================================================

//----------------------------------------------------------------------
// Score tiles
function ScoreTiles() {
	var areWeMoving : 		boolean;		// Are any tiles in motion?
	var m : 				int;			// Index the new matches
	var x : 				int;			// Index the grid by x
	var y : 				int;			// Index the grid by y
	var exitLoop : 			boolean;		// Time to exit out of inner 2 loops
	var multiple : 			int;			// Multiple match count
	var i : 				int;
	
	multiple = 0;											// No multiple matches yet
	areWeMoving = movingObjects();							// Get info, is anything moving?
	if (!areWeMoving) {										// If not, then can check to score tiles
		if (!IsEmpty2dIntArrayIf(matchCode)) {
			for (m = prevMatchCount; m < matchCount; m++) {
				exitLoop = false;
				for (x = 0; x < boardWidth && !exitLoop; x++) {
					for (y = 0; y < boardLength && !exitLoop; y++) {
						// We found a match
						if (matchCode[x, y] == m) {				
							exitLoop = true;				// Do our thing and get out of this loop
							UpdateMatchGoals(m, x, y);		// Update our match goals and text
							multiple++;						// Add 1 to the multiple
							score += 1;
							panicMeter += 1;
							myAudio[13 + score % 4].Play();	// Play sound modulo 4
							scrambleMeter = MAX_SCRAMBLE + Random.Range(0,5);
							scoreDisp = score;
							
							if (boardId[x, y] == -4) {		// Special effect for >=3 for tile type
								CreateLightningBall(x,y);
							}
							if (boardId[x, y] == -5) {		// Special effect for >=3 for tile type
								CreateLightningStrike(x,y);
							}

							// Try to move tile based on match tile
							if (boardId[x, y] <= -3) {		// Special effect for >=3 for tile type
								if (DEBUG) {
									print('====>>>////////////////////////////////');
									PrintBoard(boardIdMatch);
									print('====>>>////////////////////////////////');
								}
								MoveOnTile(boardIdMatch[x,y], m);
								//CreateSparks(x, y);
							}							
						}
					}
				}
			} // for (m = prevMatchCount; m < matchCount; m++) {
			Set2dIntArrayIf(matchCode, m, 0);		// Clear the matched code from the matchCode array
			// *** Score for multiples ***
			if (multiple > 1) {								// We have multiple matches
				var scoreIdx = multiple + 1;				// Handle +3, +4, +5 sized matches at scoreLevels[0], [1], [2]
				// The match score is greater than zero, so subtract 1
				multiple = multiple > 3 ? 3 : multiple;		// Multiple maxes out at triples
				score += 3 * multiple;
				scrambleMeter = MAX_SCRAMBLE + Random.Range(0,5);
				panicMeter += 3 * multiple;
				scoreDisp = score;
				coins += multiple;
				if (scoreIdx >= NUM_GOALS) {
					scoreIdx = NUM_GOALS - 1;
				}
				scoreRank[scoreIdx]++;
				if (scoreLevels[scoreIdx] > 0) {
					scoreLevels[scoreIdx]--;				// One less goal
					UpdateScore();							// Update the count of things completed
				} // Multiples are here
				if (DEBUG || DEBUG_SPECIAL == 1) {
					print("UPDATE MULTIPLE SCORE: at " + scoreIdx + " = " + scoreLevels[scoreIdx]);
				}
				// Zap multiples!
				CreateLightningStrike(5,5);
				CreateLightningStrike(10,10);
				CreateLightningStrike(10,0);
				CreateLightningBall(5,5);
			} // if (multiple > 1) {
		} // if (!IsEmpty2dIntArrayIf(matchCode)) {
		ClearIntBoard(matchCode, 0, MAX_WIDTH, MAX_LENGTH);						// Clear all the matches!
		if (coins - 10 > coinsPrev) {						// Max the coins
			coins = coinsPrev + 10;
		}
	} // if (!areWeMoving) {
}

//----------------------------------------------------------------------
// Move on tile type direction and special moves
function MoveOnTile(id: int, m :int) {
	if (DEBUG) {
		print("***MOVING!!!: " + id);
	}
	if (id == 0) {
		MoveOnMatches(m, "down");
	}
	else if (id == 1) {
		MoveOnMatches(m, "up");
		myAudio[9].Play();
	}
	else if (id == 2) {
		MoveOnMatches(m, "down");
		myAudio[9].Play();
	}
	else if (id == 3) {
		MoveOnMatches(m, "left");
		myAudio[9].Play();
	}
	else if (id == 4) {
		MoveOnMatches(m, "right");
		myAudio[9].Play();
	}
	else if (id == 5) {
		MoveOnMatches(m, "light");
		myAudio[7].Play();
	}
	else if (id == 6) {
		MoveOnMatches(m, "eye");
		myAudio[9].Play();
	}
	else if (id == 7) {
		MoveOnMatches(m, "gear");
		myAudio[6].Play();
	}
	else if (id == 8) {
		coins--;
		MoveOnMatches(m, "skull");
		myAudio[0].Play();
	}
	else if (id == 9) {
		MoveOnMatches(m, "magnet");
		myAudio[5].Play();
	}
}

//----------------------------------------------------------------------
// Move in some pattern based on matches.
function MoveOnMatches(m:int, op:String) {
	var x : 				int;			// Index the grid by x
	var y : 				int;			// Index the grid by y
	var move_index : 		int;			// Index we moved
	if (DEBUG) {
		print("1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-");
		PrintBoard(matchCode);
		print("1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-");
	}
	move_index = -1;
	for (x = 0; x < boardWidth; x++) {
		for (y = 0; y < boardLength; y++) {
			if (matchCode[x,y] == m && move_index != x) {
				if (op == "down") {
					MoveHorizontalReverse(x);
					move_index = x;
				}
				else if (op == "up" && move_index != x) {
					MoveHorizontal(x);
					move_index = x;
				}
				else if (op == "right" && move_index != y) {
					MoveVerticalReverse(y);
					move_index = y;
				}
				else if (op == "left" && move_index != y) {
					MoveVertical(y);
					move_index = y;
				}
				else if (op == "eye") {
					FlipSurround(m,x,y);
				}
				else if (op == "gear") {
					MoveGear();
				}
				else if (op == "light") {
					MoveLight();
				}
				else if (op == "skull") {
					MoveSkull();
				}
				else if (op == "magnet") {
					// Just move some things somewhat. Makes no sense but changes board.
					MoveVerticalReverse(y);
					MoveHorizontalReverse(x);
				}
			}
		}
	}
	// Flip back the middle of the eye tiles
	for (x = 0; x < boardWidth; x++) {
		for (y = 0; y < boardLength; y++) {
			if (matchCode[x,y] == m && move_index != x) {
				if (op == "eye") {
					boardId[x,y] = -3;
				}
			}
		}
	}
}

//----------------------------------------------------------------------
// Restore all the other flipped tiles.
function MoveSkull() {
	var c : 				int = Random.Range(1,3);	// The number of flips
	var i : int; 										// Loop var
	// Set a random tile to -3 so it will flip to clear, no coins scored.
	for (i=0; i<c; i++) {
		boardId[Random.Range(0,boardWidth), Random.Range(0,boardLength)] = -3;
	}
}

//----------------------------------------------------------------------
// Restore all the other flipped tiles.
function MoveLight() {
	var x : 				int;			// Index the grid by x
	var y : 				int;			// Index the grid by y
	for (x = 0; x < boardWidth; x++) {
		for (y = 0; y < boardLength; y++) {
			if (boardId[x, y] == TILEID_CLEAR) {
				boardId[x, y] = TILEID_FLIP;
			}
		}
	}
}

//----------------------------------------------------------------------
// Flip all tiles surrounding a location
function FlipSurround(m:int, i:int, j:int) {
	boardId[(i+boardWidth-1)%boardWidth, (j+boardLength-1)%boardLength] = TILEID_FLIP;
	boardId[(i+boardWidth-1)%boardWidth, j] = TILEID_FLIP;
	boardId[(i+boardWidth-1)%boardWidth, (j+1)%boardLength] = TILEID_FLIP;
	boardId[i, (j+boardLength-1)%boardLength] = TILEID_FLIP;
	boardId[i, (j+1)%boardLength] = TILEID_FLIP;
	boardId[(i+1)%boardWidth, (j+boardLength-1)%boardLength] = TILEID_FLIP;
	boardId[(i+1)%boardWidth, j] = TILEID_FLIP;
	boardId[(i+1)%boardWidth, (j+1)%boardLength] = TILEID_FLIP;
}

//----------------------------------------------------------------------
// Criss Cross
function MoveGear() {
	MoveHorizontal(0);
	MoveVertical(boardLength - 1);
	MoveHorizontalReverse(boardWidth - 1);
	MoveVerticalReverse(0);
}


//----------------------------------------------------------------------
// Update the matching goals
function UpdateMatchGoals(m:int, x:int, y:int) {
	var matchSize : int = -boardId[x,y];					// Get the size of the match (stored as a negative size
	var scoreIdx : int = matchSize - 3;					// Handle +3, +4, +5 sized matches at scoreLevels[0], [1], [2]
	if (DEBUG || DEBUG_SPECIAL == 1) {
		print("!Match************* m:" + m + " x:" + x + " y:" + y + " matchSize:" + matchSize);
		PrintBoard(boardId);
		print("scoreIdx: " + scoreIdx);
		print("!******************");
	}
	//coins += parseInt(Mathf.Abs(scoreIdx)) + 1;
	if (scoreIdx >= 0 && scoreIdx < NUM_GOALS) {
		coins += scoreIdx + 1;
		scoreRank[scoreIdx] += 1;					// Update scores, or number completed.
	}
	if (scoreIdx >= 0 && scoreIdx < NUM_GOALS) {			// The match score is greater than zero, so subtract 1
		if (scoreLevels[scoreIdx] > 0) {
			scoreLevels[scoreIdx]--;
			UpdateScore();							// UpdateScoreDisplay(scoreIdx);
			if (DEBUG) {
				print("UPDATE MATCH SCORE: at " + scoreIdx + " = " + scoreLevels[scoreIdx]);
			}
		}
	}
}

//----------------------------------------------------------------------
// Clear matching ints on a 2D array
function Set2dIntArrayIf(arr: int[,], m:int, val:int) {
	var x : 				int;			// Index the grid by x
	var y : 				int;			// Index the grid by y
	for (x = 0; x < boardWidth; x++) {
		for (y = 0; y < boardLength; y++) {
			if (arr[x, y] == m) {
				arr[x, y] = val;
			}
		}
	}
}

//----------------------------------------------------------------------
// Set 2D array if other array set to something
function Set2dIntArrayIfOtherArray(arr: int[,], other: int[,], m:int, val:int) {
	var x : 				int;					// Index the grid by x
	var y : 				int;					// Index the grid by y
	for (x = 0; x < boardWidth; x++) {
		for (y = 0; y < boardLength; y++) {			// If other array matches, set the array element to val
			if (other[x, y] == m) {
				print ("Changing array " + x + "/" + y + " = " + val);
				arr[x, y] = val;
			}
		}
	}
}

//----------------------------------------------------------------------
// Boolean, return true if 2d array is all zero
function IsEmpty2dIntArrayIf(arr: int[,]) {
	var x : 				int;					// Index the grid by x
	var y : 				int;					// Index the grid by y
	for (x = 0; x < boardWidth; x++) {
		for (y = 0; y < boardLength; y++) {
			if (arr[x, y] != 0) {
				return false;
			}
		}
	}
	return true;
}

//----------------------------------------------------------------------
// Check the 2d array to see if element int exists in the array
function Check2dIntArrayIf(arr: int[,], m: int) {
	var x : 				int;					// Index the grid by x
	var y : 				int;					// Index the grid by y
	for (x = 0; x < boardWidth; x++) {
		for (y = 0; y < boardLength; y++) {
			if (arr[x, y] == m) {
				return true;
			}
		}
	}
	return false;
}

//----------------------------------------------------------------------
// Reset tiles in a direction
function ResetTileDirection(x:int, y:int, xd:int, yd:int) {
	x += xd;
	y += yd;
	while(x>=0 && x<boardWidth && y>=0 && y<boardLength && boardId[x,y] == TILEID_CLEAR) {
		boardId[x,y] = TILEID_FLIP;					// New tile
		x += xd;									// Move location
		y += yd;
	}
}

//----------------------------------------------------------------------
// Reset tiles that are ID = -1 (TILEID_CLEAR) in a cross.
function ResetTileCross(x:int, y:int) {
	ResetTileDirection(x, y, 1, 0);
	ResetTileDirection(x, y, 0, 1);
	ResetTileDirection(x, y, -1, 0);
	ResetTileDirection(x, y, 0, -1);
	boardId[x,y] = TILEID_FLIP;
}


//======================================================================
// !CONTROLS
//======================================================================

//----------------------------------------------------------------------
// Check mouse click
function CheckMouse() {
	var x : 							int;		// Index the grid by x
	var y : 							int;		// Index the grid by y
	var hitGameObjectName : 			String;
	var tileName :						String;
	var areWeMoving : 					boolean;
	var pastMoveTime : 					float;
	var newTime : 						float;
	var hit : 							RaycastHit;
	var prevCoins :						int;
	var i : 							int;
	
	prevCoins = coins;

	areWeMoving = movingObjects();									// Check if any objects are moving
	
	if (DEBUG) {
		print("areWeMoving : " + areWeMoving);
		print("menuOn : " + menuOn);
		print("tutorialOn : " + tutorialOn);
		print("levelEndOn : " + levelEndOn);
		print("mouse : " + Input.GetMouseButtonDown(0));
	}
	
	// If the mouse button is clicked and there are no moving objects, and coins left.
	if (Input.GetMouseButtonDown(0) && !areWeMoving && coins > 0 && !menuOn && !tutorialOn && !levelEndOn) {
		var ray  = Camera.main.ScreenPointToRay(Input.mousePosition);
		if (Physics.Raycast(ray, hit, rayDistance)) {				// Get the name of the tile
			hitGameObjectName = hit.collider.gameObject.name;
			tileName = GetObjNamePrefix(hitGameObjectName);			// Did we hit a tile?
			if (DEBUG) {
				print('full-name: ' + hitGameObjectName);
				print('name-hit: ' + tileName);
			}
			if (tileName == "H" || tileName == "V" || tileName  == "tile" || tileName == "prePanic") {	
				// Horizontal or Vertical move
				newTime = Time.time;
				pastMoveTime = newTime - startMoveTime;
				if (pastMoveTime >= MOVE_DELAY) {
					userClicked = false;
				}
				if (!userClicked && pastMoveTime >= MOVE_DELAY) {	// Don't allow move unless 
					startMoveTime = newTime;						// Reset the last move start time
					userClicked = true;
					if (tileName != "prePanic") {
						x = GetTileX(hitGameObjectName);				// Get tile number into (x)
					}					
					if (tileName  == "tile") {	
					
						scrambleMeter--;				
						x = GetTileX(hitGameObjectName);					// Is this a game tile?
						y = GetTileY(hitGameObjectName);
						if (x < boardWidth && y < boardLength) {
							SetLastClickedXYHV(x, y, -1, -1);
							if (DEBUG || DEBUG_SPECIAL == 1) {
								print("you hit an object: " + tileName + ' [' + x + ' , ' + y + '] ' + boardId[x,y]);
							}
							if (boardId[x,y] == TILEID_CLEAR) {				// Has to be a cleared tile
								coins--;
								levelScore++;								// One more move.
								myAudio[7].Play();
								ResetTileCross(x,y);
								myAudio[10].Play();
							}
						}
					
					} 
					else if (tileName == "H" && x < boardWidth) {							// Horizontal Move
						scrambleMeter--;
						coins--;
						levelScore++;								// One more move.
						SetLastClickedXYHV(-1, -1, x, -1);
						MoveHorizontal(x);
						if (DEBUG) {
							print("Horizontal Post-Move: " + tileName + ' [' + x + ']');
							print('==============');
							PrintBoard(boardId);
							print('==============');
						}
						// Play a movement sound
					//	myAudio[0].Play();
						myAudio[7].Play();
					}
					else if (tileName == "V" && (x - MAX_WIDTH) < boardLength) {						// Vertical Move
						scrambleMeter--;
						coins--;
						levelScore++;
						SetLastClickedXYHV(-1, -1, -1, x - MAX_WIDTH);
						MoveVertical(x - MAX_WIDTH);
						if (DEBUG) {
							print("Vertical Post-Move: " + tileName + ' [' + (x - MAX_WIDTH) + ']');
							print('--------------');
							PrintBoard(boardId);
							print('--------------');
						}
						// Play a movement sound
					//	myAudio[0].Play();
						myAudio[7].Play();
					}
					else if (tileName == "prePanic" && coins <= 5 && panicMeter > MAX_PANIC) {
						PanicButton();
					}
					if (coins <= 0 && panicMeter > MAX_PANIC) {		// Auto panic!
						PanicButton();
					}
				}
			    if (scrambleMeter <= 0) {
			    	for (i = 0; i < level - TUTORIAL_LEVELS; i++) {
			    		MoveSkull();
			    	}
			    	scrambleMeter = MAX_SCRAMBLE + Random.Range(0,5);
			    }
			} // else if (tileName == "H" || tileName == "V") {
		} // if (Physics.Raycast(ray, hit, rayDistance)) {
		CheckMoveAfterMatches();
		
		// @TODO Flip back one random blank tile per turn.
		if (prevCoins - 1 == coins){
			FlipOneRandomTile();
		}
	// @TODO Put this here?
	//TileCompress();
	} // if (Input.GetMouseButtonDown(0) && !areWeMoving) {		
}

function PanicButton() {
	ClearIntBoard(boardId, TILEID_FLIP, boardWidth, boardLength);
	score /= 2;
	scoreDisp = score;
	coins += 10;
	coinsPrev = coins;
	coinsDisp = coins;
	myAudio[7].Play();
	myAudio[10].Play();
	panicMeter = 0;			// Reset the panic meter after used.
	scrambleMeter = MAX_SCRAMBLE + Random.Range(0,5);
	panicButton.GetComponent.<Renderer>().enabled = false;	// Turn it off
}

//Flip on Random tile.
//----------------------------------------------------------------------
function FlipOneRandomTile() {
	var x : 				int;						// Index the grid by x
	var y : 				int;						// Index the grid by y
	var c : 				int;						// Count
	c = 0;
	for (y = 0; y < boardLength; y++) {
		for (x = 1; x < boardWidth; x++) {		
			if (boardId[x, y] == TILEID_CLEAR) {
				RandomFlipListX[c] = x;
				RandomFlipListY[c] = y;
				c++;
			}
		}
    }
    if (c > 0) {
	    c = Random.Range(0,c-1);		// Get a random range for the blank tiles
	    boardId[RandomFlipListX[c], RandomFlipListY[c]] = TILEID_FLIP;	// Flip it back
    }
}

// Compress the tiles
//----------------------------------------------------------------------
function TileCompress() {
	var x : 				int;						// Index the grid by x
	var y : 				int;						// Index the grid by y
	var lastClear : 		int;						// Last clear index
//	var lastTile:		int				= boardId[row, boardLength - 1];
//	var lastDraw:		GameObject		= boardDraw[row, boardLength - 1];
/*	
	for (i = boardLength - 1 ; i >= 1; i--) {			// Shift the ID array
		boardId[row, i] = boardId[row, i - 1];
		boardDraw[row, i] = boardDraw[row, i - 1];
	}
	boardId[row, 0] = lastTile;							// Handle the 1st tile and last tile
	boardDraw[row, 0] = lastDraw;
	for (i = 0 ; i < boardLength; i++) {				// Move the Unity tile names
		UpdateTileName(boardDraw, row, i);
		if (DEBUG) {
			print("-> " + Vector3(row, i, 1) + ' | ' + boardDraw[row, i].transform.name);
		}
	}
*/
	for (x = 0; x < boardWidth; x++) {	
		lastClear = -1;
		for (y = 0; y < boardLength; y++) {
			if (boardId[x, y] == TILEID_CLEAR) {
				lastClear = y;
			}
			else if (boardId[x, y] != TILEID_CLEAR && lastClear != -1) {
			print("in");
				boardId[x, lastClear] = boardId[x, y];
				boardId[x, y] = TILEID_CLEAR;
				boardDraw[x, lastClear] = boardDraw[x, y];
				SetTileColorId(x, y, TILEID_CLEAR);
				//UpdateTileName(boardDraw, x, y);
				lastClear = -1;
			}
		}
    }
}

function TileSlideDown(x:int, y:int) {
	var i : 				int;						// Index the grid by x
	var j : 				int;						// Index the grid by y
	var c : 				int; 						// Count
	c = 0;
	for (j = 0; j < boardLength; j++) {	
			if (boardId[x, y] == TILEID_CLEAR) {
				c++;
			}
    }
}


//======================================================================
// !CHECK AND !PROCESS !MATCHES
//======================================================================

//----------------------------------------------------------------------
// Check to see if there are any matches
function CheckMoveAfterMatches() {
	FindAllMatches();
	ProcessAllMatches();
	if (DEBUG && DEBUG_SPECIAL >= 2) {
		print('++++++++++++++');
		print("After Process");
		PrintBoard(boardId);
		print('++++++++++++++');
	}
	FindAllMatches();								// Check again to fix the arrays
}

//----------------------------------------------------------------------
// Check both H and V for matches
function FindAllMatches() {
    FindVerticalMatches();
	FindHorizontalMatches();
}

//----------------------------------------------------------------------
// Process Horizinal and Vertical matches
function ProcessAllMatches() {
	ClearIntBoard(boardIdMatch, 0, MAX_WIDTH, MAX_LENGTH);
	ProcessVerticalMatches();
	ProcessHorizontalMatches();
}

//----------------------------------------------------------------------
// Process any vertical matches and resolve, set to ?? tiles
function ProcessHorizontalMatches() {
	var x : 				int;						// Index the grid by x
	var y : 				int;						// Index the grid by y
	var run : 				boolean;					// Process a run
	var current : 			int;						// Current value
	var highest : 			int;						// Highest value at start of run
	var runSize : 			int;						// Size of run
	
	for (y = 0; y < boardLength; y++) {
        for (x = boardWidth - 1; x >= 0; x--) {        	// See if found a match, scan backwards for high number
        	if (hMatch[x, y] >=  MINSHAPESIZE && boardId[x,y] > 0) {
        		run = true;
        		highest = hMatch[x, y];					// Will be decemented to count
        		runSize = highest; 						// Save to make tile -runSize
        		while (run) {
        			current = hMatch[x, y];
        			if (DEBUG) {
        				print("Match: " + x + ',' + y + ' || ' + highest);
        			}
        			highest--;
        			if (highest >= 0) {
        				boardIdMatch[x,y] = boardId[x,y];
						boardId[x,y] = - runSize;
						matchCode[x,y] = matchCount;
        			}
        			else {
        				run = false;
        			}
        			x--;
         			if (x < 0 ||  hMatch[x, y] >= current) {
        				run = false;
        			}
        		} // while (run)
        		matchCount++;
        	} // if (hMatch[x, y] >=  MINSHAPESIZE && boardId[x,y] > 0)
        } // for (x = boardWidth - 1; x >= 0; x--)
	} // for (y = 0; y < boardLength; y++)
}

//----------------------------------------------------------------------
// Process any vertical matches and resolve, set to ?? tiles
function ProcessVerticalMatches() {
	var x : 				int;						// Index the grid by x
	var y : 				int;						// Index the grid by y
	var run : 				boolean;					// Process a run
	var current : 			int;						// Current value
	var highest : 			int;						// Highest value at start of run
	var runSize : 			int;						// Size of run
	
	for (x = 0; x < boardWidth; x++) {					// Assume nothing flipped
        for (y = boardLength - 1; y >= 0; y--) {
        	// See if found a match, scan backwards for high number
        	if (vMatch[x, y] >=  MINSHAPESIZE && boardId[x,y] > 0) {
        		run = true;
        		highest = vMatch[x, y];					// Current highest will be depreciated
        		runSize = highest; 						// Save to make tile -runSize
        		while (run) {
        			current = vMatch[x, y];
        			if (DEBUG) {
        				print("Match: " + x + ',' + y + ' || ' + highest);
        			}
        			highest--;
        			if (highest >= 0) {        			// Flip the id of this tile to the size of the match
        				boardIdMatch[x,y] = boardId[x,y];
						boardId[x,y] = -runSize;
						matchCode[x,y] = matchCount;
        			}
        			else {
        				run = false;
        			}
        			y--;
         			if (y < 0 ||  vMatch[x, y] >= current) {
        				run = false;
        			}
        		} // while (run)
        		matchCount++;
        	} // if (vMatch[x, y] >=  MINSHAPESIZE && boardId[x,y] > 0)
        } // for (y = boardLength - 1; y >= 0; y--)
	} // for (x = 0; x < boardWidth; x++)
}

//----------------------------------------------------------------------
// Find horizontal matches and build a horizontal match array hMatch
function FindHorizontalMatches() {
	var x : 				int;						// Index the grid by x
	var y : 				int;						// Index the grid by y
	ClearIntBoard(hMatch, 0, MAX_WIDTH, MAX_LENGTH);
	for (y = 0; y < boardLength; y++) {
		for (x = 1; x < boardWidth; x++) {				// Check if adjacent match, but not for neutral squares
			if (boardId[x, y] > 0 && boardId[x, y] == boardId[x - 1, y]) {
				if (hMatch[x - 1, y] == 0) {
					hMatch[x - 1, y] = 1;
				}
				hMatch[x, y] = hMatch[x - 1, y] + 1;
			}
		}
    }
    if (DEBUG && DEBUG_SPECIAL >= 2) {
	    print("------Horizontal------");
	    PrintBoard(hMatch);
	}
}

//----------------------------------------------------------------------
// Find vertical matches and build a horizontal match array vMatch
function FindVerticalMatches() {
	var x : 				int;						// Index the grid by x
	var y : 				int;						// Index the grid by y
	ClearIntBoard(vMatch, 0, MAX_WIDTH, MAX_LENGTH);
	for (x = 0; x < boardWidth; x++) {
        for (y = 1; y < boardLength; y++) {
			if (boardId[x, y] > 0 && boardId[x, y] == boardId[x, y - 1]) {
				if (vMatch[x, y - 1] == 0) {
					vMatch[x, y - 1] = 1;
				}
				vMatch[x, y] = vMatch[x, y - 1] + 1;
			}
		}
    }
    if (DEBUG && DEBUG_SPECIAL >= 2) {
	    print("------Vertical------");
	    PrintBoard(vMatch);
	}
}

//----------------------------------------------------------------------
// Is there at least one match >= MINSHAPESIZE, direction = 'H' or 'V'
function CheckMatch(direction: String) {
	var x : 				int;						// Index the grid by x
	var y : 				int;						// Index the grid by y
	var match :				boolean;					// Is there a match of >= MINSHAPESIZE
	match = false;
	for (x=0; x < boardWidth; x++) {
        for (y=0; y < boardLength; y++) {
        	if (direction == 'H' && hMatch[x, y] >= MINSHAPESIZE || direction == 'V' && vMatch[x, y] >= MINSHAPESIZE ) {
        		match = true;
        	}
        }
	}
	return match;
}

//----------------------------------------------------------------------
// Is there any match?
function CheckAnyMatch() {
	return CheckMatch('H') || CheckMatch('V');
}

//======================================================================
// !BOARD !CREATE / !UTILS
//======================================================================

//----------------------------------------------------------------------
// Clear a 2d int array
function ClearIntBoard(b : int[,], v: int, w:int, l:int) {
	var x : 				int;						// Index the grid by x
	var y : 				int;						// Index the grid by y
	for (x=0; x < w; x++) {
        for (y=0; y < l; y++) {
			b[x, y] = v;
		}
    }
}

//----------------------------------------------------------------------
// DEBUG use only: Check the game board for matches
function PrintBoard(b : int[,]) {
	var x : 				int;						// Index the grid by x
	var y : 				int;						// Index the grid by y
	var rowString :			String;						// The string
	var entry : 			String;						// A grid entry
	var pad : 				String;						// Leading pad
    // print the game board;
    for (y = boardLength - 1 ; y >= 0  ; y--) {
		rowString = '';
   		for (x = 0 ; x < boardWidth ; x++) {
   			pad = '  ';
   			if (b[x, y] < 0) {
   				pad = ' ';
   			}
   			entry = pad + b[x, y];
   			entry = entry.Substring(0,3);
        	rowString += entry;
        }
        if (DEBUG) {
	    	print(rowString);
	    }
    }
}

//----------------------------------------------------------------------
// Get the X Coord based on the name
function GetObjNamePrefix(tileName : String) {
	return GetFromName(tileName, 0);
}

//----------------------------------------------------------------------
// Get the X Coord based on the name
function GetTileX(tileName: String) {
	return parseInt(GetFromName(tileName, 1));
}

//----------------------------------------------------------------------
// Get the Y Coord based on the name
function GetTileY(tileName: String) {
	return parseInt(GetFromName(tileName, 2));
}

//----------------------------------------------------------------------
// Tokenize an Object name
function GetFromName(objectName: String, i: int) {
	var splitarray : String[] = objectName.Split("_"[0]);
	return splitarray[i];
}

//----------------------------------------------------------------------
// Create the game board
function CreateBoard() {
	var x : 				int;							// Index the grid by x
	var y : 				int;							// Index the grid by y
	var tileID :			int;							// The tile ID / Color
	var newtileID :			int;							// A tile ID which is not random

	matchCount = 1;
	prevMatchCount = 1;
	for (x=0; x < MAX_WIDTH; x++) {
        for (y=0; y < MAX_LENGTH; y++) {
        	if (DEBUG) {
            	print("x: " + x + " y: " + y);
            }
			CreateUnityTile(x, y);							// Set the tile to draw
			UpdateTileName(boardDraw, x, y);				// Set the tile name
		}
	}
	// New way to create new board?	
	ClearAllTile();							// Clear all the tile out
	ClearIntBoard(boardId, TILEID_FLIP, boardWidth, boardLength);
	FindAllMatches();    									// Check if we have a valid board
	SetMatchNeutral();										// Set colors to neutral where >=3 matches
	FindAllMatches();										// Check matches again
}

//----------------------------------------------------------------------
// NOT IN USE! (OLD: Set up new board)
function NewBoard() {
	var x : 				int;							// Index the grid by x
	var y : 				int;							// Index the grid by y
	var tileID :			int;							// The tile ID / Color
	for (x=0; x < boardWidth; x++) {
        for (y=0; y < boardLength; y++) {
			tileID = GetRandomTileType();					// Set the tile Color / ID
            SetTileColorId(x, y, tileID);
        }
    }
    FindAllMatches();
    for (x=0; x < boardWidth; x++) {
        for (y=0; y < boardLength; y++) {					// Check if there is a particular match on this tile
			if (hMatch[x, y] || vMatch[x, y]) {
			    if (DEBUG) {
			    	print("__________________________________________________");
            		print("IS THERE A MATCH: x: " + x + " y: " + y);
            		print("__________________________________________________");
            	}
				TrySetValidColor(x, y);						// Try to set this to a non-matching color
			}
        }
    }
    ClearIntBoard(boardIdMatch, 0, MAX_WIDTH, MAX_LENGTH);
}

//----------------------------------------------------------------------
// Mainly for building new board find a color w/o matches
function TrySetValidColor(x:int, y:int) {
	var c : 				int;							// Color Index
	var noMatchFound : 		boolean;						// Did not find a mnatch
	noMatchFound = true;									// Mark all matches >= 3 to black for now
	for (c=1; x < tilesTypesLevel && noMatchFound; c++) {
		FindAllMatches();									// Match on this particular tile?
		if (hMatch[x, y] || vMatch[x, y]) {					// Try to set this to a non-matching color
			SetTileColorId(x, y, c);
		}
		else {
			noMatchFound = false;
		}
	}
}

//----------------------------------------------------------------------
// Mainly for building new board set any >= MAXSIZE to neutral color
// Leave this in board utils since part of board setup.
function SetMatchNeutral() {
	var x : 				int;							// Index the grid by x
	var y : 				int;							// Index the grid by y
	for (x=0; x < boardWidth; x++) {						// Mark all matches >= 3 to black for now 
        for (y=0; y < boardLength; y++) {
        	if (hMatch[x, y] >= MINSHAPESIZE || vMatch[x, y] >= MINSHAPESIZE) {
        		//boardDraw[x,y].renderer.material.color = Color.black;
        		//boardId[x,y] = TILEID_CLEAR;
        		SetTileColorId(x, y, TILEID_CLEAR);
				if (DEBUG) {
					print("(1)NEUTRAL******");
				}
        	}
			if (hMatch[x, y] >= MINSHAPESIZE) {
        		hMatch[x, y] = TILEID_CLEAR;
        		SetTileColorId(x, y, TILEID_CLEAR);
				if (DEBUG) {
					print("(2)NEUTRAL******");
				}
        	}
			if (vMatch[x, y] >= MINSHAPESIZE) {
        		vMatch[x, y] = TILEID_CLEAR;
        		SetTileColorId(x, y, TILEID_CLEAR);
				if (DEBUG) {
					print("(3)NEUTRAL******");
				}
        	}
        }
	}
}

//----------------------------------------------------------------------
// Set the tile color and the board ID in the same function
function SetTileColorId(x:int, y:int, tileID:int) {
	SetTileColor(x, y, tileID);							// Update the color
	boardId[x,y] = tileID;								// Update the type (same as color)	
}

//----------------------------------------------------------------------
// Set the tile color and the board ID in the same function
function ClearAllTile() {
	var x : 				int;							// Index the grid by x
	var y : 				int;							// Index the grid by y
	for (x=0; x < MAX_WIDTH; x++) {						// Mark all matches >= 3 to black for now 
        for (y=0; y < MAX_LENGTH; y++) {
     		SetTileColorId(x, y, 0);
     	}
     }
}

//----------------------------------------------------------------------
// Update the name of this object, pass 2D array of object
function UpdateTileName(boardTile:GameObject[,] , x:int, y:int) {
	boardTile[x,y].name = "tile_" + x + '_' + y;
}

//----------------------------------------------------------------------
// Create the unity 3D object
function CreateUnityTile(x:int, y:int) {
	boardDraw[x,y] = Instantiate(tile, Vector3(x,y,1), Quaternion.identity);
}

//----------------------------------------------------------------------
// Create the unity 3d Coin
function CreateUnityCoin(x) {
	coinList[x] = Instantiate(coin, Vector3(
			-2  + Random.Range(-10,10)/100.0,
			4 + Random.Range(-10,10)/100.0,
			1
		),Quaternion.identity);
}

//----------------------------------------------------------------------
// Create all coins
function CreateCoins(){
	var i : 				int;
	for (i=0; i<coinListSize; i++) {
		CreateUnityCoin(i);
	}
}

//----------------------------------------------------------------------
// Create the game buttons
function CreateButtons() {
	var x : 				int;									// Index the Horizontal buttons
	var y : 				int;									// Index the Vertical buttons
	
	for (x=0; x < MAX_WIDTH; x++) {								// Create horizontal buttons
		if (DEBUG) {
			print("Creating button x: " + x);
		}
		CreateButton(x, -1, "H_", x);								// Set the tile to draw
		buttonDraw[x].transform.eulerAngles.z -= 90;
    }
   	for (y=0; y < MAX_LENGTH; y++) {    							// Create vertical buttons
   		if (DEBUG) {
			print("Creating button y: " + y);
		}
		CreateButton(-1, y, "V_", y + MAX_WIDTH);					// Set the tile to draw
		buttonDraw[y + boardWidth].transform.eulerAngles.z += 180;
    }
}

//----------------------------------------------------------------------
// Create Sparks
function CreateSparks(x:int, y:int) {
	Instantiate(sparks, Vector3(x,y,-6), Quaternion.identity);
}

//----------------------------------------------------------------------
// Create Lightningball
function CreateLightningBall(x:int, y:int) {
	Instantiate(lightningBall, Vector3(x,y,-8), Quaternion.identity);
}

//----------------------------------------------------------------------
// Create LightningStrike
function CreateLightningStrike(x:int, y:int) {
	Instantiate(lightningStrike, Vector3(x,y,-8), Quaternion.identity);
}

//----------------------------------------------------------------------
// Create the unity button objects
function CreateButton(x:int, y:int, namePrefix:String, buttonIndex:int) {
	// Create the Unity3d Object
	buttonDraw[buttonIndex] = Instantiate(button, Vector3(x,y,1), Quaternion.identity);
	buttonDraw[buttonIndex].name = namePrefix + buttonIndex;
}

//----------------------------------------------------------------------
// Set some buttons as clear and others solid based on size of level
function SetupButtonsLevel() {
	var x: 					int;
	for (x=0; x < MAX_WIDTH; x++) {
		if (x < boardWidth) {
			buttonDraw[x].GetComponent.<Renderer>().material = buttonMaterial;
		}
		else {
			buttonDraw[x].GetComponent.<Renderer>().material = cubeMaterialBlank;
		}
    }
   	for (x=0; x < MAX_LENGTH; x++) {    							// Create vertical buttons
		if (x < boardLength) {
			buttonDraw[x + MAX_WIDTH].GetComponent.<Renderer>().material = buttonMaterial;
		}
		else {
			buttonDraw[x + MAX_WIDTH].GetComponent.<Renderer>().material = cubeMaterialBlank;
		}
    }
}

//----------------------------------------------------------------------
// Shuffle an array at rnd
// GOAL_TILE_TYPES
function lastLevelShuffle() {
    var r : int;
    var i : int;
    var temp : int;
    for( i = levelCalc(0); i < levelCalc(8); i++ ){
        r = Random.Range(levelCalc(0), levelCalc(0) + 8);
        temp = GOAL_TILE_TYPES[r];
        GOAL_TILE_TYPES[r] = GOAL_TILE_TYPES[i];
        GOAL_TILE_TYPES[i] = temp;
    }
}
// Calc level index
function levelCalc(id:int) {
	return 25 * 9 + id;
}

//----------------------------------------------------------------------
// Load a level
// @TODO RNDLEVEL
function LoadClankLevel(lv:int) {
	var x: 					int;

	panicMeter = 0;
	scrambleMeter = MAX_SCRAMBLE + Random.Range(0,5);

	// Running full random mode.
	if (mode == MODE_RANDOM || mode == MODE_TIMED) {
		lv = LEVELS;
	}

	//LEVEL_SIZE
	boardWidth = LEVEL_SIZE[lv * 2];
	boardLength = LEVEL_SIZE[lv * 2 + 1];
	
	// Random levels, at end of main puzzle, or MODE_RANDOM
	if (lv >= LEVELS) {
		boardWidth = Random.Range(5,8);
		boardLength = Random.Range(5,8);
	}
	if (LEVEL_TEXT[lv] != "") {
		tutorialOn = true;
	}
	if (DEBUG) {
		print("[][][] lv:" + lv + " boardWidth:" + boardWidth + " boardLength:" + boardLength);
	}
	tilesTypesLevel = GOAL_TYPES[lv];								// Types of tiles
	if (lv >= LEVELS) {
		tilesTypesLevel = Random.Range(4, (boardWidth + boardLength)/2 + 1);
		lastLevelShuffle();
	}
	if (DEBUG || DEBUG_SPECIAL == 1) {
		print("LOAD TILE TYPES: at " + tilesTypesLevel);
	}
	for (x=0; x < NUM_GOALS; x++) {			// Get the goals, how many needed to clear level + RND
		scoreLevels[x] = GOAL_LIMITS[lv * NUM_GOALS + x] + Random.Range(0, GOAL_RANDOM[lv * NUM_GOALS + x]);
		levelGoalMax[x] = scoreLevels[x];
		//scoreLevels[x] = GOAL_LIMITS[lv * NUM_GOALS + x];
		scoreRank[x] = 0;											// Set the number of each goal done to 0
		if (DEBUG || DEBUG_SPECIAL == 1) {
			print("LOAD GOALS: at " + x + " = " + scoreLevels[x] + "  TYPE:" + scoreLevels[x].GetType());
		}
	}
	UpdateLevelName();							// Load the level name
	UpdatePercent();							// Update the Score Percent
	
	background.GetComponent.<Renderer>().material.color = Color(
		(level + Random.Range(0, 3)) % 5 / 10.0, 
		(level + Random.Range(0, 4)) % 4 / 8.0, 
		(level + Random.Range(0, 5)) % 3 / 6.0,
		 1.0);
	
	timer = 60;
}

//----------------------------------------------------------------------
// Update goal scores, Output the goals
function UpdateScoreDisplay(x:int) {
	tileGoal[x].GetComponent(TextMesh).text = scoreLevels[x].ToString();
}

//----------------------------------------------------------------------
// Update goal percent
function UpdatePercent() {
	var per : int;
	var perTotal : int;
	var perMin : int;
	var i : int;
// @TODO in terms of levelGoalMax
	per = 0;
	perTotal = 0;
	for (i = 0; i < NUM_GOALS; i++) {
		//perTotal += GOAL_LIMITS[level * NUM_GOALS + i];
		perTotal += levelGoalMax[i];
		perMin = scoreRank[i];
		//if (GOAL_LIMITS[level * NUM_GOALS + i] < perMin) {
		if (levelGoalMax[i] < perMin) {
			//perMin = GOAL_LIMITS[level * NUM_GOALS + i];
			perMin = levelGoalMax[i];
		}
		per +=  perMin;
	}
	totalGoals = perTotal;
	if (DEBUG && DEBUG_SPECIAL == 3) {
		print("-*-*-> " + per + " / " + perTotal);
	}
	percentText.GetComponent(TextMesh).text = (per*100/perTotal).ToString() + "%";
}

//----------------------------------------------------------------------
// Display all scores again
function UpdateAllScores() {
	var i: int;
	for (i=0; i<NUM_GOALS; i++) {
		if (scoreLevels[i] == 0) {
			SetObjectColor(tileGoal[i], Color(0.0, 0.5, 0.0, 1.0));
		}
		else {
			SetObjectColor(tileGoal[i], Color(0.5, 0.0, 0.0, 1.0));
		}
		tileGoal[i].GetComponent(TextMesh).text = scoreRank[i].ToString();
	}
}

//----------------------------------------------------------------------
// Update coins
function UpdateCoins() {
	// Limit number of coins awarded
	if (coins - coinsPrev > 10) {
		coins = coinsPrev + 10;
	}
	// Limit number of coins removed
	if (coinsPrev - coins > 1) {
		coins--;
	}
	coinsPrev = coins;
	if (coins > MAX_COINS) {
		coins = MAX_COINS;
	}
	if (coins > MAX_COINS) {
		coins = MAX_COINS;
	}
	if (coinsDisp < coins) {
		coinsDisp++;
		//audio3.Play();
	}
	if (coinsDisp > coins) {
		coinsDisp--;
		//audio3.Play();
	}
	coinText.GetComponent(TextMesh).text = coinsDisp.ToString();
	AddRemoveCoins();
}

//----------------------------------------------------------------------
// Add and Remove coin objects as needed
function AddRemoveCoins() {
	var i : 		int;
	
	// Create needed coins
	if (coinListSize < coins && coins < MAX_COINS) {
		myAudio[2].Play();
		myAudio[3].Play();
		for (i=coinListSize; i < coins; i++) {
			CreateUnityCoin(i);
		}
		coinListSize = coins;
	}
	// Remove lost coins
	else if (coinListSize > coins && coins >= 0) {
		for (i=coinListSize-1; i >= coins; i--) {
			Destroy(coinList[i]);
		}
		coinListSize = coins;
	}
}

//----------------------------------------------------------------------
// Update score
function UpdateScore() {
	if (scoreDisp + 100 < score) {
		scoreDisp += 10;
		myAudio[9].Play();
	}
	else if (scoreDisp < score) {
		scoreDisp += 1;
		myAudio[8].Play();
	}
	scoreText.GetComponent(TextMesh).text = scoreDisp.ToString();
}

//----------------------------------------------------------------------
// Update timer
function UpdateTimer() {
	if (mode == MODE_TIMED) {
		timerText.GetComponent(TextMesh).text = parseInt(timer) + 'sec';
	}
	else {
		timerText.GetComponent(TextMesh).text = '';
	}
}

//----------------------------------------------------------------------
// Update Level Name
function UpdateLevelName() {
	nameText.GetComponent.<Renderer>().material.color = Color.white;
	if (mode == MODE_RANDOM) {
		nameText.GetComponent(TextMesh).text = "Random #" + (level - TUTORIAL_LEVELS + 1);
	}
	else if (mode == MODE_TIMED) {
		nameText.GetComponent(TextMesh).text = "Timed #"  + (level - TUTORIAL_LEVELS + 1);
	}
	else {
		nameText.GetComponent(TextMesh).text = LEVEL_NAME[level];
		if (DEBUG) {
			print("%%% Level Name: " + LEVEL_NAME[level]);
		}
	}
}

//----------------------------------------------------------------------
// Update level
function UpdateLevel() {
	if (level < TUTORIAL_LEVELS) {
		levelText.GetComponent(TextMesh).text = "T" + (level + 1).ToString();
	}
	else {
		levelText.GetComponent(TextMesh).text = (level + 1 - TUTORIAL_LEVELS).ToString();
	}
}

//----------------------------------------------------------------------
// Update coins
function GoalsFinished() {
	var levelDone : boolean;
	var i : int;

	for (i=0; i<NUM_GOALS; i++) {
		if (scoreLevels[i] > 0) {
			return false;
		}
	}
	return true;
}

//----------------------------------------------------------------------
// Update coins
function TutGoalsFinished() {
	var levelDone : boolean;
	var i : int;
	var goalCount : int = 0;

	for (i=0; i<NUM_GOALS; i++) {
		goalCount += scoreRank[i];
	}
	if (goalCount >= GOAL_LIMITS[level * NUM_GOALS]) {		// Check w/ 1st goal only = all
		return true;
	}
	return false;
}

//----------------------------------------------------------------------
// Create the goals
function CreateTileGoals() {
	var x : 				int;				// Index the Horizontal buttons
	// Set this to 0 for no goals completed yet
	goalCount = 0;
	// Create goals
	for (x=0; x < NUM_GOALS; x++) {
		if (DEBUG) {
			print("Creating goal x: " + x);
		}
		CreateTileGoal(8.9, x, "G_", x);
    }
}

//----------------------------------------------------------------------
// Create the buys
/*function CreateBuys() {
	var i : 				int;				// Index the Horizontal buttons
		for (i = 0; i<buySize; i++) {
		buysObjects[i] = Instantiate(goal, Vector3(i+8,6.5, 1), Quaternion.identity);
		if (DEBUG) {
			print("buyobj: " + i);
		}
		buysObjects[i].name = "buy_" + i;
		buysObjects[i].GetComponent(TextMesh).text = "+";
	}
}*/

//----------------------------------------------------------------------
// Create the unity TileGoal objects
function CreateTileGoal(x:int, y:int, namePrefix:String, tileIndex:int) {
	tileGoal[tileIndex] = Instantiate(goal, Vector3(x, y, 1), Quaternion.identity);
	// Also set the name, prefix with H=horizontal and V=vertical
	tileGoal[tileIndex].name = namePrefix + tileIndex;
	goalId[tileIndex] = tileIndex;							// Set the ID	
}

//----------------------------------------------------------------------
// Create the unity TileGoal objects
function CreateTileGoalCount(x:int, y:int, namePrefix:String, tileIndex:int) {
	tileGoalCount[tileIndex] = Instantiate(goal, Vector3(x, y, 1), Quaternion.identity);
	// Also set the name, prefix with H=horizontal and V=vertical
	tileGoalCount[tileIndex].name = namePrefix + tileIndex;
	// Set the ID
	goalId[tileIndex] = tileIndex;		
}

//----------------------------------------------------------------------
// Setup the colors for the game
/*function SetupGameColors() {
	// Setup colors, may want a more flaxible way to do this
	if (BOARDCOLORS >= 0) {
		colorRange[0] = Color.white;
	}
	if (BOARDCOLORS >= 1) {
		colorRange[1] = Color.yellow;
	}
	if (BOARDCOLORS >= 2) {
		colorRange[2] = Color.green;
	}
	if (BOARDCOLORS >= 3) {
		colorRange[3] = Color.cyan;
	}
	if (BOARDCOLORS >= 4) {
		colorRange[4] = Color(0.4, 0.3, 1.0, 1.0);
	}
	if (BOARDCOLORS >= 5) {
		colorRange[5] = Color(1.0, 0.9, 1.0, 1.0);
	}
	if (BOARDCOLORS >= 6) {
		colorRange[6] = Color(0.6, 0.5, 1.0, 1.0);
	}
	if (BOARDCOLORS >= 7) {
		colorRange[7] = Color(0.7, 0.3, 0.3, 1.0);
	}
	if (BOARDCOLORS >= 8) {
		colorRange[8] = Color(0.9, 0.3, 0.7, 1.0);
	}
	if (BOARDCOLORS >= 9) {
		colorRange[9] = Color(1.0, 0.6, 0.2, 1.0);
	}
}
*/

//----------------------------------------------------------------------
// Set the tile at x,y to some color
function SetTileColor(x:int, y:int, tileID:int) {
	if (tileID != TILEID_CLEAR && tileID != 0) {
		// Change the material
		boardDraw[x,y].GetComponent.<Renderer>().material = cubeMaterials[tileID];
		// Set the color
		//SetObjectColor(boardDraw[x,y], GetTileColor(tileID));
	}
	else if (tileID != 0) {
		//SetObjectColor(boardDraw[x,y], Color.black);
		boardDraw[x,y].GetComponent.<Renderer>().material = cubeMaterialClear;
		CreateSparks(x,y);
	}
	else {
		//SetObjectColor(boardDraw[x,y], Color.black);
		boardDraw[x,y].GetComponent.<Renderer>().material = cubeMaterialBlank;
	}
}

//----------------------------------------------------------------------
// Set object color
function SetObjectColor(g:GameObject, c:Color) {
	g.GetComponent.<Renderer>().material.color = c;
}

//----------------------------------------------------------------------
// Returns a random tile in the range
function GetRandomTileType() {
	return Random.Range(0, tilesTypesLevel);
}

//----------------------------------------------------------------------
// Get a valid Tile at location x, y
function GetValidTile(x:int, y:int) {
	var i: 			int;						// A counter for the colors
	var tileId: 	int;
	var mapTileId: 	int;
	i = 0;										// Get a random tile
	tileId = GetRandomTileType();
	mapTileId = MapTileByLevel(tileId);
	
	SetTileColorId(x, y, mapTileId);
	while (NSEWMatch(x, y) && i <= tilesTypesLevel) {
		tileId = (tileId + 1) % tilesTypesLevel;
		/*if (tileId == 0) {
			tileId++;
		}*/
		mapTileId = MapTileByLevel(tileId);
		SetTileColorId(x, y, mapTileId);
		i++;
	}
	if (i >= tilesTypesLevel) {
		mapTileId = -1;
	}
	SetMatchNeutral();
	return mapTileId;
}

//----------------------------------------------------------------------
function NSEWMatch(x:int, y:int) : boolean {
/*	var n : int = (x + boardLength - 1) % boardLength;
	var s : int = (x + boardLength + 1) % boardLength;
	var e : int = (y + boardWidth - 1) % boardWidth;
	var w : int = (y + boardWidth + 1) % boardWidth; */
	var n : int = x-1 >= 0 ? x-1 : -1; 
	var s : int = x+1 < boardLength ? x+1 : -1;
	var e : int = y-1 >= 0 ? y-1 : -1;
	var w : int = y+1 < boardWidth ? y+1 : -1;
	/*var match : boolean = boardId[x,y] == boardId[n,y]
		|| boardId[x,y] == boardId[s,y]
		|| boardId[x,y] == boardId[x,e]
		|| boardId[x,y] == boardId[x,w];*/
	var match : boolean = false;
	if (n != -1) {
		match = match || boardId[x,y] == boardId[n,y];
	}
	if (s != -1) {
		match = match || boardId[x,y] == boardId[s,y];
	}
	if (e != -1) {
		match = match || boardId[x,y] == boardId[x,e];
	}
	if (w != -1) {
		match = match || boardId[x,y] == boardId[x,w];
	}
	return match;
}

//----------------------------------------------------------------------
// Map tile by level tile mapping array
function MapTileByLevel(id:int) {
	return GOAL_TILE_TYPES[level * 9 + id];
}

//----------------------------------------------------------------------
// Returns the tile color
/*function GetTileColor(tileType:int) {
	return colorRange[tileType];
}*/

//----------------------------------------------------------------------
// These vars are updated on a click or a move
function SetLastClickedXYHV(X:int , Y:int, H:int, V:int) {
	lastClickedX = X;
	lastClickedY = Y;
	lastClickedH = H;
	lastClickedV = V;
}

//----------------------------------------------------------------------
// Get the state of a tile!
function GetTileState(x:int, y:int) {
	return boardDraw[x, y].GetComponent(jsCube).tileState;
}

//----------------------------------------------------------------------
// Set all the global variables.
function SetGlobals() {
	// Set hiscore
	var hiscore = globalObject.GetComponent(jsGlobal).hiscore;
	if (score > hiscore) {
		globalObject.GetComponent(jsGlobal).hiscore = score;
	}
	// Set other global vars
	globalObject.GetComponent(jsGlobal).level = level;
	globalObject.GetComponent(jsGlobal).score = score;
}

//----------------------------------------------------------------------
// Get level global variable to start
function GetLevel():int {
	return globalObject.GetComponent(jsGlobal).level;
}

//----------------------------------------------------------------------
// get the game mode.
function GetGameMode():int {
	return globalObject.GetComponent(jsGlobal).gameMode;
}
