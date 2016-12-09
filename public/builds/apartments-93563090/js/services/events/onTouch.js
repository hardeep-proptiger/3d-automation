/**
 * Used by 'manager.on("pan singletap", onTouch)'
 * @type {{}}
 */

var g_ptPrevPanShift = {},
    g_ptCurrPanShift = {},
    g_ptPrevSwipeShift = {},
    g_ptCurrSwipeShift = {},
    g_cSwipeTween = null,
    g_fSwipeIsOver = !1;

function onTouch(event) {
    if ("pan" === event.type) {
        event.preventDefault();
        var velocity = Math.abs(event.velocity);

        if (event.eventType === Hammer.INPUT_END && 1 < velocity) {
            g_cSwipeTween && g_cSwipeTween.stop();
            var maxVelocityX = Math.max(1, .15 * Math.abs(event.velocityX)),
                maxVelocityY = Math.max(1, .15 * Math.abs(event.velocityY)),
                velocityObj = {
                    x: 0,
                    y: 0
                };
            tempObj = {
                x: maxVelocityX * event.deltaX,
                y: maxVelocityY * event.deltaY / 2
            };
            g_ptPrevSwipeShift.x = velocityObj.x;
            g_ptPrevSwipeShift.y = velocityObj.y;
            g_cSwipeTween = (new TWEEN.Tween(velocityObj)).to(tempObj, 3E3).interpolation(TWEEN.Interpolation.Linear).delay(0).easing(TWEEN.Easing.Exponential.Out).repeat(0).start();
            g_cSwipeTween.onUpdate(function() {
                g_ptCurrSwipeShift.x = velocityObj.x;
                g_ptCurrSwipeShift.y = velocityObj.y;
                g_cRenderer.mouseDrag(g_ptCurrSwipeShift.x - g_ptPrevSwipeShift.x, g_ptCurrSwipeShift.y - g_ptPrevSwipeShift.y);
                g_ptPrevSwipeShift.x = g_ptCurrSwipeShift.x;
                g_ptPrevSwipeShift.y = g_ptCurrSwipeShift.y
            });
            g_fSwipeIsOver = !0
        } else {

            if (void 0 === g_ptPrevPanShift.x || void 0 === g_ptPrevPanShift.y) g_ptPrevPanShift.x = 0, g_ptPrevPanShift.y = 0; // reset

            g_fSwipeIsOver && ( g_cSwipeTween && g_cSwipeTween.stop(), g_ptPrevPanShift.x = event.deltaX, g_ptPrevPanShift.y = event.deltaY, g_fSwipeIsOver = !1);
            g_ptCurrPanShift.x = event.deltaX;
            g_ptCurrPanShift.y = event.deltaY;
            g_cRenderer.mouseDrag(g_ptCurrPanShift.x - g_ptPrevPanShift.x, g_ptCurrPanShift.y - g_ptPrevPanShift.y);
            g_ptPrevPanShift.x = g_ptCurrPanShift.x;
            g_ptPrevPanShift.y = g_ptCurrPanShift.y;
            event.eventType === Hammer.INPUT_END && ( g_ptPrevPanShift.x = 0, g_ptPrevPanShift.y = 0); // after drag ends, again reset
        }
    } else "singletap" === event.type && ( event.preventDefault(), g_cRenderer.mouseClick(event.center.x, event.center.y))
};