/**
 * Custom requestAnimationFrame function compatible with all browsers
 */


(function() {
    for (var a = 0, b = ["ms", "moz", "webkit", "o"], c = 0; c < b.length && !window.requestAnimationFrame; ++c) window.requestAnimationFrame = window[b[c] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[b[c] + "CancelAnimationFrame"] || window[b[c] + "CancelRequestAnimationFrame"];
    window.requestAnimationFrame || (window.requestAnimationFrame = function(b, c) {
        var g = (new Date).getTime(),
            f = Math.max(0, 16 - (g - a)),
            k = window.setTimeout(function() {
                b(g + f)
            }, f);
        a = g + f;
        return k
    });
    window.cancelAnimationFrame || (window.cancelAnimationFrame =
        function(a) {
            clearTimeout(a)
        })
})();