// Cube

#pragma strict
//======================================================================
// GRID GAME:
// 		jsCube.js
// 		Attached to 8x8 tile grid.
//======================================================================

//======================================================================
// !VARIABLES
//======================================================================

// Unity Variables
var defaultCubeMaterial : 			Material;				// def Material for the cube
var staticObject : 					boolean;
var lastPos : 						Vector3;
var tileState : 					int;
var tileStateLast : 				int;

// Private Variables
static private var DEBUG : 			boolean = true;			// For debugging
private var speed : 				float = 40.0;			// Tile Move Speed
private var rotateSpeed : 			float = 10.0;			// The rotate speed
private var lastTileSpeed : 		float = 500.0;			// End tile move speed
private var extendZPos : 			float = 4.0;			// The match new Z position

static private var TILEID_FLIP : 		int = -100;				// Flip code
static private var TILEID_CLEAR : 		int = -1;				// Clear code

private var audio1: AudioSource;
private var audio2: AudioSource;
private var audio3: AudioSource;


//======================================================================
// !START AND !UPDATE
//======================================================================

//----------------------------------------------------------------------
// Unity Start function
function Start () {
    var aSources: AudioSource[] = GetComponents.<AudioSource>();
    audio1 = aSources[0];
    audio2 = aSources[1];
    //audio3 = aSources[2];
    staticObject = true;
    tileState = 0;				// Not doing anything
}

//----------------------------------------------------------------------
// Unity: Update function
/*
----------------------------------------
	State 0: Not moving
	State 1: Moving / starting flip
	State 2: Rotating back
	State 3: Need a new Tile
------------------------------------------
*/
function Update () {
	var name: 				String = GetName();									// Get name of this object
	var x: 					int = GetX(); 										// The tile loc X
	var y: 					int = GetY();										// The tile loc Y
	var id: 				int = GetBoardId(x, y);								// The boardId
	var step: 				float = speed * Time.deltaTime; 					// The movement delta time
	var rotateStep: 		float = rotateSpeed * Time.deltaTime;				// The rotate delta time
	var lastTileStep: 		float = lastTileSpeed * Time.deltaTime;				// The end tile move speed	
	var newTileMaterial: 	int = - id - 3;										// Flipped tile material
	var curPos : 			Vector3;

	tileStateLast = tileState;

	// See if any object is moving, so we don't allow clicks during movement.
	staticObject = true;				// Assume we did not move
	curPos = transform.position;
	
	// STATE 2: Flipped once, need to rotate back.
	if (tileState == 2) {
		if (transform.rotation.y != 0.0) {
			transform.rotation = Quaternion.RotateTowards(transform.rotation, Quaternion.Euler(0.0, 0.0, 0.0), rotateStep);
		}
		else {
			tileState = 3;
		}
	}
	// STATE 3: Rotated Back
	else if (tileState == 3) {
		// Everything is back to normal-ish
		tileState = 0;
	}
	// STATE 0 and STATE 1. STATIC OR MOVING
	else if (tileState == 0 || tileState == 1 || id == TILEID_FLIP) {
		// If we are not in the current location as per the board. Not the end tile.
		if (Vector3(x, y, 1) != transform.position) {
			// Move our position a step closer to the target.
			transform.position = Vector3.MoveTowards(transform.position, Vector3(x, y, 1), step);
			tileState = 1;				// Moving
		}
		
		// Resize based on size of the level
		transform.localScale = Vector3(0.9, 0.9, 0.9);
		
		// Move the far sliding tile faster
		if (Vector3(x, y, 1) != transform.position && ((y == 0 && GetLastClickedH()!= TILEID_CLEAR || x == 0) && GetLastClickedV() != -1)) {
			// Move our position a step closer to the target.
			transform.position = Vector3.MoveTowards(transform.position, Vector3(x, y, 1), lastTileStep);
			tileState = 1;				// Moving
		}
		
		// A match occured, somewhere, so animate this. Need to know how much.
		// Matches set as -size_of_run (-2 to -5) so we can tell how big.
		if (id == TILEID_FLIP || id < TILEID_CLEAR && id > -10 && transform.position.x == x && transform.position.y == y) {
			if (transform.rotation.y < 1) {
				transform.rotation = Quaternion.RotateTowards(transform.rotation, Quaternion.Euler(0.0, 180.0, 0.0), rotateStep);
				audio1.Play();
				staticObject = false;			// We moved
				tileState = 1;					// Moving
				//GearCubeMaterial(x, y);
			}
			// The tile is flipped, so mark it.
			if (transform.rotation.y == 1.0) {
				tileState = 2;
				if (id == TILEID_FLIP) {
					ChangeCubeMaterial(x, y);
				}
				else {
					ClearCubeMaterial(x, y);
				}
			}

			// Also move matched tiles out to Z position
			if (transform.position.z < extendZPos) {
				transform.position = Vector3.MoveTowards(transform.position, Vector3(x, y, extendZPos - Random.Range(8, 32)), lastTileStep);
			}
			
			if (transform.rotation.y == -1) {
				if (GetSoundOn()) {
					audio1.Play();
				}
			}
		} // if (id < -1 && id > -10 && transform.position.x == x && transform.position.y == y)
	}
	
	// Set stationary position if we did not move
	if (curPos != lastPos) {
    	staticObject = false;			// We moved
	}
	else {								// Not moving, go back to state 0
		if (tileState == 1) {
			tileState = 0;
		}
	}
	lastPos = curPos;					// Save old pos
}


//=======================================================================================
// !Other functions
//=======================================================================================

//----------------------------------------------------------------------
// Get boardWidth
function GetBoardWidth() {
	var boardWidth: int = Camera.main.GetComponent(jsSceneManager).boardWidth;
	return boardWidth;
}

//----------------------------------------------------------------------
// Get boardHeight
function GetBoardHeight() {
	var boardLength: int = Camera.main.GetComponent(jsSceneManager).boardLength;
	return boardLength;
}

//----------------------------------------------------------------------
// Get MAX_WIDTH
function GetMaxWidth() {
	var MAX_WIDTH: int = Camera.main.GetComponent(jsSceneManager).MAX_WIDTH;
	return MAX_WIDTH;
}

//----------------------------------------------------------------------
// Get MAX_HEIGHT
function GetMaxHeight() {
	var MAX_LENGTH: int = Camera.main.GetComponent(jsSceneManager).MAX_LENGTH;
	return MAX_LENGTH;
}

//----------------------------------------------------------------------
// Get last clicked Horizontal position
function GetLastClickedH() {
	return Camera.main.GetComponent(jsSceneManager).lastClickedH;
}

//----------------------------------------------------------------------
// Get last clicked Vertical position
function GetLastClickedV() {
	return Camera.main.GetComponent(jsSceneManager).lastClickedV;
}

//----------------------------------------------------------------------
// Get current name string from the object.name
function GetBoardId(x:int, y:int) {
	return Camera.main.GetComponent(jsSceneManager).boardId[x, y];
}

//----------------------------------------------------------------------
// Get current name string from the object.name
function GetName() {
	return transform.gameObject.name;
}

//----------------------------------------------------------------------
// Get current Pos X from the object name
function GetX() {
	return Camera.main.GetComponent(jsSceneManager).GetTileX(name);
}

//----------------------------------------------------------------------
// Get current Pos Y from the object name
function GetY() {
	return Camera.main.GetComponent(jsSceneManager).GetTileY(name);
}

//----------------------------------------------------------------------
// Get the sound flag
function GetSoundOn() {
	return Camera.main.GetComponent(jsSceneManager).soundOn;
}

//----------------------------------------------------------------------
// Start randomizing the tile
function ChangeCubeMaterial(x:int, y:int) {
	//var tileID:int = Camera.main.GetComponent(jsSceneManager).GetRandomTileType();
	var tileID: int = Camera.main.GetComponent(jsSceneManager).GetValidTile(x, y);
	Camera.main.GetComponent(jsSceneManager).SetTileColorId(x, y, tileID);
}

//----------------------------------------------------------------------
// Clear the cube Material
function ClearCubeMaterial(x:int, y:int) {
	Camera.main.GetComponent(jsSceneManager).SetTileColorId(x, y, TILEID_CLEAR);
}



