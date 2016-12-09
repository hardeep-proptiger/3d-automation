$(document).ready(function() {
    /**
     * Giving static variables for testing purposes
     */
    var projectName = 'proptiger';

    /**
     * This variable can be used for testing purposes, when used anything other than 'production', then it is for testing
     * @type {string}
     */
    var environment = 'development';
    //var environment = 'production';


    var modelsLocation = "./assets/"+projectName+'/';
    var testEnvironment = "LocalTesting";

    var proptigerObj = {};
    proptigerObj.strStoragePath = modelsLocation;

    //Sphere File

    proptigerObj.urlSDataFile = proptigerObj.strStoragePath + "/SphereProps.xml";

    //

    //Galaxy File

    proptigerObj.urlGDataFile = proptigerObj.strStoragePath + projectName + "/GalaxyProps.xml";

    //

    /**
     * You get the system specifications, like 'Your are running MacOS on PC.'
     */
    var systemSpecs = getSystemSpecs();

    /**
     * g_cSystemSpecs holds the value of the specifications and initial defaults.
     */
    g_cSystemSpecs.fIsFullScreen = !1;
    g_cSystemSpecs.fUseGalaxy = !1;
    g_cSystemSpecs.strDevType = systemSpecs[0];
    g_cSystemSpecs.strOSName = systemSpecs[1];

    /**
     * Switch case defines the testing environment, @bool fUseGalaxy determines if the galaxy xml file be called or not.
     */

    switch ( environment ) {
        case "production":
            g_cSystemSpecs.fUseGalaxy = !0;
            break;
        default:
            g_cSystemSpecs.fUseGalaxy = !1
    }

    /**
     * This variable holds the main canvas
     * @type {Element}
     */
    g_htmlCanvas = document.getElementById("main-canvas");

    /**
     * Setting height and width of the main canvas
     */
    var viewPort = getViewport();
    g_htmlCanvas.width = viewPort[0];
    g_htmlCanvas.height = viewPort[1];

    /**
     * Controls variable
     */

    g_controls = null;

    /**
     * This variable calls the main setup for the scene
     * @type {CRenderer}
     */
    g_cRenderer = new CRenderer;
    g_cRenderer.initEngine(g_htmlCanvas);

    //Initializes CPanowalk Utility
    g_cRenderer.setupScene( proptigerObj );

    var body = document.getElementsByTagName("body")[0];
    var doc = document;

    /**
     * Attaching events
     */

    //Resize function
    window.addEventListener("resize", onWindowResize, !1);

    //Attach right click
    g_htmlCanvas.addEventListener("contextmenu", onContextMenu, !1);

    //Attach keydown
    window.addEventListener("keydown", onKeyDown, !0);

    //Attach mousewheel event on main canvas
    g_htmlCanvas.addEventListener("mousewheel", onMouseWheel, !1);

    //Attach mousemove event on main canvas
    g_htmlCanvas.addEventListener("mousemove", onMouseMove, !1);

    //If some error occurs while transitioning between fullscreen and minimized windows.
    document.addEventListener("fullscreenerror", function() { console.log('Full screen error'); });

    /**
     * Simply triggers onTouch function with panning and tapping
     * @type {Hammer.Manager}
     */

    var manager = new Hammer.Manager(g_htmlCanvas);

    var pan = new Hammer.Pan({
        direction: Hammer.DIRECTION_ALL
    });
    var tap = new Hammer.Tap({
        event: "singletap"
    });
    var pinch = new Hammer.Pinch();

    manager.add([pan, tap, pinch]);
    manager.on("pan singletap pinchin pinchout", onTouch);

    /**
     * Initializing functions
     */

    initLogo();
    initPromptMessage();
    initFullScreen(body, doc);
    initInfoButton();
    initSplashMessage();

    /**
     * g_cSystemSpecs.fUseGalaxy : @bool
     * Checks if the environment is production or development, if production then, call initMetadataUILayer
     */

    g_cSystemSpecs.fUseGalaxy ? initMetadataUILayer(g_htmlCanvas) : ( document.getElementById('left-pane').style.visibility = 'hidden', document.getElementById('bottom-pane').style.visibility = 'hidden' );

    /**
     * Main Rendering loop
     */
    initRunProcessLoop(0);

    changeOrientation();
});