// The folder we place all screenshots inside.
// If the folder exists we will append numbers to create an empty folder.
/* var folder = "../../ScreenshotMovieOutput";
var frameRate = 25;
var sizeMultiplier : int = 1;
 
private var realFolder = "";
private var count : int;
 
function Start () {
    // Set the playback framerate!
    // (real time doesn't influence time anymore)
    // Time.captureFramerate = frameRate;
 
    // Find a folder that doesn't exist yet by appending numbers!
    realFolder = folder;
    count = 1;
    while (System.IO.Directory.Exists(realFolder)) {
        realFolder = folder + count;
        count++;
    }
    // Create the folder
    System.IO.Directory.CreateDirectory(realFolder);
}
 
function Update () {
	if (Input.GetMouseButtonDown(1)) {
	    // name is "realFolder/shot 0005.png"
	    var name = String.Format("{0}/shot {1:D04}.png", realFolder, Time.frameCount );
	    // Capture the screenshot
	    Application.CaptureScreenshot (name, sizeMultiplier);
    }
}
*/

