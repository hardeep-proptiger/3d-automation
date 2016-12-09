/**
 * isWebGLAvailable checks if the system supports webgl or not, if not then redirect to 'http://get.webgl.org'
 * @param canvas
 * @returns {boolean}
 */
function isWebGLAvailable( canvas ) {
    return window.WebGLRenderingContext ? canvas.getContext("webgl") || canvas.getContext("experimental-webgl") ? !0 : (console.log("Browser failed to initialize WebGL. Please upgrade your graphics driver/browser."), window.location = "http://get.webgl.org", !1) : (console.log("WebGL is not supported by your browser. Please install a compatible browser."), window.location = "http://get.webgl.org", !1)
}
