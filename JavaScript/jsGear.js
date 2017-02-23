// Gear

#pragma strict
//======================================================================
// GRID GAME:
// 		jsGear.js
// 		Attached to gear object.
//======================================================================

//======================================================================
// !VARIABLES
//======================================================================
var objName: 				String;			// Get name of this object

//----------------------------------------------------------------------
// Get current name string from the object.name
function Start () {

}

function Update () {
	var name: 				String = GetName();									// Get name of this object
	var x: 					int = GetTileX(name); 									// The tile loc X
	var turnGear: 			boolean;
	
	turnGear = Application.loadedLevelName == 'sceneStart' || Application.loadedLevelName == 'sceneLose';
	if (Application.loadedLevelName == 'scene1') {
		turnGear = GetIsMoving() || GetCoinsMoving();
	}
	if (turnGear) {
		if (x % 2 == 0) {
			transform.Rotate(Vector3(0f,1f,0f) * Time.deltaTime * 100);
		}
		else {
			transform.Rotate(Vector3(0f,-1f,0f) * Time.deltaTime * 100);
		}
	}
}

//----------------------------------------------------------------------
// Is anything moving?
function GetIsMoving() {
	return Camera.main.GetComponent(jsSceneManager).movingObjects();
}

//----------------------------------------------------------------------
// Is any coin moving?
function GetCoinsMoving() {
	return Camera.main.GetComponent(jsSceneManager).coinsMoving();
}

//----------------------------------------------------------------------
// Get current name string from the object.name
function GetName() {
	return transform.gameObject.name;
}

//----------------------------------------------------------------------
// Get the X Coord based on the name
function GetTileX(tileName: String) {
	return parseInt(GetFromName(tileName, 1));
}

//----------------------------------------------------------------------
// Tokenize an Object name
function GetFromName(objectName: String, i: int) {
	var splitarray : String[] = objectName.Split("_"[0]);
	return splitarray[i];
}
