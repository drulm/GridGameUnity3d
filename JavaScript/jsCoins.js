#pragma strict

var staticObject : 					boolean;
var lastPos : 						Vector3;
var damp : 							float = 0.01;

function Start () {

}

// Damping to keep coins from bouncing
function FixedUpdate(){
	if (GetComponent.<Rigidbody>() != null) {
    	GetComponent.<Rigidbody>().velocity.y *= (1-damp);
    }
}

function Update () {
	var curPos : 			Vector3;

	// See if any object is moving, so we don't allow clicks during movement.
	staticObject = true;				// Assume we did not move
	curPos = transform.position;

	// Set stationary position if we did not move
	if (curPos != lastPos) {
    	staticObject = false;			// We moved
	}
	lastPos = curPos;					// Save old pos
}