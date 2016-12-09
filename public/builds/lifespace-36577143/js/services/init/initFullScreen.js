/**
 * Attaches different image with respect to fullscreen
 */

$(document).on("fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange", function() {
    g_cSystemSpecs.fIsFullScreen ? (document.getElementById("fullScreen-icon").src = "./assets/texture/fullscreen.svg", document.getElementById("fullScreen-button").title = "View Fullscreen", g_cSystemSpecs.fIsFullScreen = !1) : (document.getElementById("fullScreen-icon").src = "./assets/texture/fullscreen_exit.svg", document.getElementById("fullScreen-button").title = "Exit Fullscreen", g_cSystemSpecs.fIsFullScreen = !0)
});

/**
 * initFullScreen is used to render full screen capabilities
 * @param body
 * @param document
 */

function initFullScreen(body, document) {
    var c = document.createElement("IMG");
    c.id = "fullScreen-icon";
    c.src = "./assets/texture/fullscreen.svg";
    c.width = "32";
    c.height = "32";
    document.getElementById("fullScreen-button").appendChild(c);
    $("#fullScreen-button").click(function() {
        g_cSystemSpecs.fIsFullScreen ? document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen ? document.webkitExitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.msExitFullscreen && document.msExitFullscreen() : body.requestFullscreen ? body.requestFullscreen() : body.msRequestFullscreen ?
            body.msRequestFullscreen() : body.mozRequestFullScreen ? body.mozRequestFullScreen() : body.webkitRequestFullscreen && body.webkitRequestFullscreen()
    })
}