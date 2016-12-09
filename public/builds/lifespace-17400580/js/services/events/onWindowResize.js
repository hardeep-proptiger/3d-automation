/**
 * Used by window.addEventListener("resize", onWindowResize, !1);
 */
function onWindowResize() {
    var a = getViewport();
    g_htmlCanvas.width = a[0];
    g_htmlCanvas.height = a[1];
    g_cRenderer.updateScene(g_htmlCanvas);
    g_cSystemSpecs.fUseGalaxy && resizeBotomTab(g_htmlCanvas)
}