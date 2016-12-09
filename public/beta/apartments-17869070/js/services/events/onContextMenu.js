/**
 * Used by g_htmlCanvas.addEventListener("contextmenu", onContextMenu, !1);
 */
function onContextMenu(a) {
    if (2 === a.button) return a.preventDefault(), !1
}