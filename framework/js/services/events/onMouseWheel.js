/**
 * Used by g_htmlCanvas.addEventListener("mousewheel", onMouseWheel, !1);
 */
function onMouseWheel(a) {
    a.preventDefault();
    var b = 0;
    a.wheelDelta ? b = a.wheelDelta : a.detail && (b = -a.detail);
    0 < b ? g_cRenderer.modelWalk(g_UPKEY) : 0 > b && g_cRenderer.modelWalk(g_DOWNKEY)
}