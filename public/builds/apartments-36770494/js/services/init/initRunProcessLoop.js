/**
 * Main loop for rendering purposes, Renders the canvas based on the frame size of the browser
 * @type {number}
 */
var g_prevTime = 0;
function initRunProcessLoop(timestamp) {
    requestAnimationFrame(initRunProcessLoop);
    var b = timestamp - g_prevTime;
    g_prevTime = timestamp;
    g_cRenderer.animateScene(b);
    g_cRenderer.displayScene();
}