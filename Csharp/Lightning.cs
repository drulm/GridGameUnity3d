
//======================================================================
// GRID GAME: Lightning.cs
// 			Remove lightning particles
//				Used for:
//					* Main game, SceneManager.cs
//======================================================================

using UnityEngine;
using System.Collections;

public class Lightning : MonoBehaviour 
{
	//======================================================================
	// Variables
	//======================================================================

	// Private Variables
	//----------------------------------------------------------------------
	private const float Duration = 2.0f;


	//======================================================================
	// Methods
	//======================================================================

	//----------------------------------------------------------------------
	// Unity Start method
	void Start()
	{
		StartCoroutine(AutoDestruct());
	}


	//----------------------------------------------------------------------
	// AutoDestruct method
	IEnumerator AutoDestruct()
	{
		yield return new WaitForSeconds(Duration);
		Destroy(gameObject);
	}
	
}
