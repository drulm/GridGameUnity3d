
//======================================================================
// GRID GAME:	Cube.cs
//			Used for:
// 				Attached to 8x8 tile grid, each cube
//======================================================================


using UnityEngine;
using System.Collections;

public class Cube : MonoBehaviour 
	{
	//======================================================================
	// Variables
	//======================================================================
	
	// Public Unity Variables
	//----------------------------------------------------------------------
	public Material defaultCubeMaterial;			// def Material for the cube
	public bool staticObject;						// True if cube is moving
	public int tileState;							// What the tile is doing


	// Private Constants
	//----------------------------------------------------------------------
	private const float Speed 			= 50.0f;		// Tile Move Speed
	private const float RotateSpeed 	= 1000.0f;		// The rotate speed
	private const float LastTileSpeed	= 200.0f;		// End tile move speed
	private const float ExtendZPos		= 1.1f;			// The match new Z position


	// Private Variables
	//----------------------------------------------------------------------
	private Vector3 lastPos;						// Last position of cube
	private AudioSource audio1;						// Sound effect 1


	//======================================================================
	// Unity Start() and Update()
	//======================================================================
	
	//----------------------------------------------------------------------
	// Unity Start method
	void Start()
	{
		// Get audio sources
		AudioSource[] aSources = GetComponents<AudioSource>();		
		audio1 = aSources[0];

		staticObject = true;		// Tile starts /w not-moving status
		tileState = 0;				// Default cube state
	}


	//----------------------------------------------------------------------
	// Unity: Update method
	//
	// State 0: Not moving
	// State 1: Moving / starting flip
	// State 2: Rotating back
	// State 3: Need a new Tile
	void Update()
	{
		int x = GetX(); 										// The tile loc X
		int y = GetY();											// The tile loc Y
		int id = GetBoardId(x, y);								// The boardId
		float step = Speed * Time.deltaTime; 					// The movement delta time
		float rotateStep = RotateSpeed * Time.deltaTime;		// The rotate delta time
		float lastTileStep = LastTileSpeed * Time.deltaTime;	// The end tile move speed	
		Vector3 curPos;											// The current tile position

	
		// See if any object is moving, so we don't allow clicks during movement
		staticObject = true;									// Assume we did not move
		curPos = transform.position;							// Get the position

		// State machine for tile automata

		// STATE 2: Tile flipped once, need to rotate it back
		if (tileState == 2)
		{
			if (transform.rotation.y != 0.0f)
			{
				transform.rotation = Quaternion.RotateTowards(transform.rotation, Quaternion.Euler(0.0f, 0.0f, 0.0f), rotateStep);
			}
			else 
			{
				tileState = 3;
			}
		}
		// STATE 3: Rotated back
		else if (tileState == 3)
		{
			// Everything is back to normal
			tileState = 0;
		}
		// STATE 0 and STATE 1, static or moving
		else if (tileState == 0 || tileState == 1 || id == Global.TileIdFlip) 
		{
			// If we are not in the current location as per the board. Not the end tile.
			if (new Vector3(x, y, 1) != transform.position) 
			{
				// Move our position a step closer to the target.
				transform.position = Vector3.MoveTowards(transform.position, new Vector3(x, y, 1), step);
				tileState = 1;						// Set Moving
			}
			
			// Resize based on size of the level
			transform.localScale = new Vector3(0.9f, 0.9f, 0.9f);
			
			// Move the far sliding tile faster
			if (new Vector3(x, y, 1) != transform.position && ((y == 0 && GetLastClickedH() != Global.TileIdClear || x == 0) && GetLastClickedV() != -1)) 
			{
				// Move our position a step closer to the target.
				transform.position = Vector3.MoveTowards(transform.position, new Vector3(x, y, 1), lastTileStep);
				tileState = 1;						// Set Moving
			}
			
			// A match occured, somewhere, so animate. Need to know how much.
			// Matches set as -size_of_run (-2 to -5) so we can tell how big.
			if (id == Global.TileIdFlip || id < Global.TileIdClear && id > -10 && transform.position.x == x && transform.position.y == y) 
			{
				// Rotate tile if needed
				if (transform.rotation.y < 1) 
				{
					transform.rotation = Quaternion.RotateTowards(transform.rotation, Quaternion.Euler(0.0f, 180.0f, 0.0f), rotateStep);
					audio1.Play();
					staticObject = false;			// We moved
					tileState = 1;					// Set Moving
				}

				// The tile is flipped, so mark it.
				if (transform.rotation.y == 1.0f) 
				{
					tileState = 2;
					if (id == Global.TileIdFlip)
					{
						ChangeCubeMaterial(x, y);
					}
					else
					{
						ClearCubeMaterial(x, y);
					}
				}
				
				// Also move matched tiles out to Z position
				if (transform.position.z < ExtendZPos)
				{
					transform.position = Vector3.MoveTowards(transform.position, new Vector3(x, y, ExtendZPos - Random.Range(2.0f, 6.0f)), lastTileStep);
				}

				// Play a sound at end of rotation
				if (transform.rotation.y == -1)
				{
					if (GetSoundOn())
					{
						audio1.Play();
					}
				}
			}
		}
		
		// Set stationary position if we did not move
		if (curPos != lastPos) 
		{
			staticObject = false;					// We moved
		}
		else 
		{											// Not moving, go back to state 0
			if (tileState == 1) 
			{
				tileState = 0;
			}
		}

		lastPos = curPos;							// Save old pos
	}
	

	//----------------------------------------------------------------------
	// Get last clicked Horizontal position
	float GetLastClickedH()
	{
		return SceneManager.Instance.lastClickedH;
	}


	//----------------------------------------------------------------------
	// Get last clicked Vertical position
	float GetLastClickedV()
	{
		return SceneManager.Instance.lastClickedV;
	}


	//----------------------------------------------------------------------
	// Get Board Id number = the type of block
	int GetBoardId(int x, int y)
	{
		return SceneManager.Instance.boardId[x, y];
	}

	
	//----------------------------------------------------------------------
	// Get current Pos X from the object name
	int GetX()
	{
		return System.Convert.ToInt32(SceneManager.Instance.GetTileX(name));
	}


	//----------------------------------------------------------------------
	// Get current Pos Y from the object name
	int GetY()
	{
		return System.Convert.ToInt32(SceneManager.Instance.GetTileY(name));
	}


	//----------------------------------------------------------------------
	// Get the sound flag
	bool GetSoundOn()
	{
		return SceneManager.soundOn;
	}


	//----------------------------------------------------------------------
	// Start randomizing the tile
	void ChangeCubeMaterial(int x, int y)
	{
		int tileID = SceneManager.Instance.GetValidTile(x, y);
		SceneManager.Instance.SetTileColorId(x, y, tileID);
	}


	//----------------------------------------------------------------------
	// Clear the cube Material
	void ClearCubeMaterial(int x, int y)
	{
		SceneManager.Instance.SetTileColorId(x, y, Global.TileIdClear);
	}

}
