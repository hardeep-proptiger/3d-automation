/**
 * CRenderer utility
 * @constructor
 */

function CRenderer() {
    this.m_nWidth = 320;
    this.m_nHeight = 240;
    this.m_xSceneColor = "#000000";
    this.m_cPanowalk = this.m_cHUDMarkers = this.m_cHUDScene = this.m_cSceneGraph = this.m_cCamera = this.m_cScene = this.m_cRenderer = null;
    this.m_isLoadingImageActive = !1
}

CRenderer.prototype = {
    constructor: CRenderer,
    initEngine: function( g_htmlCanvas ) {
        this.m_nWidth = g_htmlCanvas.width;
        this.m_nHeight = g_htmlCanvas.height;
        this.m_cRenderer = isWebGLAvailable(g_htmlCanvas) ? new THREE.WebGLRenderer({
            canvas: g_htmlCanvas,
            antialias: !0,
            alpha: !0
        }) : new THREE.CanvasRenderer({
            canvas: g_htmlCanvas,
            antialias: !0,
            alpha: !0
        });
        this.m_cRenderer.setClearColor(this.m_xSceneColor, 1);
        this.m_cRenderer.setSize(this.m_nWidth, this.m_nHeight);
        this.m_cRenderer.setFaceCulling(THREE.CullFaceNone);
        this.m_cRenderer.autoClear = !1;
    },
    setupScene: function(proptigerObj) {
        this.m_cScene = new THREE.Scene;
        this.m_cHUDScene = new THREE.Scene;
        var light = new THREE.AmbientLight(16777215);
        this.m_cScene.add(light);
        this.m_cPanowalk = new CPanowalk;
        proptigerObj.aspect = this.m_nWidth / this.m_nHeight;

        this.m_cPanowalk.initialize(proptigerObj);

        this.m_cCamera = this.m_cPanowalk.getCamera();
        this.m_cScene.add(this.m_cCamera);
        this.m_cSceneGraph = this.m_cPanowalk.getObjectContainer();
        this.m_cScene.add(this.m_cSceneGraph);
        this.m_cHUDScene.add(this.m_cCamera);
        this.m_cHUDMarkers = this.m_cPanowalk.getMarkerContainer();
        this.m_cHUDScene.add(this.m_cHUDMarkers)
    },
    animateScene: function( time ) {
        this.m_cPanowalk.animatePanorama( time )
    },
    displayScene: function() {
        TWEEN.update();
        this.m_cRenderer.clear();
        this.m_isLoadingImageActive || this.m_cPanowalk.m_cPanoverse.getCurrentSphere().m_fHighTexLoaded ? this.m_isLoadingImageActive && this.m_cPanowalk.m_cPanoverse.getCurrentSphere().m_fHighTexLoaded && ($("#spinner").fadeOut("slow"), this.m_isLoadingImageActive = !1) : ($("#spinner").fadeIn("slow"), this.m_isLoadingImageActive = !0);
        this.m_cRenderer.render(this.m_cScene, this.m_cCamera);
        this.m_cRenderer.clearDepth();
        this.m_cRenderer.render(this.m_cHUDScene, this.m_cCamera)
    },
    updateScene: function(canvas) {
        this.m_nWidth = canvas.width;
        this.m_nHeight = canvas.height;
        this.m_cRenderer.setSize(this.m_nWidth, this.m_nHeight);
        this.m_cCamera.aspect = this.m_nWidth / this.m_nHeight;
        this.m_cCamera.updateProjectionMatrix()
    },
    mouseClick: function(positionX, positionY) {
        !1 === this.m_cPanowalk.selectMarker(positionX / this.m_nWidth * 2 - 1, 2 * -(positionY / this.m_nHeight) + 1) && this.mouseDblClick(positionX, positionY)
    },
    mouseDblClick: function(positionX, positionY) {
        var walk = this.m_cPanowalk.computeWalkDirection(positionX / this.m_nWidth * 2 - 1, 0);
        this.m_cPanowalk.walk( walk )
    },
    mouseMove: function(clientX, clientY) {
        this.m_cPanowalk.highlightMarker(clientX / this.m_nWidth * 2 - 1, 2 * -(clientY / this.m_nHeight) + 1)
    },
    mouseDrag: function(positionX, positionY) {
        this.m_cPanowalk.turn( positionX / this.m_nWidth, positionY / this.m_nHeight)
    },
    modelWalk: function(keyCode) {
        switch (keyCode) {
            case g_LEFTKEY:
                this.m_cPanowalk.turn(1 / 90, 0);
                break;
            case g_RIGHTKEY:
                this.m_cPanowalk.turn(-1 / 90, 0);
                break;
            case g_UPKEY:
                this.m_cPanowalk.walk(0);
                break;
            case g_DOWNKEY:
                this.m_cPanowalk.walk(180)
        }
    },
    jumpToGalaxy: function(a) {
        this.m_cPanowalk.jumpToGalaxy(a)
    },
    onUpdateGalaxy: function(a) {
        this.m_cPanowalk.onUpdateGalaxy(a)
    },
    updateGalaxyInfo: function() {
        this.m_cPanowalk.updateGalaxyInfo()
    }
};