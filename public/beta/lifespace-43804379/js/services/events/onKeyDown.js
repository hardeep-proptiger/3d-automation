/**
 * window.addEventListener("keydown", onKeyDown, !0);
 */
    
var g_LEFTKEY = 37,
    g_UPKEY = 38,
    g_RIGHTKEY = 39,
    g_DOWNKEY = 40;

function onKeyDown(a) {
    if (48 <= a.keyCode && 57 >= a.keyCode) a.preventDefault(), g_cRenderer.m_cPanowalk.jumpToPosition(a.keyCode - 48), a.stopPropagation();
    else switch (a.keyCode) {
        case g_LEFTKEY:
        case g_RIGHTKEY:
        case g_UPKEY:
        case g_DOWNKEY:
            a.preventDefault(), g_cRenderer.modelWalk(a.keyCode), a.stopPropagation()
    }
}