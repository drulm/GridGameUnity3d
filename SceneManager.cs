
//======================================================================
// GRID GAME:	SceneManager.cs
// 			Attached to the camera
//				Used for:
//					* Main game scene
//======================================================================

using UnityEngine;
using System.Collections;

public class SceneManager : MonoBehaviour 
{
	//======================================================================
	// Variables
	//======================================================================

	// Public Unity Variables
	//----------------------------------------------------------------------

	// Public singleton to share variables
	public static SceneManager Instance;


	// Private constants
	//----------------------------------------------------------------------
	private const int MaxWidth			= 8;		// Board size
	private const int MaxLength			= 8;
	private const int StartMusic 		= 17;
	private const float MaxVolume 		= 0.2f;
	private const int MaxPanic			= 20;
	private const int MaxScramble		= 5;
	private const int MaxSounds 		= 50;
	private const int TutorialLevels	= 7;
	private const int MaxCoins			= 50;
	private const int StartCoins		= 15;
	private const int MaxBoardSize		= 8;		// Max size
	private const int BoardColors		= 9;		// Max colors
	private const float RayDistance 	= 100.0f;	// The click-ray distance
	private const int MinShapeSize 		= 3;		// The min match ALGORITHM size
	private const float MoveDelay 		= 0.2f;		// Time until another move allowed
	private const int NumGoals			= 6;		// How many goals
	private int Levels 					= 25;		// Number of levels


	// Public Unity Variables
	//----------------------------------------------------------------------
	public Font font;
	public GUISkin CustomGUISkin;
	public GameObject panic;
	public GameObject tile;							// The game tile
	public GameObject button;						// The button Unity object
	public GameObject background;					// The game tile
	public GameObject coin;							// The game coin
	public GameObject sparks;						// Sparks
	public GameObject lightningBall;				// Lightning Ball
	public GameObject lightningStrike;				// Lightning Strike
	public GameObject goal;							// Tile goal object
	public GameObject coinText;						// The coin 3d Text
	public GameObject scoreText;					// The score 3d Text
	public GameObject levelText;					// The level 3d Text
	public GameObject nameText;						// The name 3d Text
	public GameObject percentText;					// The percent 3d Text
	public GameObject timerText;					// The timer 3d Text
	public Material[] cubeMaterials;				// Materials for the cube
	public Material buttonMaterial;					// Material for button
	public Material cubeMaterialClear;
	public Material cubeMaterialBlank;
	public Material cubeMaterialGear;
	public int lastClickedH;
	public int lastClickedV;


	// Public Variables
	//----------------------------------------------------------------------
	public int[,] boardId;							// The game tile as grid
	

	// Public Static Unity Variables
	//----------------------------------------------------------------------
	public static bool soundOn = true;				// Sound on or off switch


	// Private Variables
	//----------------------------------------------------------------------
	private GameObject panicButton;
	private int fontSize;
	private int tilesTypesLevel;					// Num of tile types per level
	private int boardWidth					= 8;	// Board size different per level
	private int boardLength					= 8;
	private Color[] colorRange;						// The colors of tiles
	private GameObject[] buttonDraw;				// The buttons as drawn
	private int[] goalId;
	private GameObject[] tileGoal;					// The tile goal object array
	private GameObject[] tileGoalCount;				// The tile goal object array
	private GameObject[] coinList;					// All the coins
	private int coinListSize;						// Current number of coins / moves
	private GameObject[,] boardDraw;
	private GameObject globalObject;	
	private int panicMeter;
	private int scrambleMeter;
	private float _oldWidth;
	private float _oldHeight;
	private bool  menuOn 					= false;
	private bool  tutorialOn			 	= false;
	private bool  levelEndOn 				= false;
	private int levelScore 					= 0;
	private int totalGoals 					= 0;
	private float timer 					= 60;
	private string lastLevelName;
	private int[] RandomFlipListX;					// Random Flip
	private int[] RandomFlipListY;					// Random Flip
	private int[] levelGoalMax;						// Max level goals + Rnd
	private int[] scoreLevels;						// The level goals
	private int[] scoreRank;						// The per goal count
	private int[,] boardIdMatch;					// Save tileID when matched
	private int[,] vMatch;							// Vertical match grid
	private int[,] hMatch;							// Horizontal match grid
	private int[,] matchCode;						// Encode the matches
	private int matchCount;							// The current count of matches
	private int prevMatchCount;						// The current count of matches
	private int score;								// Score local to this routine
	private int coins;								// Current number of coins / moves
	private int coinsPrev;							// Prev number of coins / moves
	private int scoreDisp;							// Displayed score
	private int coinsDisp;							// Displayed coins
	private int level;								// Current Level
	private int mode;								// type of game.
	private float startMoveTime;					// How much time passed since last move?
	private bool newFlips;							// If any flipped this move
	private bool userClicked;						// User clicked a command
	private Vector3 originPosition;
	private Quaternion originRotation;
	private float shake_decay;
	private float shake_intensity;
	private AudioSource[] myAudio;
	private AudioSource music1;
	private AudioSource music2;
	private bool  musicFlip;


	//----------------------------------------------------------------------
	// Level Definitions
	//----------------------------------------------------------------------

	private int[] GoalLimits =		// Baseline goals per level 
	{
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
		 1,0,0,0,0,0				// Level 18 *			
									// Last Level Random
	};
	
	private int[] GoalRandom =		// Baseline random goals
	{
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
		 5,4,3,2,1,0				// Level 18 *		
									// Last Level Random
	};
	

	private int[] GoalTypes =		// How many tile types per level
	{
		 4, 						// Tutorial Level 1
		 4, 						// Tutorial Level 2
		 4, 						// Tutorial Level 3
		 4, 						// Tutorial Level 4
		 4, 						// Tutorial Level 5
		 5, 						// Tutorial Level 6
		 5,							// Tutorial Level 7
		 4, 						// Level 0
		 6, 						// Level 1
		 4, 						// Level 2
		 6, 						// Level 3 *
		 5, 						// Level 4
		 6, 						// Level 5
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
	};


	private int[] GoalTileTypes = 	// Map the tiles used per
	{
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
	};
	
	private int[] LevelSize =		// Map the tiles used per level
	{
		 8,8,						// Tutorial Level 1
		 8,8,						// Tutorial Level 2
		 8,8,						// Tutorial Level 3
		 8,8,						// Tutorial Level 4
		 8,8,						// Tutorial Level 5
		 8,8,						// Tutorial Level 6
		 5,7,						// Tutorial Level 7
		 8,8,						// Level 0
		 7,6,						// Level 1
		 8,8,						// Level 2
		 8,6,						// Level 3 *
		 6,8,						// Level 4
		 8,7,						// Level 5
		 7,8,						// Level 6
		 7,8,						// Level 7 *
		 8,6,						// Level 8
		 7,7,						// Level 9
		 4,8,						// Level 10 *
		 8,8,						// Level 11
		 6,7,						// Level 12
		 6,8,						// Level 13 *
		 8,7,						// Level 14
		 7,8,						// Level 15
		 8,6,						// Level 16 *
		 8,8,						// Level 17 *
		 8,8						// Level 18 *
	};	
	
	private string[] LevelName =	// Names of the levels
	{
		 "WELCOME!",				// Tutorial Level 1
		 "DOWN TILES",				// Tutorial Level 2
		 "LEFT TILES",				// Tutorial Level 3
		 "RIGHT TILES",				// Tutorial Level 4
		 "FLIP BLANK TILES",		// Tutorial Level 5
		 "SPECIAL TILES",			// Tutorial Level 6
		 "BOARD SIZE",				// Tutorial Level 7
		 "CAT-LAP",					// Level 0
		 "AFTERNOONIFIED",			// Level 1
		 "RHINO",					// Level 2
		 "TO THE ELEPHANT",			// Level 3 *
		 "BATTY-FANG",				// Level 4
		 "BRICKY",					// Level 5
		 "BUTTER UPON BACON",		// Level 6
		 "DOOR-KNOCKER",			// Level 7 *
		 "ENTHUZIMUZZY",			// Level 8
		 "FIFTEEN PUZZLE",			// Level 9
		 "GAS-PIPES",				// Level 10 *
		 "GIGGLEMUG",				// Level 11 Fix this one!
		 "PODSNAPPERY",				// Level 12
		 "RAIN NAPPER",				// Level 13 *
		 "SKILAMALINK",				// Level 14
		 "SUGGESTIONIZE",			// Level 15
		 "LONDON PARTICULAR",		// Level 16
		 "TAKE THE EGG",			// Level 17
		 "S.T. INFINITE"			// Level 18	
	};
	
	private string[] LevelText =	// Text for the levels, if any
	{								
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
		 "Clicking MUSTACHE cubes\n"							// Tutorial Level 5	
		 +"RESET cubes in a cross pattern.\n\n"
		 +"Matched cubes turn into MUSTACHE cubes.\n"
		 +"These must be RE-FLIPPED to be REUSED.\n\n"
		 +"FLIP ENOUGH rows and columns to match\n"
		 +"three cubes thrice to continue!"
		 ,		
		 "Other cubes act DIFFERENTLY when matched.\n\n"		// Tutorial Level 6	
		 +"As MORE Levels are played,\n"
		 +"more cube types are REVEALED!\n\n"
		 +"Again, match 3 sets thrice to advance!"
		 ,					
		 "The board DIMENSIONS can change\n"					// Tutorial Level 7
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
	};

	private int[] TypeTypesRemove =		// Map the tiles used per
	{
		 1,0,0,0,0,0,0,0,0,				// Tutorial Level 1
		 0,1,0,0,0,0,0,0,0,				// Tutorial Level 2
		 0,0,0,1,0,0,0,0,0,				// Tutorial Level 3
		 0,0,1,0,0,0,0,0,0,				// Tutorial Level 4
		 0,0,0,0,0,0,0,0,0,				// Tutorial Level 5
		 1,1,1,0,1,1,1,1,1,				// Tutorial Level 6
		 1,1,1,0,1,1,1,1,1,				// Tutorial Level 7
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
	};	


	//======================================================================
	// Methods
	//======================================================================

	//----------------------------------------------------------------------
	// Unity Awake method
	void Awake()
	{
		// A singleton to access shared variables
		Instance = this;
	}


	//----------------------------------------------------------------------
	// Unity Start method
	void Start() 
	{
		// Get the global object for global vars
		globalObject = GameObject.Find("preGlobal");

		// Setup score levels
		scoreLevels = new int[NumGoals];		// Create the score level array
		levelGoalMax = new int[NumGoals];		// Create the score level array
		scoreRank = new int[NumGoals];			// Need to bootstrap everything else

		level = GetLevel();						// Load the level 1st
		mode = GetGameMode();					// Load the game mode

		// Only for tutorial level, when implemented
		if (mode == Global.ModeStandard) 
		{
			level = TutorialLevels;
		}

		// Setup the level and the board
		LoadClankLevel(level);
		SetupDynamicArrays();					// Setup all dynamic arrays
		SetupGameColors();						// Set the game colors
		CreateBoard();							// Create the board mainly
		CreateButtons();						// Create the buttons
		SetupButtonsLevel();					// Fix display of buttons
		CreateTileGoals();						// Create Tile Goals

		// Clear out the matches
		ClearIntBoard(matchCode, Global.TileIdClear, MaxWidth, MaxLength);		
		FindAllMatches();
		SetLastClickedXYHV(-1, -1, -1, -1);		// Init the last clicked global vars
		startMoveTime = Time.time;				// Init the time for move updates
		userClicked = false;

		// Update everything once to refresh and draw
		NewGameScoreSetup();
		UpdateCoins();
		UpdateScore();
		UpdateLevel();
		CreateCoins();

		// Load the audio sources
		SetupAudio();

		if (Global.Debug) {
			print("Start of Game ");
			print("==============");
			PrintBoard(boardId);
			print("==============");
		}

		// Remove tiles if scenario calls for it
		RemoveTiles();							// Remove tile types by level

		// The panic button is not on initially
		panicMeter = 0;

		// Setup music sources to alternate between levels
		music1 = myAudio[StartMusic];
		music1.Play();
		music1.enabled = true;
		music1.volume = MaxVolume;
		music2 = myAudio[StartMusic];
		music2.enabled = true;
		music2.volume = MaxVolume;
		musicFlip = false;
		
		// Update the background color
		background.GetComponent<Renderer>().sharedMaterial.color = 
			new Color(
				(level + Random.Range(0, 3)) % 5 / 10.0f, 
				(level + Random.Range(0, 4)) % 4 / 8.0f, 
				(level + Random.Range(0, 5)) % 3 / 6.0f,
				1.0f
			);
	}

	public void SetActiveRecursively(GameObject rootObject, bool active)
	{
		rootObject.SetActive(active);
		
		foreach (Transform childTransform in rootObject.transform)
		{
			SetActiveRecursively(childTransform.gameObject, active);
		}
	}

	//----------------------------------------------------------------------
	// Unity: Update method
	void Update()
	{
		float mn;		// The smallest screen dimension

		// Font resize if needed on fly
		if (_oldWidth != Screen.width || _oldHeight != Screen.height) 
		{
			_oldWidth = Screen.width;
			_oldHeight = Screen.height;
			mn = Screen.width < Screen.height ? Screen.width : Screen.height;
			fontSize = (int)(mn / Global.ScreenRatio);
		}

		// Turn the panic button on
		if (panicMeter >= MaxPanic && coins <= 5) 
		{		
			panicButton.gameObject.active = true;
			panicButton.gameObject.GetComponent<MeshRenderer>().enabled = true;
		}
		else
		{
			// Or turn it off
			panicButton.gameObject.active = false;
			panicButton.gameObject.GetComponent<MeshRenderer>().enabled = false;
		}

		timer -= Time.deltaTime;				// Decrease the timer.
		
		CheckMouse();							// Check touchscreen or mouse

		newFlips = true;						// Keep flipping tiles until cannot flip any.

		// While tiles are flipping, keep updating the board
		while (newFlips) 
		{
			ScoreTiles();
			CheckLevelUp();
			CheckGameOver();
			CheckMoveAfterMatches();
			newFlips = CheckAnyMatch();
		}

		// Shake the screen between levels
		if (shake_intensity > 0)
		{
			transform.position = originPosition + Random.insideUnitSphere * shake_intensity;
			transform.rotation = new Quaternion(
				originRotation.x + Random.Range(-shake_intensity,shake_intensity)*0.2f,
				originRotation.y + Random.Range(-shake_intensity,shake_intensity)*0.2f,
				originRotation.z + Random.Range(-shake_intensity,shake_intensity)*0.2f,
				originRotation.w + Random.Range(-shake_intensity,shake_intensity)*0.2f);
			shake_intensity -= shake_decay;
		}
	}


	//----------------------------------------------------------------------
	// Shake the screen (camera)
	void Shake(float si, float sd)
	{
		originPosition = transform.position;
		originRotation = transform.rotation;
		shake_intensity = si;
		shake_decay = sd;
	}


	//----------------------------------------------------------------------
	// Setup all Dynamic memory / arrays
	void SetupDynamicArrays()
	{
		// Creates the object arrays
		boardDraw = new GameObject[MaxBoardSize, MaxBoardSize];
		coinList = new GameObject[MaxCoins];								// Setup the coins array
		buttonDraw = new GameObject[MaxBoardSize + MaxBoardSize];		// Setup button arrays
		tileGoal = new GameObject[NumGoals];								// Setup goal objects
		tileGoalCount = new GameObject[NumGoals];

		// Create the logical 2D board and goal arrays
		boardId = new int[MaxBoardSize, MaxBoardSize];
		boardIdMatch = new int[MaxBoardSize, MaxBoardSize];				// Setup the match 2d arrays
		matchCode = new int[MaxBoardSize, MaxBoardSize];
		vMatch = new int[MaxBoardSize, MaxBoardSize];
		hMatch = new int[MaxBoardSize, MaxBoardSize];
		goalId = new int[NumGoals];

		// Random flip array
		RandomFlipListX = new int[MaxBoardSize * MaxBoardSize + 1];
		RandomFlipListY = new int[MaxBoardSize * MaxBoardSize + 1];

		// Setup audio array to pull sources into
		myAudio = new AudioSource[MaxSounds];

		// Possible tile colors
		colorRange = new Color[BoardColors + 1];							// Setup color arrays
	}


	//----------------------------------------------------------------------
	// Setup the class audio arrays pulling from AudioSources
	void SetupAudio()
	{
		int i;

		// Pull in all AudioSources from unity
		AudioSource[] aSources = GetComponents<AudioSource>();
		myAudio = new AudioSource[MaxSounds];
		for (i=0; i < aSources.Length; i++)
		{
			myAudio[i] = aSources[i];
		}
	}


	//----------------------------------------------------------------------
	// Setup starting scores and coins
	void NewGameScoreSetup()
	{
		score = 0;
		coins = StartCoins;
		coinsPrev = coins;
		coinListSize = coins;
		scoreDisp = 0;
		coinsDisp = coins;
	}
	
	
	//----------------------------------------------------------------------
	// Unity: OnGUI method
	void OnGUI()
	{	
		// Gui setup for screen size
		int screenHeight = Screen.height;
		int screenWidth = Screen.width;
		int r = screenHeight / 10;
		string soundState = soundOn ? "ON" : "OFF";
		string levelName;
		string endScore = "";
		float numStars = 0;
		int i;
		float t = (float) (int)(timer * 100.0f) % 100 / 100.0f;

		// Update all the screen text if needed
		UpdateCoins();
		UpdateScore();
		UpdateTimer();
		UpdatePercent();
		UpdateLevel();
		UpdateAllScores();					// Updates all the goals
		
		GUI.skin = CustomGUISkin;
		GUI.skin.label.font = GUI.skin.button.font = GUI.skin.box.font = font;
		GUI.skin.label.fontSize = GUI.skin.box.fontSize = GUI.skin.button.fontSize = fontSize;
		
		// LevelEnd Menu
		if (mode != Global.ModeTimed) 
		{
			if (levelEndOn && level > TutorialLevels) 
			{
				numStars = 6.0f * totalGoals / levelScore;
				if (numStars > 5) 
				{
					numStars = 5;
				}
				if (numStars < 1) 
				{
					numStars = 1;
				}
				for (i=0; i < numStars; i++) 
				{
					endScore += "(X)";
				}
				levelName = LevelName[level];
				if (mode == Global.ModeRandom) 
				{					// End of level for Random
					lastLevelName = "Random Scenario #" + (level - TutorialLevels);
					levelName = "Random Scenario #" + (level - TutorialLevels + 1);
				}
				
				GUI.BeginGroup( new Rect(r*3, r*1, screenWidth-r*3, r*6));
				nameText.GetComponent<Renderer>().material.color = new Color(t, 1.0f, 1.0f - t, 1.0f);
				nameText.GetComponent<TextMesh>().text = "Rating: " + endScore;
				GUI.Box( new Rect(0, r, screenWidth-r*6, r*5 + 10), "\n\nfor: " + lastLevelName);
				if (GUI.Button( new Rect(r/2, r*3, screenWidth-r*7, r*3), "Start: " + levelName)) 
				{
					levelEndOn = false;
					coins += (int)(numStars) * 2;
					levelScore = 0;
					panicButton.gameObject.active = false;
					panicButton.gameObject.GetComponent<MeshRenderer>().enabled = false;
					myAudio[12].Play();
				}
				GUI.EndGroup();
			}
			else 
			{
				UpdateLevelName();
				levelEndOn = false;
			}
		}
		else 
		{
			levelEndOn = false;				// It should not be on!
		}
		
		// Tutorial Menu
		if (tutorialOn) 
		{
			GUI.BeginGroup( new Rect(r, r, screenWidth, screenHeight-r));
			GUI.Box( new Rect(0, 0, screenWidth-r*2, screenHeight-r*2), "\n\n" + LevelText[level]);
			if (GUI.Button( new Rect(10, screenHeight-r*3-20, screenWidth-r*2-20, r), "BEGIN!")) 
			{
				myAudio[12].Play();
				tutorialOn = false;
			}
			GUI.EndGroup();
		}
		
		// In game menu
		if (menuOn) 
		{
			GUI.BeginGroup( new Rect(screenWidth/4, screenHeight/4 + r, screenWidth/2, screenHeight/4 + r*8));
			GUI.Box( new Rect(0, 0, screenWidth/2, r*6), "\n\nIn Game Options");
			if (GUI.Button( new Rect(10, r*2, screenWidth/2-20, r), "Return to Game")) 
			{
				myAudio[12].Play();
				menuOn = false;
			}

			if (GUI.Button( new Rect(10, r*3, screenWidth/2-20, r), "Sound [" + soundState + "]")) 
			{
				myAudio[12].Play();
				soundOn = ! soundOn;
				if (!soundOn) 
				{
					AudioListener.pause = true;
				}
				else 
				{
					AudioListener.pause = false;	
				}
			}
			if (GUI.Button( new Rect(10, r*4, screenWidth/2-20, r), "Quit to Main Menu")) 
			{
				ReturnToMenu();
			}
			GUI.EndGroup();
		}
		
		// This is the small in game menu button
		GUI.BeginGroup( new Rect(screenWidth - r*3, screenHeight - r, r*3, r));
		GUI.Box( new Rect(0, 0, r*3, r), "");
		if (GUI.Button( new Rect(0, 0, r*3, r), "Menu")) 
		{
			menuOn = true;
			myAudio[12].Play();
		}
		GUI.EndGroup();
	}


	//----------------------------------------------------------------------
	// Return to the menu scene
	void ReturnToMenu()
	{
		myAudio[12].Play();
		soundOn = true;
		AudioListener.pause = false;
		globalObject.GetComponent<Global>().score = score;
		SetGlobals();
		Application.LoadLevel("sceneStart");
	}


	//----------------------------------------------------------------------
	// Remove tiles as per the level
	void RemoveTiles()
	{
		int x;		// Index the grid by x
		int y;		// Index the grid by y
		for (x=0; x < boardWidth; x++) 
		{
			for (y = 0; y < boardLength; y++) 
			{				// Check for any objects moving
				if (boardId[x, y] >= 1 && boardId[x, y] <= 9) 
				{
					if (! MapRemoveTilesByLevel(boardId[x, y])) 
					{
						SetTileColorId(x, y, Global.TileIdClear);
					}
				}
			}
		}
	}
	
	//----------------------------------------------------------------------
	// Map tile by level tile mapping array
	bool MapRemoveTilesByLevel (int id)
	{
		return IntToBool(TypeTypesRemove[level * 9 + (id - 1)]);
	}


	//----------------------------------------------------------------------
	// IntToBool
	bool IntToBool(int i)
	{
		return i == 0 ? false : true;
	}

	
	//======================================================================
	// Aux. methods
	//======================================================================
	
	//----------------------------------------------------------------------
	// CheckGameOver: 	Out of Moves and or Coins?
	void CheckGameOver() 
	{
		float t = (int)(timer * 100.0f) % 100 / 100.0f;
		if (coins <= 0) 
		{								// If no more coins, game is over.
			nameText.GetComponent<Renderer>().material.color = new Color(1.0f, 1.0f - t, t, 1.0f);
			nameText.GetComponent<TextMesh>().text = "Out of Moves!";
			SetGlobals();
			StartCoroutine(LoadLoseLevel());
		}
		if (mode == Global.ModeTimed && timer <= 0) 
		{								// If no more timer, game is over.
			nameText.GetComponent<Renderer>().material.color = new Color(1.0f, t, 1.0f - t, 1.0f);
			nameText.GetComponent<Renderer>().material.color = new Color();
			nameText.GetComponent<TextMesh>().text = "Out of Time!";
			SetGlobals();
			StartCoroutine(LoadLoseLevel());
		}
	}


	//----------------------------------------------------------------------
	// Wait before loading next level
	IEnumerator LoadLoseLevel()
	{
		yield return new WaitForSeconds(3.0f);
		Application.LoadLevel("sceneLose");
	}


	//----------------------------------------------------------------------
	// Load next level?
	void CheckLevelUp()
	{
		if (GoalsFinished()) 
		{							// Load new level unless out of levels
			if (level >= Levels + 1) 
			{
				globalObject.GetComponent<Global>().score = score;
				SetGlobals();
				StartCoroutine(LoadLoseLevel());
			} 
			else 
			{
				lastLevelName = LevelName[level];
				if (level < Levels) 
				{					// Last level goes random
					level++;
				}
				ClearAllTile();							// Clear all the tile out
				LoadClankLevel(level);
				ClearIntBoard(boardId, Global.TileIdFlip, boardWidth, boardLength);
				SetupButtonsLevel();					// Setup the buttons per level

				if (level > TutorialLevels) 
				{
					// coins += level / 4;
				}
				else 
				{
					coins = StartCoins;				// reset the number of  coins during tutorial
					score = 0;							// reset the score!
					scoreDisp = 0;						// and the scoreDisplay
				}
				
				menuOn = false;
				levelEndOn = true;
				Shake(0.01f, 0.0005f);
				
				if (!musicFlip) 
				{
					music2 = myAudio[StartMusic + level % 14];
					music2.Play();
					music2.volume = MaxVolume;
					music1.Stop();
				}
				else 
				{
					music1 = myAudio[StartMusic + level % 14];
					music1.Play();
					music1.volume = MaxVolume;
					music2.Stop();
				}
				musicFlip = !musicFlip;

				RemoveTiles();
			}
		}
	}


	//======================================================================
	// Tile movement methods
	//======================================================================
	
	//----------------------------------------------------------------------
	// Move a vertical col to up with wraparound
	void MoveVertical(int col)
	{
		int i;					// Loop veriable
		int lastTile			= boardId[boardWidth - 1, col];
		GameObject lastDraw		= boardDraw[boardWidth - 1, col];
		
		for (i = boardWidth - 1 ; i >= 1; i--) 
		{			// Shift the ID array
			boardId[i, col] = boardId[i - 1, col];
			boardDraw[i, col] = boardDraw[i - 1, col];
		}
		boardId[0, col] = lastTile;							// Handle the 1st tile and last tile
		boardDraw[0, col] = lastDraw;
		for (i = 0 ; i < boardWidth; i++) 
		{					// Move the Unity tiles, no animation for now.
			UpdateTileName(boardDraw, i, col);
			if (Global.Debug) 
			{
				print("=|=-|-=|=-> " + new Vector3(col, i, col) + " | " + boardDraw[i, col].transform.name);
			}
		}
	}


	//----------------------------------------------------------------------
	// Reverse Move a vertical col to up with wraparound
	void MoveVerticalReverse(int col)
	{
		int i;					// Loop veriable
		int lastTile			= boardId[0, col];
		GameObject lastDraw		= boardDraw[0, col];
		
		for (i = 0 ; i < boardWidth - 1; i++) 
		{			// Shift the ID array
			boardId[i, col] = boardId[i + 1, col];
			boardDraw[i, col] = boardDraw[i + 1, col];
		}

		boardId[boardWidth - 1, col] = lastTile;			// Handle the 1st tile and last tile
		boardDraw[boardWidth - 1, col] = lastDraw;
		for (i = 0 ; i < boardWidth; i++) 
		{				// Move the Unity tiles, no animation for now.
			UpdateTileName(boardDraw, i, col);
			if (Global.Debug) 
			{
				print("-> " + new Vector3(col, i, col) + " | " + boardDraw[i, col].transform.name);
			}
		}
	}


	//----------------------------------------------------------------------
	// Move a vertical col to up with wraparound
	void MoveHorizontal(int row)
	{
		int i;					// Loop veriable
		int lastTile			= boardId[row, boardLength - 1];
		GameObject lastDraw		= boardDraw[row, boardLength - 1];
		
		for (i = boardLength - 1 ; i >= 1; i--) 
		{			// Shift the ID array
			boardId[row, i] = boardId[row, i - 1];
			boardDraw[row, i] = boardDraw[row, i - 1];
		}

		boardId[row, 0] = lastTile;							// Handle the 1st tile and last tile
		boardDraw[row, 0] = lastDraw;
		for (i = 0 ; i < boardLength; i++) 
		{				// Move the Unity tile names
			UpdateTileName(boardDraw, row, i);
			if (Global.Debug) 
			{
				print("-> " + new Vector3(row, i, 1) + " | " + boardDraw[row, i].transform.name);
			}
		}
	}


	//----------------------------------------------------------------------
	// Reverse Move a vertical col to up with wraparound
	void MoveHorizontalReverse(int row)
	{
		int i;					// Loop veriable
		int lastTile			= boardId[row, 0];
		GameObject lastDraw		= boardDraw[row, 0];
		
		for (i = 0 ; i < boardLength - 1; i++) 
		{			// Shift the ID array
			boardId[row, i] = boardId[row, i + 1];
			boardDraw[row, i] = boardDraw[row, i + 1];
		}

		boardId[row, boardLength - 1] = lastTile;			// Handle the 1st tile and last tile
		boardDraw[row, boardLength - 1] = lastDraw;
		for (i = 0 ; i < boardLength; i++) 
		{				// Move the Unity tile names
			UpdateTileName(boardDraw, row, i);
			if (Global.Debug) 
			{
				print("-> " + new Vector3(row, i, 1) + " | " + boardDraw[row, i].transform.name);
			}
		}
	}
	
	//----------------------------------------------------------------------
	// Check if anything is still moving
	// @TODO - fix!
	public bool movingObjects()
	{
		int x;		// Index the grid by x
		int y;		// Index the grid by y

		for (x=0; x < boardWidth; x++) 
		{
			for (y = 0; y < boardLength; y++) 
			{				// Check for any objects moving
				// coinList[x].GetComponent<Coins>().staticObject
				//if (! boardDraw[x, y].GetComponent<Cube>.staticObject) 
				//{
				//	return true;
				//}
			}
		}
		return false;
	}
	
	//----------------------------------------------------------------------
	// Check if anything is still moving
	public bool coinsMoving()
	{
		int x;						// Index the grid by x

		for (x=0; x < coinListSize; x++) 
		{					// Check if any coins moving
			if (! coinList[x].GetComponent<Coins>().staticObject) 
			{
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
	void ScoreTiles()
	{
		bool areWeMoving;		// Are any tiles in motion?
		int m;					// Index the new matches
		int x;					// Index the grid by x
		int y;					// Index the grid by y
		bool exitLoop;			// Time to exit out of inner 2 loops
		int multiple;			// Multiple match count
		
		multiple = 0;						// No multiple matches yet
		areWeMoving = movingObjects();		// Get info, is anything moving?
		if (!areWeMoving) 					// If not, then can check to score tiles
		{										
			if (!IsEmpty2dIntArrayIf(matchCode)) 
			{
				for (m = prevMatchCount; m < matchCount; m++) 
				{
					exitLoop = false;
					for (x = 0; x < boardWidth && !exitLoop; x++) 
					{
						for (y = 0; y < boardLength && !exitLoop; y++) 
						{
							// We found a match
							if (matchCode[x, y] == m) 
							{				
								exitLoop = true;				// Do our thing and get out of this loop
								UpdateMatchGoals(m, x, y);		// Update our match goals and text
								multiple++;						// Add 1 to the multiple
								score += 1;
								panicMeter += 1;
								myAudio[13 + score % 4].Play();	// Play sound modulo 4
								scrambleMeter = MaxScramble + Random.Range(0,5);
								scoreDisp = score;

								// Special effect for >=3 for tile type
								if (boardId[x, y] == -4) 
								{	
									CreateLightningBall(x,y);
								}
								// Special effect for >=3 for tile type
								if (boardId[x, y] == -5) 
								{		
									CreateLightningStrike(x,y);
								}
								
								// Try to move tile based on match tile
								if (boardId[x, y] <= -3) 
								{
									// Special effect for >=3 for tile type
									MoveOnTile(boardIdMatch[x,y], m);
									if (Global.Debug) 
									{
										print("====>>>////////////////////////////////");
										PrintBoard(boardIdMatch);
										print("====>>>////////////////////////////////");
									}

								}							
							}
						}
					}
				} 

				Set2dIntArrayIf(matchCode, m, 0);				// Clear the matched code from the matchCode array
				// *** Score for multiples ***
				if (multiple > 1) 								// We have multiple matches
				{									
					int scoreIdx= multiple + 1;					// Handle +3, +4, +5 sized matches at scoreLevels[0], [1], [2]
					// The match score is greater than zero, so subtract 1
					multiple = multiple > 3 ? 3 : multiple;		// Multiple maxes out at triples
					score += 3 * multiple;
					scrambleMeter = MaxScramble + Random.Range(0,5);
					panicMeter += 3 * multiple;
					scoreDisp = score;
					coins += multiple;
					if (scoreIdx >= NumGoals) 
					{
						scoreIdx = NumGoals - 1;
					}
					scoreRank[scoreIdx]++;
					if (scoreLevels[scoreIdx] > 0) 
					{
						scoreLevels[scoreIdx]--;				// One less goal
						UpdateScore();							// Update the count of things completed
					} // Multiples are here
					if (Global.Debug || Global.DebugSpecial == 1) 
					{
						print("UPDATE MULTIPLE SCORE: at " + scoreIdx + " = " + scoreLevels[scoreIdx]);
					}
					// Zap multiples!
					CreateLightningStrike(5,5);
					CreateLightningStrike(10,10);
					CreateLightningStrike(10,0);
					CreateLightningBall(5,5);
				} 
			} 

			ClearIntBoard(matchCode, 0, MaxWidth, MaxLength);						// Clear all the matches!
			if (coins - 10 > coinsPrev) 
			{	
				coins = coinsPrev + 10;		// Max the coins
			}
		}
	}


	//----------------------------------------------------------------------
	// Move on tile type direction and special moves
	void MoveOnTile(int id, int m)
	{
		if (Global.Debug) 
		{
			print("***MOVING!!!: " + id);
		}
		if (id == 0) 
		{
			MoveOnMatches(m, "down");
		}
		else if (id == 1) 
		{
			MoveOnMatches(m, "up");
			myAudio[9].Play();
		}
		else if (id == 2) 
		{
			MoveOnMatches(m, "down");
			myAudio[9].Play();
		}
		else if (id == 3) 
		{
			MoveOnMatches(m, "left");
			myAudio[9].Play();
		}
		else if (id == 4) 
		{
			MoveOnMatches(m, "right");
			myAudio[9].Play();
		}
		else if (id == 5) 
		{
			MoveOnMatches(m, "light");
			myAudio[7].Play();
		}
		else if (id == 6) 
		{
			MoveOnMatches(m, "eye");
			myAudio[9].Play();
		}
		else if (id == 7) 
		{
			MoveOnMatches(m, "gear");
			myAudio[6].Play();
		}
		else if (id == 8) 
		{
			coins--;
			MoveOnMatches(m, "skull");
			myAudio[0].Play();
		}
		else if (id == 9) 
		{
			MoveOnMatches(m, "magnet");
			myAudio[5].Play();
		}
	}


	//----------------------------------------------------------------------
	// Move in some pattern based on matches.
	void MoveOnMatches(int m, string op)
	{
		int x;					// Index the grid by x
		int y;					// Index the grid by y
		int move_index;			// Index we moved
		if (Global.Debug) 
		{
			print("1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-");
			PrintBoard(matchCode);
			print("1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-");
		}
		move_index = -1;
		for (x = 0; x < boardWidth; x++) 
		{
			for (y = 0; y < boardLength; y++) 
			{
				if (matchCode[x,y] == m && move_index != x) 
				{
					if (op == "down") 
					{
						MoveHorizontalReverse(x);
						move_index = x;
					}
					else if (op == "up" && move_index != x) 
					{
						MoveHorizontal(x);
						move_index = x;
					}
					else if (op == "right" && move_index != y) 
					{
						MoveVerticalReverse(y);
						move_index = y;
					}
					else if (op == "left" && move_index != y) 
					{
						MoveVertical(y);
						move_index = y;
					}
					else if (op == "eye") 
					{
						FlipSurround(m,x,y);
					}
					else if (op == "gear") 
					{
						MoveGear();
					}
					else if (op == "light") 
					{
						MoveLight();
					}
					else if (op == "skull") 
					{
						MoveSkull();
					}
					else if (op == "magnet") 
					{
						// Just move some things somewhat. Makes no sense but changes board.
						MoveVerticalReverse(y);
						MoveHorizontalReverse(x);
					}
				}
			}
		}

		// Flip back the middle of the eye tiles
		for (x = 0; x < boardWidth; x++)
		{
			for (y = 0; y < boardLength; y++) 
			{
				if (matchCode[x,y] == m && move_index != x)
				{
					if (op == "eye")
					{
						boardId[x,y] = -3;
					}
				}
			}
		}
	}

	
	//----------------------------------------------------------------------
	// Restore all the other flipped tiles.
	void MoveSkull()
	{
		int c = Random.Range(1,3);	// The number of flips
		int i; 						// Loop var
		// Set a random tile to -3 so it will flip to clear, no coins scored.
		for (i=0; i<c; i++)
		{
			boardId[Random.Range(0,boardWidth), Random.Range(0,boardLength)] = -3;
		}
	}

	
	//----------------------------------------------------------------------
	// Restore all the other flipped tiles.
	void MoveLight()
	{
		int x;			// Index the grid by x
		int y;			// Index the grid by y
		for (x = 0; x < boardWidth; x++) 
		{
			for (y = 0; y < boardLength; y++) 
			{
				if (boardId[x, y] == Global.TileIdClear) 
				{
					boardId[x, y] = Global.TileIdFlip;
				}
			}
		}
	}


	//----------------------------------------------------------------------
	// Flip all tiles surrounding a location
	void FlipSurround(int m, int i, int j)
	{
		boardId[(i+boardWidth-1)%boardWidth, (j+boardLength-1)%boardLength] = Global.TileIdFlip;
		boardId[(i+boardWidth-1)%boardWidth, j] = Global.TileIdFlip;
		boardId[(i+boardWidth-1)%boardWidth, (j+1)%boardLength] = Global.TileIdFlip;
		boardId[i, (j+boardLength-1)%boardLength] = Global.TileIdFlip;
		boardId[i, (j+1)%boardLength] = Global.TileIdFlip;
		boardId[(i+1)%boardWidth, (j+boardLength-1)%boardLength] = Global.TileIdFlip;
		boardId[(i+1)%boardWidth, j] = Global.TileIdFlip;
		boardId[(i+1)%boardWidth, (j+1)%boardLength] = Global.TileIdFlip;
	}


	//----------------------------------------------------------------------
	// Criss Cross
	void MoveGear()
	{
		MoveHorizontal(0);
		MoveVertical(boardLength - 1);
		MoveHorizontalReverse(boardWidth - 1);
		MoveVerticalReverse(0);
	}
	

	//----------------------------------------------------------------------
	// Update the matching goals
	void UpdateMatchGoals(int m, int x, int y)
	{
		int matchSize = -boardId[x,y];					// Get the size of the match (stored as a negative size
		int scoreIdx = matchSize - 3;					// Handle +3, +4, +5 sized matches at scoreLevels[0], [1], [2]
		if (Global.Debug || Global.DebugSpecial == 1) 
		{
			print("!Match************* m:" + m + " x:" + x + " y:" + y + " matchSize:" + matchSize);
			PrintBoard(boardId);
			print("scoreIdx: " + scoreIdx);
			print("!******************");
		}

		if (scoreIdx >= 0 && scoreIdx < NumGoals) 
		{
			coins += scoreIdx + 1;
			scoreRank[scoreIdx] += 1;					// Update scores, or number completed.
		}

		if (scoreIdx >= 0 && scoreIdx < NumGoals) 
		{			// The match score is greater than zero, so subtract 1
			if (scoreLevels[scoreIdx] > 0) 
			{
				scoreLevels[scoreIdx]--;
				UpdateScore();							// UpdateScoreDisplay(scoreIdx);
				if (Global.Debug) 
				{
					print("UPDATE MATCH SCORE: at " + scoreIdx + " = " + scoreLevels[scoreIdx]);
				}
			}
		}
	}


	//----------------------------------------------------------------------
	// Clear matching ints on a 2D array
	void Set2dIntArrayIf(int[,] arr, int m, int val)
	{
		int x;			// Index the grid by x
		int y;			// Index the grid by y
		for (x = 0; x < boardWidth; x++) 
		{
			for (y = 0; y < boardLength; y++) 
			{
				if (arr[x, y] == m) 
				{
					arr[x, y] = val;
				}
			}
		}
	}


	//----------------------------------------------------------------------
	// Set 2D array if other array set to something
	void Set2dIntArrayIfOtherArray(int[,] arr, int[,] other, int m, int val)
	{
		int x;					// Index the grid by x
		int y;					// Index the grid by y
		for (x = 0; x < boardWidth; x++)
		{
			for (y = 0; y < boardLength; y++) 
			{			// If other array matches, set the array element to val
				if (other[x, y] == m) 
				{
					print ("Changing array " + x + "/" + y + " = " + val);
					arr[x, y] = val;
				}
			}
		}
	}


	//----------------------------------------------------------------------
	// Boolean, return true if 2d array is all zero
	bool IsEmpty2dIntArrayIf(int[,] arr)
	{
		int x;					// Index the grid by x
		int y;					// Index the grid by y
		for (x = 0; x < boardWidth; x++) 
		{
			for (y = 0; y < boardLength; y++) 
			{
				if (arr[x, y] != 0) 
				{
					return false;
				}
			}
		}
		return true;
	}


	//----------------------------------------------------------------------
	// Check the 2d array to see if element int exists in the array
	bool Check2dIntArrayIf(int[,] arr, int m)
	{
		int x;					// Index the grid by x
		int y;					// Index the grid by y
		for (x = 0; x < boardWidth; x++)
		{
			for (y = 0; y < boardLength; y++)
			{
				if (arr[x, y] == m)
				{
					return true;
				}
			}
		}
		return false;
	}


	//----------------------------------------------------------------------
	// Reset tiles in a direction
	void ResetTileDirection(int x, int y, int xd, int yd)
	{
		x += xd;
		y += yd;
		while(x>=0 && x<boardWidth && y>=0 && y<boardLength && boardId[x,y] == Global.TileIdClear) 
		{
			boardId[x,y] = Global.TileIdFlip;					// New tile
			x += xd;									// Move location
			y += yd;
		}
	}


	//----------------------------------------------------------------------
	// Reset tiles that are ID = -1 (TILEID_CLEAR) in a cross.
	void ResetTileCross (int x, int y)
	{
		ResetTileDirection(x, y, 1, 0);
		ResetTileDirection(x, y, 0, 1);
		ResetTileDirection(x, y, -1, 0);
		ResetTileDirection(x, y, 0, -1);
		boardId[x,y] = Global.TileIdFlip;
	}


	//======================================================================
	// Controls
	//======================================================================
	
	//----------------------------------------------------------------------
	// Check mouse click
	void CheckMouse()
	{
		int x = 0;		// Index the grid by x
		int y = 0;		// Index the grid by y
		string hitGameObjectName;
		string tileName;
		bool  areWeMoving;
		float pastMoveTime;
		float newTime;
		int prevCoins;
		int i;
		RaycastHit hit = new RaycastHit();		// Create a raycast
		Ray ray;


		prevCoins = coins;
		areWeMoving = movingObjects();									// Check if any objects are moving
		
		if (Global.Debug) 
		{
			print("areWeMoving : " + areWeMoving);
			print("menuOn : " + menuOn);
			print("tutorialOn : " + tutorialOn);
			print("levelEndOn : " + levelEndOn);
			print("mouse : " + Input.GetMouseButtonDown(0));
		}

		// If the mouse button is clicked and there are no moving objects, and coins left.
		if (Input.GetMouseButtonDown(0) && !areWeMoving && coins > 0 && !menuOn && !tutorialOn && !levelEndOn) 
		{
			ray = Camera.main.ScreenPointToRay(Input.mousePosition);

			if (Physics.Raycast(ray, out hit, RayDistance)) 
			{				// Get the name of the tile
				hitGameObjectName = hit.collider.gameObject.name;
				tileName = GetObjNamePrefix(hitGameObjectName);			// Did we hit a tile?

				if (Global.Debug) 
				{
					print("full-name: " + hitGameObjectName);
					print("name-hit: " + tileName);
				}

				if (tileName == "H" || tileName == "V" || tileName  == "tile" || tileName == "prePanic") 
				{	
					// Horizontal or Vertical move
					newTime = Time.time;
					pastMoveTime = newTime - startMoveTime;
					if (pastMoveTime >= MoveDelay) 
					{
						userClicked = false;
					}

					if (!userClicked && pastMoveTime >= MoveDelay) 
					{	// Don't allow move unless 
						startMoveTime = newTime;						// Reset the last move start time
						userClicked = true;
						if (tileName != "prePanic") 
						{
							x = GetTileX(hitGameObjectName);				// Get tile number into (x)
						}	

						if (tileName != "H" && tileName != "V" && tileName != "prePanic") 
						{
							y = GetTileY(hitGameObjectName);
						}

						if (tileName  == "tile") 
						{	
							scrambleMeter--;				

							if (x < boardWidth && y < boardLength) 
							{
								SetLastClickedXYHV(x, y, -1, -1);

								if (Global.Debug || Global.DebugSpecial == 1) 
								{
									print("you hit an object: " + tileName + " [" + x + " , " + y + "] " + boardId[x,y]);
								}

								if (boardId[x,y] == Global.TileIdClear) 
								{				// Has to be a cleared tile
									coins--;
									levelScore++;								// One more move.
									myAudio[7].Play();
									ResetTileCross(x,y);
									myAudio[10].Play();
								}
							}
							
						} 
						else if (tileName == "H" && x < boardWidth) 
						{							// Horizontal Move
							scrambleMeter--;
							coins--;
							levelScore++;								// One more move.
							SetLastClickedXYHV(-1, -1, x, -1);
							MoveHorizontal(x);
							if (Global.Debug) 
							{
								print("Horizontal Post-Move: " + tileName + " [" + x + "]");
								print("==============");
								PrintBoard(boardId);
								print("==============");
							}
							myAudio[7].Play();
						}
						else if (tileName == "V" && (x - MaxWidth) < boardLength) 
						{						// Vertical Move
							scrambleMeter--;
							coins--;
							levelScore++;
							SetLastClickedXYHV(-1, -1, -1, x - MaxWidth);
							MoveVertical(x - MaxWidth);
							if (Global.Debug) 
							{
								print("Vertical Post-Move: " + tileName + " [" + (x - MaxWidth) + "]");
								print("--------------");
								PrintBoard(boardId);
								print("--------------");
							}
							// Play a movement sound
							myAudio[7].Play();
						}
						else if (tileName == "prePanic" && coins <= 5 && panicMeter > MaxPanic) 
						{
							PanicButton();
						}

						if (coins <= 0 && panicMeter > MaxPanic) 
						{		// Auto panic!
							PanicButton();
						}
					}

					if (scrambleMeter <= 0) 
					{
						for (i = 0; i < level - TutorialLevels; i++) 
						{
							MoveSkull();
						}
						scrambleMeter = MaxScramble + Random.Range(0,5);
					}
				} 
			} 
			CheckMoveAfterMatches();

			if (prevCoins - 1 == coins)
			{
				FlipOneRandomTile();
			}
			// @TODO Put this here?
			//TileCompress();
		}

		// Android Back Key
		if (Input.GetKeyDown(KeyCode.Escape))
		{ 
			ReturnToMenu();
		}

	}


	//----------------------------------------------------------------------
	void PanicButton()
	{
		ClearIntBoard(boardId, Global.TileIdFlip, boardWidth, boardLength);
		score /= 2;
		scoreDisp = score;
		coins += 10;
		coinsPrev = coins;
		coinsDisp = coins;
		myAudio[7].Play();
		myAudio[10].Play();
		panicMeter = 0;			// Reset the panic meter after used.
		scrambleMeter = MaxScramble + Random.Range(0,5);
		panicButton.gameObject.active = false;	// Turn it off
		panicButton.gameObject.GetComponent<MeshRenderer>().enabled = false;
	}


	//----------------------------------------------------------------------
	// Flip one Random tile.
	void FlipOneRandomTile()
	{
		int x;						// Index the grid by x
		int y;						// Index the grid by y
		int c;						// Count
		c = 0;
		for (y = 0; y < boardLength; y++) 
		{
			for (x = 1; x < boardWidth; x++) 
			{		
				if (boardId[x, y] == Global.TileIdClear) 
				{
					RandomFlipListX[c] = x;
					RandomFlipListY[c] = y;
					c++;
				}
			}
		}
		if (c > 0) 
		{
			c = Random.Range(0,c-1);		// Get a random range for the blank tiles
			boardId[RandomFlipListX[c], RandomFlipListY[c]] = Global.TileIdFlip;	// Flip it back
		}
	}


	//----------------------------------------------------------------------
	// Compress the tiles
	void TileCompress()
	{
		int x;						// Index the grid by x
		int y;						// Index the grid by y
		int lastClear;						// Last clear index

		for (x = 0; x < boardWidth; x++) 
		{	
			lastClear = -1;
			for (y = 0; y < boardLength; y++) 
			{
				if (boardId[x, y] == Global.TileIdClear) 
				{
					lastClear = y;
				}
				else if (boardId[x, y] != Global.TileIdClear && lastClear != -1) 
				{
					print("in");
					boardId[x, lastClear] = boardId[x, y];
					boardId[x, y] = Global.TileIdClear;
					boardDraw[x, lastClear] = boardDraw[x, y];
					SetTileColorId(x, y, Global.TileIdClear);
					//UpdateTileName(boardDraw, x, y);
					lastClear = -1;
				}
			}
		}
	}


	//----------------------------------------------------------------------
	void TileSlideDown(int x , int y)
	{
		int j;
		int c; 						// Count

		c = 0;
		for (j = 0; j < boardLength; j++) 
		{	
			if (boardId[x, y] == Global.TileIdClear) 
			{
				c++;
			}
		}
	}
	
	
	//======================================================================
	// !CHECK AND !PROCESS !MATCHES
	//======================================================================
	
	//----------------------------------------------------------------------
	// Check to see if there are any matches
	void CheckMoveAfterMatches()
	{
		FindAllMatches();
		ProcessAllMatches();
		if (Global.Debug && Global.DebugSpecial >= 2)
		{
			print("++++++++++++++");
			print("After Process");
			PrintBoard(boardId);
			print("++++++++++++++");
		}
		FindAllMatches();								// Check again to fix the arrays
	}


	//----------------------------------------------------------------------
	// Check both H and V for matches
	void FindAllMatches()
	{
		FindVerticalMatches();
		FindHorizontalMatches();
	}


	//----------------------------------------------------------------------
	// Process Horizinal and Vertical matches
	void ProcessAllMatches()
	{
		ClearIntBoard(boardIdMatch, 0, MaxWidth, MaxLength);
		ProcessVerticalMatches();
		ProcessHorizontalMatches();
	}


	//----------------------------------------------------------------------
	// Process any vertical matches and resolve, set to ?? tiles
	void ProcessHorizontalMatches()
	{
		int x;						// Index the grid by x
		int y;						// Index the grid by y
		bool  run;					// Process a run
		int current;						// Current value
		int highest;						// Highest value at start of run
		int runSize;						// Size of run
		
		for (y = 0; y < boardLength; y++)
		{
			for (x = boardWidth - 1; x >= 0; x--) 
			{        	// See if found a match, scan backwards for high number
				if (hMatch[x, y] >=  MinShapeSize && boardId[x,y] > 0) 
				{
					run = true;
					highest = hMatch[x, y];					// Will be decemented to count
					runSize = highest; 						// Save to make tile -runSize
					while (run) 
					{
						current = hMatch[x, y];
						if (Global.Debug) 
						{
							print("Match: " + x + "," + y + " || " + highest);
						}
						highest--;
						if (highest >= 0) 
						{
							boardIdMatch[x,y] = boardId[x,y];
							boardId[x,y] = - runSize;
							matchCode[x,y] = matchCount;
						}
						else 
						{
							run = false;
						}
						x--;
						if (x < 0 ||  hMatch[x, y] >= current) 
						{
							run = false;
						}
					} 
					matchCount++;
				} 
			} 
		} 
	}


	//----------------------------------------------------------------------
	// Process any vertical matches and resolve, set to ?? tiles
	void ProcessVerticalMatches()
	{
		int x;						// Index the grid by x
		int y;						// Index the grid by y
		bool  run;					// Process a run
		int current;						// Current value
		int highest;						// Highest value at start of run
		int runSize;						// Size of run
		
		for (x = 0; x < boardWidth; x++)
		{					// Assume nothing flipped
			for (y = boardLength - 1; y >= 0; y--)
			{
				// See if found a match, scan backwards for high number
				if (vMatch[x, y] >=  MinShapeSize && boardId[x,y] > 0)
				{
					run = true;
					highest = vMatch[x, y];					// Current highest will be depreciated
					runSize = highest; 						// Save to make tile -runSize
					while (run)
					{
						current = vMatch[x, y];
						if (Global.Debug)
						{
							print("Match: " + x + "," + y + " || " + highest);
						}
						highest--;
						if (highest >= 0)
						{        			// Flip the id of this tile to the size of the match
							boardIdMatch[x,y] = boardId[x,y];
							boardId[x,y] = -runSize;
							matchCode[x,y] = matchCount;
						}
						else
						{
							run = false;
						}
						y--;
						if (y < 0 ||  vMatch[x, y] >= current)
						{
							run = false;
						}
					} 
					matchCount++;
				} 
			} 
		} 
	}


	//----------------------------------------------------------------------
	// Find horizontal matches and build a horizontal match array hMatch
	void FindHorizontalMatches()
	{
		int x;						// Index the grid by x
		int y;						// Index the grid by y
		ClearIntBoard(hMatch, 0, MaxWidth, MaxLength);
		for (y = 0; y < boardLength; y++)
		{
			for (x = 1; x < boardWidth; x++)
			{				// Check if adjacent match, but not for neutral squares
				if (boardId[x, y] > 0 && boardId[x, y] == boardId[x - 1, y])
				{
					if (hMatch[x - 1, y] == 0)
					{
						hMatch[x - 1, y] = 1;
					}
					hMatch[x, y] = hMatch[x - 1, y] + 1;
				}
			}
		}
		if (Global.Debug && Global.DebugSpecial >= 2)
		{
			print("------Horizontal------");
			PrintBoard(hMatch);
		}
	}


	//----------------------------------------------------------------------
	// Find vertical matches and build a horizontal match array vMatch
	void FindVerticalMatches()
	{
		int x;						// Index the grid by x
		int y;						// Index the grid by y
		ClearIntBoard(vMatch, 0, MaxWidth, MaxLength);
		for (x = 0; x < boardWidth; x++)
		{
			for (y = 1; y < boardLength; y++)
			{
				if (boardId[x, y] > 0 && boardId[x, y] == boardId[x, y - 1])
				{
					if (vMatch[x, y - 1] == 0)
					{
						vMatch[x, y - 1] = 1;
					}
					vMatch[x, y] = vMatch[x, y - 1] + 1;
				}
			}
		}
		if (Global.Debug && Global.DebugSpecial >= 2)
		{
			print("------Vertical------");
			PrintBoard(vMatch);
		}
	}


	//----------------------------------------------------------------------
	// Is there at least one match >= MinShapeSize, direction = 'H' or 'V'
	bool CheckMatch(string direction)
	{
		int x;						// Index the grid by x
		int y;						// Index the grid by y
		bool  match;				// Is there a match of >= MinShapeSize
		match = false;
		for (x=0; x < boardWidth; x++)
		{
			for (y=0; y < boardLength; y++)
			{
				if (direction == "H" && hMatch[x, y] >= MinShapeSize || direction == "V" && vMatch[x, y] >= MinShapeSize )
				{
					match = true;
				}
			}
		}
		return match;
	}


	//----------------------------------------------------------------------
	// Is there any match?
	bool CheckAnyMatch()
	{
		return CheckMatch("H") || CheckMatch("V");
	}


	//======================================================================
	// Board creation methods
	//======================================================================

	//----------------------------------------------------------------------
	// Clear a 2d int array
	void ClearIntBoard(int[,]b, int v, int w, int l)
	{
		int x;						// Index the grid by x
		int y;						// Index the grid by y
		for (x=0; x < w; x++)
		{
			for (y=0; y < l; y++)
			{
				b[x, y] = v;
			}
		}
	}


	//----------------------------------------------------------------------
	// Global.Debug use only: Check the game board for matches
	void PrintBoard (int[,] b)
	{
		int x;						// Index the grid by x
		int y;						// Index the grid by y
		string rowString;			// The string
		string entry;				// A grid entry
		string pad;					// Leading pad

		// print the game board;
		for (y = boardLength - 1 ; y >= 0  ; y--)
		{
			rowString = "";
			for (x = 0 ; x < boardWidth ; x++)
			{
				pad = "  ";
				if (b[x, y] < 0)
				{
					pad = " ";
				}
				entry = pad + b[x, y];
				entry = entry.Substring(0,3);
				rowString += entry;
			}
			if (Global.Debug)
			{
				print(rowString);
			}
		}
	}


	//----------------------------------------------------------------------
	// Get the X Coord based on the name
	string GetObjNamePrefix(string tileName)
	{
		return GetFromName(tileName, 0);
	}


	//----------------------------------------------------------------------
	// Get the X Coord based on the name
	public int GetTileX(string tileName)
	{
		return int.Parse(GetFromName(tileName, 1));
	}


	//----------------------------------------------------------------------
	// Get the Y Coord based on the name
	public int GetTileY(string tileName)
	{
		return int.Parse(GetFromName(tileName, 2));
	}


	//----------------------------------------------------------------------
	// Tokenize an Object name
	public string GetFromName(string objectName, int i)
	{
		string[] splitarray = objectName.Split('_');
		return splitarray[i];
	}


	//----------------------------------------------------------------------
	// Create the game board
	void CreateBoard()
	{
		int x;							// Index the grid by x
		int y;							// Index the grid by y
		
		matchCount = 1;
		prevMatchCount = 1;
		for (x=0; x < MaxWidth; x++)
		{
			for (y=0; y < MaxLength; y++)
			{
				if (Global.Debug)
				{
					print("x: " + x + " y: " + y);
				}
				CreateUnityTile(x, y);							// Set the tile to draw
				UpdateTileName(boardDraw, x, y);				// Set the tile name
			}
		}

		// New way to create new board?	
		ClearAllTile();											// Clear all the tile out
		ClearIntBoard(boardId, Global.TileIdFlip, boardWidth, boardLength);
		FindAllMatches();    									// Check if we have a valid board
		SetMatchNeutral();										// Set colors to neutral where >=3 matches
		FindAllMatches();										// Check matches again
	}


	//----------------------------------------------------------------------
	// Mainly for building new board find a color w/o matches
	void TrySetValidColor(int x, int y)
	{
		// Color Index
		int c;
		bool  noMatchFound;				// Did not find a match

		// Mark all matches >= 3 to black for now
		noMatchFound = true;				
		for (c=1; x < tilesTypesLevel && noMatchFound; c++) 
		{
			// Match on this particular tile?
			FindAllMatches();

			// Try to set this to a non-matching color
			if (hMatch[x, y] == 1 || vMatch[x, y] == 1)
			{					
				SetTileColorId(x, y, c);
			}
			else 
			{
				noMatchFound = false;
			}
		}
	}


	//----------------------------------------------------------------------
	// For building new board set any >= MAXSIZE to neutral color
	// Leave this in board utils since part of board setup.
	void SetMatchNeutral()
	{
		int x;							// Index the grid by x
		int y;							// Index the grid by y

		// Mark all matches >= 3 to black for now 
		for (x=0; x < boardWidth; x++)
		{						
			for (y=0; y < boardLength; y++) 
			{
				if (hMatch[x, y] >= MinShapeSize || vMatch[x, y] >= MinShapeSize)
				{
					boardDraw[x,y].GetComponent<Renderer>().material.color = Color.black;
					boardId[x,y] = Global.TileIdClear;
					SetTileColorId(x, y, Global.TileIdClear);
					if (Global.Debug)
					{
						print("(1)NEUTRAL******");
					}
				}
				if (hMatch[x, y] >= MinShapeSize)
				{
					hMatch[x, y] = Global.TileIdClear;
					SetTileColorId(x, y, Global.TileIdClear);
					if (Global.Debug)
					{
						print("(2)NEUTRAL******");
					}
				}
				if (vMatch[x, y] >= MinShapeSize)
				{
					vMatch[x, y] = Global.TileIdClear;
					SetTileColorId(x, y, Global.TileIdClear);
					if (Global.Debug)
					{
						print("(3)NEUTRAL******");
					}
				}
			}
		}
	}


	//----------------------------------------------------------------------
	// Set the tile color and the board ID in the same method
	public void SetTileColorId(int x, int y, int tileID)
	{
		SetTileColor(x, y, tileID);					// Update the color
		boardId[x,y] = tileID;						// Update the type (same as color)	
	}


	//----------------------------------------------------------------------
	// Set the tile color and the board ID in the same method
	void ClearAllTile()
	{
		int x;										// Index the grid by x
		int y;										// Index the grid by y

		for (x=0; x < MaxWidth; x++) 				// Mark all matches >= 3 to black for now 
		{				
			for (y=0; y < MaxLength; y++)
			{
				SetTileColorId(x, y, 0);
			}
		}
	}


	//----------------------------------------------------------------------
	// Update the name of this object, pass 2D array of object
	void  UpdateTileName(GameObject[,] boardTile, int x, int y)
	{
		boardTile[x,y].name = "tile_" + x + '_' + y;
	}


	//----------------------------------------------------------------------
	// Create the unity 3D object
	void CreateUnityTile(int x, int y)
	{
		boardDraw[x,y] = (GameObject)Instantiate(tile, new Vector3(x,y,1), Quaternion.identity);
	}


	//----------------------------------------------------------------------
	// Create the unity 3d Coin
	void CreateUnityCoin(int x)
	{
		coinList[x] = (GameObject) Instantiate(
			coin, 
			new Vector3(
				-2  + Random.Range(-10,10)/100.0f,
				4 + Random.Range(-10,10)/100.0f,
				1
			),
		    Quaternion.identity
		);
	}


	//----------------------------------------------------------------------
	// Create all coins
	void CreateCoins()
	{
		int i;

		for (i=0; i<coinListSize; i++)
		{
			CreateUnityCoin(i);
		}
	}


	//----------------------------------------------------------------------
	// Create the game buttons
	void CreateButtons()
	{
		int x;									// Index the Horizontal buttons
		int y;									// Index the Vertical buttons
		Vector3 tempAngle;
		
		for (x=0; x < MaxWidth; x++)			// Create horizontal buttons
		{
			if (Global.Debug) 
			{
				print("Creating button x: " + x);
			}

			CreateButton(x, -1, "H_", x);								// Set the tile to draw
			tempAngle = buttonDraw[x].transform.eulerAngles;
			tempAngle.z -= 90;
			buttonDraw[x].transform.eulerAngles = tempAngle;
		}

		for (y=0; y < MaxLength; y++)									// Create vertical buttons
		{
			if (Global.Debug) 
			{
				print("Creating button y: " + y);
			}

			CreateButton(-1, y, "V_", y + MaxWidth);					// Set the tile to draw
			tempAngle = buttonDraw[y + boardWidth].transform.eulerAngles;
			tempAngle.z += 180;
			buttonDraw[y + boardWidth].transform.eulerAngles = tempAngle;
		}

		panicButton = (GameObject) Instantiate(panic, new Vector3(-2.21f, 0.71f, -8.0f), Quaternion.identity);
		panicButton.name = "prePanic";
	}


	//----------------------------------------------------------------------
	// Create Sparks
	public void CreateSparks(int x, int y)
	{
		Instantiate(sparks, new Vector3(x,y,-6), Quaternion.identity);
	}


	//----------------------------------------------------------------------
	// Create Lightningball
	void CreateLightningBall(int x , int y)
	{
		Instantiate(lightningBall, new Vector3(x,y,-8), Quaternion.identity);
	}


	//----------------------------------------------------------------------
	// Create LightningStrike
	void CreateLightningStrike(int x, int y)
	{
		Instantiate(lightningStrike, new Vector3(x,y,-8), Quaternion.identity);
	}


	//----------------------------------------------------------------------
	// Create the unity button objects
	void CreateButton(int x, int y, string namePrefix, int buttonIndex)
	{
		// Create the Unity3d Object
		buttonDraw[buttonIndex] = (GameObject)Instantiate(button, new Vector3(x,y,1), Quaternion.identity);
		buttonDraw[buttonIndex].name = namePrefix + buttonIndex;
	}


	//----------------------------------------------------------------------
	// Set some buttons as clear and others solid based on size of level
	void SetupButtonsLevel()
	{
		int x;
		for (x=0; x < MaxWidth; x++)
		{
			if (x < boardWidth)
			{
				buttonDraw[x].GetComponent<Renderer>().material = buttonMaterial;
			}
			else
			{
				buttonDraw[x].GetComponent<Renderer>().material = cubeMaterialBlank;
			}
		}

		for (x=0; x < MaxLength; x++) 		// Create vertical buttons
		{    							
			if (x < boardLength) 
			{
				buttonDraw[x + MaxWidth].GetComponent<Renderer>().material = buttonMaterial;
			}
			else 
			{
				buttonDraw[x + MaxWidth].GetComponent<Renderer>().material = cubeMaterialBlank;
			}
		}
	}


	//----------------------------------------------------------------------
	// Shuffle an array at rnd GoalTileTypes
	void lastLevelShuffle()
	{
		int r;
		int i;
		int temp;

		for(i = levelCalc(0); i < levelCalc(8); i++)
		{
			r = Random.Range(levelCalc(0), levelCalc(0) + 8);
			temp = GoalTileTypes[r];
			GoalTileTypes[r] = GoalTileTypes[i];
			GoalTileTypes[i] = temp;
		}
	}


	//----------------------------------------------------------------------
	// Calc level index
	int levelCalc(int id)
	{
		return 25 * 9 + id;
	}


	//----------------------------------------------------------------------
	// Load a level
	void LoadClankLevel(int lv)
	{
		int x;
		
		panicMeter = 0;
		scrambleMeter = MaxScramble + Random.Range(0,5);
		
		// Running full random mode.
		if (mode == Global.ModeRandom || mode == Global.ModeTimed)
		{
			lv = Levels;
		}
		
		//LevelSize
		boardWidth = LevelSize[lv * 2];
		boardLength = LevelSize[lv * 2 + 1];
		
		// Random levels, at end of main puzzle, or MODE_RANDOM
		if (lv >= Levels)
		{
			boardWidth = Random.Range(5,8);
			boardLength = Random.Range(5,8);
		}

		if (LevelText[lv] != "")
		{
			tutorialOn = true;
		}

		if (Global.Debug)
		{
			print("[][][] lv:" + lv + " boardWidth:" + boardWidth + " boardLength:" + boardLength);
		}

		tilesTypesLevel = GoalTypes[lv];								// Types of tiles
		if (lv >= Levels)
		{
			tilesTypesLevel = Random.Range(4, (boardWidth + boardLength)/2 + 1);
			lastLevelShuffle();
		}

		if (Global.Debug || Global.DebugSpecial == 1)
		{
			print("LOAD TILE TYPES: at " + tilesTypesLevel);
		}

		// Get the goals, how many needed to clear level + RND
		for (x=0; x < NumGoals; x++)
		{			
			scoreLevels[x] = GoalLimits[lv * NumGoals + x] + Random.Range(0, GoalRandom[lv * NumGoals + x]);
			levelGoalMax[x] = scoreLevels[x];
			scoreRank[x] = 0;											// Set the number of each goal done to 0

			if (Global.Debug || Global.DebugSpecial == 1) 
			{
				print("LOAD GOALS: at " + x + " = " + scoreLevels[x] + "  TYPE:" + scoreLevels[x].GetType());
			}
		}
		UpdateLevelName();							// Load the level name
		UpdatePercent();							// Update the Score Percent

		// Renderer.sharedMaterial 
		background.GetComponent<Renderer>().sharedMaterial.color = new Color(
			(level + Random.Range(0, 3)) % 5 / 10.0f, 
			(level + Random.Range(0, 4)) % 4 / 8.0f, 
			(level + Random.Range(0, 5)) % 3 / 6.0f,
			1.0f
		);
		
		timer = 60;
	}


	//----------------------------------------------------------------------
	// Update goal scores, Output the goals
	void UpdateScoreDisplay(int x)
	{
		tileGoal[x].GetComponent<TextMesh>().text = scoreLevels[x].ToString();
	}


	//----------------------------------------------------------------------
	// Update goal percent
	void UpdatePercent()
	{
		int per;
		int perTotal;
		int perMin;
		int i;

		per = 0;
		perTotal = 0;
		for (i = 0; i < NumGoals; i++)
		{
			perTotal += levelGoalMax[i];
			perMin = scoreRank[i];
			if (levelGoalMax[i] < perMin)
			{
				perMin = levelGoalMax[i];
			}
			per +=  perMin;
		}
		totalGoals = perTotal;
		if (Global.Debug && Global.DebugSpecial == 3)
		{
			print("-*-*-> " + per + " / " + perTotal);
		}
		percentText.GetComponent<TextMesh>().text = (per*100/perTotal).ToString() + "%";
	}


	//----------------------------------------------------------------------
	// Display all scores again
	void UpdateAllScores()
	{
		int i;
		for (i=0; i<NumGoals; i++)
		{
			if (scoreLevels[i] == 0)
			{
				SetObjectColor(tileGoal[i], new Color(0.0f, 0.5f, 0.0f, 1.0f));
			}
			else
			{
				SetObjectColor(tileGoal[i], new Color(0.5f, 0.0f, 0.0f, 1.0f));
			}
			tileGoal[i].GetComponent<TextMesh>().text = scoreRank[i].ToString();
		}
	}


	//----------------------------------------------------------------------
	// Update coins
	void UpdateCoins()
	{
		// Limit number of coins awarded
		if (coins - coinsPrev > 10)
		{
			coins = coinsPrev + 10;
		}
		// Limit number of coins removed
		if (coinsPrev - coins > 1)
		{
			coins--;
		}
		coinsPrev = coins;
		if (coins > MaxCoins)
		{
			coins = MaxCoins;
		}
		if (coins > MaxCoins) 
		{
			coins = MaxCoins;
		}
		if (coinsDisp < coins) 
		{
			coinsDisp++;
		}
		if (coinsDisp > coins)
		{
			coinsDisp--;
		}

		coinText.GetComponent<TextMesh>().text = coinsDisp.ToString();
		AddRemoveCoins();
	}


	//----------------------------------------------------------------------
	// Add and Remove coin objects as needed
	void AddRemoveCoins()
	{
		int i;
		
		// Create needed coins
		if (coinListSize < coins && coins < MaxCoins)
		{
			myAudio[2].Play();
			myAudio[3].Play();

			for (i=coinListSize; i < coins; i++)
			{
				CreateUnityCoin(i);
			}
			coinListSize = coins;
		}
		// Remove lost coins
		else if (coinListSize > coins && coins >= 0)
		{
			for (i=coinListSize-1; i >= coins; i--)
			{
				Destroy(coinList[i]);
			}
			coinListSize = coins;
		}
	}


	//----------------------------------------------------------------------
	// Update score
	void UpdateScore()
	{
		if (scoreDisp + 100 < score)
		{
			scoreDisp += 10;
			myAudio[9].Play();
		}
		else if (scoreDisp < score)
		{
			scoreDisp += 1;
			myAudio[8].Play();
		}
		scoreText.GetComponent<TextMesh>().text = scoreDisp.ToString();
	}


	//----------------------------------------------------------------------
	// Update timer
	void UpdateTimer()
	{
		if (mode == Global.ModeTimed)
		{
			timerText.GetComponent<TextMesh>().text = (int)timer + "sec";
		}
		else
		{
			timerText.GetComponent<TextMesh>().text = "";
		}
	}


	//----------------------------------------------------------------------
	// Update Level Name
	void UpdateLevelName()
	{
		nameText.GetComponent<Renderer>().material.color = Color.white;
		if (mode == Global.ModeRandom)
		{
			nameText.GetComponent<TextMesh>().text = "Random #" + (level - TutorialLevels + 1);
		}
		else if (mode == Global.ModeTimed)
		{
			nameText.GetComponent<TextMesh>().text = "Timed #"  + (level - TutorialLevels + 1);
		}
		else
		{
			nameText.GetComponent<TextMesh>().text = LevelName[level];
			if (Global.Debug)
			{
				print("%%% Level Name: " + LevelName[level]);
			}
		}
	}


	//----------------------------------------------------------------------
	// Update level
	void UpdateLevel()
	{
		if (level < TutorialLevels)
		{
			levelText.GetComponent<TextMesh>().text = "T" + (level + 1).ToString();
		}
		else 
		{
			levelText.GetComponent<TextMesh>().text = (level + 1 - TutorialLevels).ToString();
		}
	}


	//----------------------------------------------------------------------
	// Update coins
	bool GoalsFinished()
	{
		int i;
		
		for (i=0; i<NumGoals; i++)
		{
			if (scoreLevels[i] > 0)
			{
				return false;
			}
		}
		return true;
	}


	//----------------------------------------------------------------------
	// Update coins
	bool TutGoalsFinished()
	{
		int i;
		int goalCount = 0;
		
		for (i=0; i<NumGoals; i++)
		{
			goalCount += scoreRank[i];
		}
		// Check w/ 1st goal only = all
		if (goalCount >= GoalLimits[level * NumGoals])
		{		
			return true;
		}
		return false;
	}


	//----------------------------------------------------------------------
	// Create the goals
	void CreateTileGoals()
	{
		int x;				// Index the Horizontal buttons

		// Create goals
		for (x=0; x < NumGoals; x++)
		{
			if (Global.Debug)
			{
				print("Creating goal x: " + x);
			}
			CreateTileGoal(8.0f, (float)x, "G_", x);
		}
	}
	
	
	//----------------------------------------------------------------------
	// Create the unity TileGoal objects
	void CreateTileGoal(float x, float y, string namePrefix, int tileIndex)
	{
		tileGoal[tileIndex] = (GameObject)Instantiate(goal, new Vector3(x, y, 1), Quaternion.identity);
		// Also set the name, prefix with H=horizontal and V=vertical
		tileGoal[tileIndex].name = namePrefix + tileIndex;
		// Set the ID
		goalId[tileIndex] = tileIndex;
	}


	//----------------------------------------------------------------------
	// Create the unity TileGoal objects
	void CreateTileGoalCount(int x, int y, string namePrefix, int tileIndex)
	{
		tileGoalCount[tileIndex] = (GameObject)Instantiate(goal, new Vector3(x, y, 1), Quaternion.identity);
		// Also set the name, prefix with H=horizontal and V=vertical
		tileGoalCount[tileIndex].name = namePrefix + tileIndex;
		// Set the ID
		goalId[tileIndex] = tileIndex;	
	}


	//----------------------------------------------------------------------
	// Setup the colors for the game
	void SetupGameColors()
	{
		// Setup colors, may want a more flaxible way to do this
		if (BoardColors >= 0)
		{
			colorRange[0] = Color.white;
		}
		if (BoardColors >= 1)
		{
			colorRange[1] = Color.yellow;
		}
		if (BoardColors >= 2)
		{
			colorRange[2] = Color.green;
		}
		if (BoardColors >= 3) 
		{
			colorRange[3] = Color.cyan;
		}
		if (BoardColors >= 4) 
		{
			colorRange[4] = new Color(0.4f, 0.3f, 1.0f, 1.0f);
		}
		if (BoardColors >= 5) 
		{
			colorRange[5] = new Color(1.0f, 0.9f, 1.0f, 1.0f);
		}
		if (BoardColors >= 6) 
		{
			colorRange[6] = new Color(0.6f, 0.5f, 1.0f, 1.0f);
		}
		if (BoardColors >= 7) 
		{
			colorRange[7] = new Color(0.7f, 0.3f, 0.3f, 1.0f);
		}
		if (BoardColors >= 8) 
		{
			colorRange[8] = new Color(0.9f, 0.3f, 0.7f, 1.0f);
		}
		if (BoardColors >= 9) 
		{
			colorRange[9] = new Color(1.0f, 0.6f, 0.2f, 1.0f);
		}
	}

	
	//----------------------------------------------------------------------
	// Set the tile at x,y to some color
	public void SetTileColor(int x, int y, int tileID)
	{
		if (tileID != Global.TileIdClear && tileID != 0)
		{
			// Change the material
			boardDraw[x,y].GetComponent<Renderer>().material = cubeMaterials[tileID];
			// Set the color
			SetObjectColor(boardDraw[x,y], GetTileColor(tileID));
		}
		else if (tileID != 0)
		{
			boardDraw[x,y].GetComponent<Renderer>().material = cubeMaterialClear;
			CreateSparks(x,y);
		}
		else 
		{
			boardDraw[x,y].GetComponent<Renderer>().material = cubeMaterialBlank;
		}
	}


	//----------------------------------------------------------------------
	// Set object color
	void SetObjectColor(GameObject g, Color c)
	{
		g.GetComponent<Renderer>().material.color = c;
	}


	//----------------------------------------------------------------------
	// Returns a random tile in the range
	public int GetRandomTileType()
	{
		return Random.Range(0, tilesTypesLevel);
	}


	//----------------------------------------------------------------------
	// Get a valid Tile at location x, y
	public int GetValidTile(int x, int y)
	{
		int i;										// A counter for the colors
		int tileId;
		int mapTileId;

		i = 0;										// Get a random tile
		tileId = GetRandomTileType();
		mapTileId = MapTileByLevel(tileId);
		
		SetTileColorId(x, y, mapTileId);
		while (NSEWMatch(x, y) && i <= tilesTypesLevel)
		{
			tileId = (tileId + 1) % tilesTypesLevel;
			mapTileId = MapTileByLevel(tileId);
			SetTileColorId(x, y, mapTileId);
			i++;
		}
		if (i >= tilesTypesLevel)
		{
			mapTileId = -1;
		}
		SetMatchNeutral();
		return mapTileId;
	}


	//----------------------------------------------------------------------
	// Returns true if match NSE or W
	bool NSEWMatch(int x, int y)
	{
		int n = x-1 >= 0 ? x-1 : -1; 
		int s = x+1 < boardLength ? x+1 : -1;
		int e = y-1 >= 0 ? y-1 : -1;
		int w = y+1 < boardWidth ? y+1 : -1;

		bool  match = false;
		if (n != -1) 
		{
			match = match || boardId[x,y] == boardId[n,y];
		}
		if (s != -1) 
		{
			match = match || boardId[x,y] == boardId[s,y];
		}
		if (e != -1) 
		{
			match = match || boardId[x,y] == boardId[x,e];
		}
		if (w != -1) 
		{
			match = match || boardId[x,y] == boardId[x,w];
		}
		return match;
	}


	//----------------------------------------------------------------------
	// Map tile by level tile mapping array
	int  MapTileByLevel(int id)
	{
		return GoalTileTypes[level * 9 + id];
	}


	//----------------------------------------------------------------------
	// Returns the tile color
	Color GetTileColor(int tileType)
	{
		return colorRange[tileType];
	}


	//----------------------------------------------------------------------
	// These vars are updated on a click or a move
	void SetLastClickedXYHV(int X, int Y, int H, int V)
	{
		lastClickedH = H;
		lastClickedV = V; 
	}


	//----------------------------------------------------------------------
	// Get the state of a tile!
	int GetTileState (int x, int y)
	{
		return boardDraw[x, y].GetComponent<Cube>().tileState;
	}


	//----------------------------------------------------------------------
	// Set all the global variables.
	void SetGlobals()
	{
		int hiscore = Global.Instance.hiscore;

		if (score > hiscore) 
		{
			Global.Instance.hiscore = score;
		}
		Global.Instance.level = level;
		Global.Instance.score = score;
	}


	//----------------------------------------------------------------------
	// Get level global variable to start
	int GetLevel()
	{
		return Global.Instance.level;
	}


	//----------------------------------------------------------------------
	// Get the game mode.
	int GetGameMode()
	{
		return Global.Instance.gameMode;
	}
	
}

