// Lightning script, get rid of particles.

#pragma strict

var duration: float = 2;

function Update () {
}


function Start()
{
	AutoDestruct();
}

function AutoDestruct()

{
	yield WaitForSeconds(duration);
	Destroy(gameObject);
}
