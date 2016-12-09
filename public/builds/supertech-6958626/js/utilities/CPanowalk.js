/**
 * CPanowalk Utility
 * @constructor
 */

function CPanowalk() {
    this.m_rFOV = 60;
    this.m_cCamera = this.m_cPanoverse = null;
    this.m_rLongitude = this.m_rLatitude = 0;
    this.m_highlightedMarker = this.m_cMarkerContainer = this.m_cSphere = this.m_cModel = this.m_cContainer = null;
    this.m_markerImages = {
        inactive: null,
        active: null
    };
    this.m_cRaycaster = null;
    this.m_fTransitAnim = this.m_fIsInTransit = !1;
    this.m_cNextSphere = this.m_cCurrSphere = null;
    this.m_vInit = new THREE.Vector3;
    this.m_vGrad = new THREE.Vector3;
    this.m_rTime = 0
}
CPanowalk.prototype = {
    constructor: CPanowalk,
    initialize: function( proptigerObj ) {
        this.loadData( proptigerObj );
        this.m_cCamera = new THREE.PerspectiveCamera(this.m_rFOV, proptigerObj.aspect, .1, 4E3);
        this.m_cCamera.vTarget = new THREE.Vector3;
        this.m_cContainer = new THREE.Object3D;
        this.m_cModel = this.m_cPanoverse.get3DModel();
        this.m_cSphere = new THREE.Object3D;
        for (var i = 0; i < this.m_cPanoverse.m_aPanoSpheres.length; i++) {
            this.m_cPanoverse.isValidNode(i) && this.m_cSphere.add(this.m_cPanoverse.getSphereByIndex(i).getSphereModel());
        }
        this.m_cContainer.add(this.m_cSphere);
        this.initMarkers();
        this.m_cRaycaster = new THREE.Raycaster;
        this.initPosition()
    },
    loadData: function(proptigerObj) {
        this.m_cPanoverse = new CPanoverse;

        var galaxy = parseGalaxyProps(proptigerObj.strStoragePath, proptigerObj.urlGDataFile); // {}
        var sphere = parseSphereProps(proptigerObj.strStoragePath, proptigerObj.urlSDataFile); // {*}

        this.m_cPanoverse.initialize( sphere, galaxy );

        if (g_cSystemSpecs.fUseGalaxy) {
            for (var i = 0; i < this.m_cPanoverse.m_aPanoGalaxies.length; i++) {
                if (this.m_cPanoverse.m_aPanoGalaxies[i]) {
                    for (var j = 0; j < this.m_cPanoverse.m_aPanoGalaxies[i].m_aiSpheres.length; j++) {
                        this.m_cPanoverse.m_aPanoSpheres[this.m_cPanoverse.m_aPanoGalaxies[i].m_aiSpheres[j]] && this.m_cPanoverse.m_aPanoSpheres[this.m_cPanoverse.m_aPanoGalaxies[i].m_aiSpheres[j]].setGalaxyId(i);
                    }
                }

            }

        }

        this.m_cPanoverse.moveToNode(this.m_cPanoverse.m_nStartNode)
    },
    initMarkers: function() {
        this.m_markerImages.inactive = THREE.ImageUtils.loadTexture("./assets/texture/marker1.svg");
        this.m_markerImages.active = THREE.ImageUtils.loadTexture("./assets/texture/marker1_hover.svg");
        var material = new THREE.MeshBasicMaterial({
                map: this.m_markerImages.inactive,
                side: THREE.DoubleSide,
                opacity: 1,
                transparent: !0
            }),
            geometry = new THREE.PlaneBufferGeometry(1, 1);
        this.m_cMarkerContainer = new THREE.Object3D;
        for (var i = 0; i < this.m_cPanoverse.m_aPanoSpheres.length; i++)
            if (this.m_cPanoverse.isValidNode(i)) {
                var mesh = new THREE.Mesh(geometry, material.clone());
                mesh.scale.set(25, 25, 1);
                mesh.position.set(this.m_cPanoverse.getSphereByIndex(i).m_center.x, this.m_cPanoverse.getSphereByIndex(i).m_center.y, this.m_cPanoverse.getSphereByIndex(i).m_center.z - this.m_cPanoverse.m_rTripodHeight);
                mesh.name = "marker";
                mesh.visible = !1;
                mesh.node = i;
                this.m_cMarkerContainer.add(mesh);

                window.mesh = mesh;

                //if( i== 1 || i == 2 || i==3 ) {
                //    inspect( 'for i = '+i+', CENTERX-->'+this.m_cPanoverse.getSphereByIndex(i).m_center.x+', '+'CENTERY--->'+this.m_cPanoverse.getSphereByIndex(i).m_center.y+', '+'CENTERZ--->' + this.m_cPanoverse.getSphereByIndex(i).m_center.z );
                //}
            }
        this.m_cFloatMarkerContainer = new THREE.Object3D
    },
    initPosition: function() {
        var sphere = this.m_cPanoverse.getSphereByIndex(this.m_cPanoverse.getStartNode());
        sphere.getSphereModel().visible = !0;
        this.m_cCamera.position.set(sphere.m_center.x, sphere.m_center.y, sphere.m_center.z);
        this.m_rLatitude = this.m_cPanoverse.getLatitude();
        this.m_rLongitude = this.m_cPanoverse.getStartOrientation();
        this.updateRotation(0, 0);
        this.updateMarkers(this.m_cPanoverse.getStartNode())
    },
    getCamera: function() {
        return this.m_cCamera
    },
    getObjectContainer: function() {
        return this.m_cContainer
    },
    getMarkerContainer: function() {
        return this.m_cMarkerContainer
    },
    getFloatMarkerContainer: function() {
        return this.m_cFloatMarkerContainer
    },
    updateRotation: function(positionX, positionY) {
        this.m_rLongitude += 90 * positionX;
        this.m_rLatitude += 90 * positionY;

        180 < this.m_rLongitude && (this.m_rLongitude -= 360);
        - 180 > this.m_rLongitude && (this.m_rLongitude += 360);
        this.m_rLatitude = Math.max(-60, Math.min(60, this.m_rLatitude));
        var c = THREE.Math.degToRad(90 - this.m_rLatitude),
            d = THREE.Math.degToRad(-this.m_rLongitude);
        this.m_cCamera.vTarget.x = Math.sin(c) * Math.sin(d);
        this.m_cCamera.vTarget.y = Math.sin(c) * Math.cos(d);
        this.m_cCamera.vTarget.z = Math.cos(c);
        this.m_cCamera.vTarget.add(this.m_cCamera.position);
        this.m_cCamera.up = new THREE.Vector3(0, 0, 1);
        this.m_cCamera.lookAt(this.m_cCamera.vTarget);

        if( this.m_cPanoverse.getCurrentNode() === 0 ){

            this.m_cPanoverse.m_controls.latitude = this.m_rLatitude;
            this.m_cPanoverse.m_controls.longitude = this.m_rLongitude;

            this.m_cPanoverse.m_rlatitude = this.m_rLatitude;
            this.m_cPanoverse.m_rStartOrientation = this.m_rLongitude;

        }

    },
    manualRotation: function(positionX, positionY) {
        this.m_rLongitude += 90 * positionX;
        this.m_rLatitude += 90 * positionY;

        180 < this.m_rLongitude && (this.m_rLongitude -= 360);
        - 180 > this.m_rLongitude && (this.m_rLongitude += 360);
        this.m_rLatitude = Math.max(-60, Math.min(60, this.m_rLatitude));
        var c = THREE.Math.degToRad(90 - this.m_rLatitude),
            d = THREE.Math.degToRad(-this.m_rLongitude);
        this.m_cCamera.vTarget.x = Math.sin(c) * Math.sin(d);
        this.m_cCamera.vTarget.y = Math.sin(c) * Math.cos(d);
        this.m_cCamera.vTarget.z = Math.cos(c);
        this.m_cCamera.vTarget.add(this.m_cCamera.position);
        this.m_cCamera.up = new THREE.Vector3(0, 0, 1);
        this.m_cCamera.lookAt(this.m_cCamera.vTarget);

    },
    updateAngleRotation: function( e ) {
        var deg2rad = Math.PI / 180;
        this.m_cCamera.rotation.set (
            !e.beta  ? 0 : e.beta * deg2rad,
            !e.alpha ? 0 : e.alpha * deg2rad,
            !e.gamma ? 0 : -e.gamma * deg2rad
        );
    },
    updateMarkers: function(startNode) {
        //Updates the markers to be seen
        var connectingNodes = this.m_cPanoverse.getConnectingNodes(startNode);
        for (var i = 0; i < this.m_cMarkerContainer.children.length; i++) {
            - 1 < connectingNodes.indexOf(this.m_cMarkerContainer.children[i].node) ? this.m_cMarkerContainer.children[i].visible = !0 : this.m_cMarkerContainer.children[i].visible = !1
        }
    },
    jumpToPosition: function(position) {
        function callback() {
            _this.updateMarkers(position);
            _this.m_cNextSphere.getSphereModel().visible = !0;
            var center = _this.m_cNextSphere.m_center;
            _this.m_cCamera.position.set(center.x, center.y, center.z);
            _this.updateRotation(0, 0);
            _this.m_cCurrSphere.getSphereModel().visible = !1;
            _this.m_cPanoverse.moveToNode(position);
            _this.destroyAndCreateGUI();
        }
        if (!this.m_fIsInTransit && (this.m_cCurrSphere = this.m_cPanoverse.getCurrentSphere(), this.m_cNextSphere = this.m_cPanoverse.getSphereByIndex(position), this.m_cNextSphere.loadSphere(), this.m_cPanoverse.isValidNode(position))) {
            var _this = this,
                status = this.m_cNextSphere.getTexLoadStatus();
            waitForCondition( status, !0, callback)
        }
    },
    animatePanorama: function(time) {
        if (this.m_fTransitAnim) {

            if (this.m_rTime += Math.min(time, 25) / 1500, 1 <= this.m_rTime){
                this.m_fTransitAnim = !1;
                this.endTransit();
            } else {

                //Main animation between two transitions
                easeVal = easingQadraticInOut(this.m_rTime);
                this.m_cNextSphere.getSphereModel().children[0].material.opacity = easeVal;
                var vector = new THREE.Vector3;
                vector.copy(this.m_vGrad);
                vector.multiplyScalar(easeVal);
                vector.add(this.m_vInit);
                this.m_cCamera.position.set(vector.x, vector.y, vector.z)
            }

        }
    },
    startTransit: function(start, end) {
        this.m_cCurrSphere = this.m_cPanoverse.getSphereByIndex(start);
        var currentCenter = this.m_cCurrSphere.m_center;
        this.m_cNextSphere = this.m_cPanoverse.getSphereByIndex(end);
        var nextCenter = this.m_cNextSphere.m_center,
            currentSphereScale = 2.01 * currentCenter.distanceTo(nextCenter) / this.m_cCurrSphere.m_nSphereRadius,
            nextSphereScale = 1 * nextCenter.distanceTo(currentCenter) / this.m_cNextSphere.m_nSphereRadius,
            thisVar = this,
            statusFunction = this.m_cNextSphere.getTexLoadStatus();
        waitForCondition(statusFunction, !0, function() {
            thisVar.m_cCurrSphere.getSphereModel().children[0].scale.set(currentSphereScale, currentSphereScale, currentSphereScale);
            thisVar.m_cNextSphere.getSphereModel().children[0].scale.set(nextSphereScale, nextSphereScale, nextSphereScale);
            thisVar.m_cNextSphere.getSphereModel().children[0].material.transparent = !0;
            thisVar.m_cNextSphere.getSphereModel().children[0].material.opacity = 0;
            thisVar.m_cNextSphere.getSphereModel().visible = !0;
            thisVar.m_vInit.copy(currentCenter);
            thisVar.m_vGrad.subVectors(nextCenter, currentCenter);
            thisVar.m_rTime = 0;
            thisVar.m_fTransitAnim = !0
        })
    },
    endTransit: function() {
        this.m_cCamera.position.set(this.m_cNextSphere.m_center.x, this.m_cNextSphere.m_center.y, this.m_cNextSphere.m_center.z);
        this.updateRotation(0, 0);
        this.m_cNextSphere.getSphereModel().children[0].scale.set(1, 1, 1);
        this.m_cNextSphere.getSphereModel().children[0].material.opacity = 1;
        this.m_cNextSphere.getSphereModel().children[0].material.transparent = !1;
        this.m_cCurrSphere.getSphereModel().visible = !1;
        this.m_cCurrSphere.getSphereModel().children[0].scale.set(1, 1, 1);
        this.m_cPanoverse.moveToNode(this.m_cNextSphere.m_nSphereId);
        this.m_fIsInTransit = !1;

        this.destroyAndCreateGUI();
    },
    moveToPosition: function( position ) {
        if(  this.m_cPanoverse.getConnectingNodes( this.m_cPanoverse.getCurrentNode()).indexOf( position ) != -1 ) {
            !this.m_fIsInTransit && this.m_cPanoverse.isValidMove(position) && position !== this.m_cPanoverse.getCurrentNode() && (this.m_fIsInTransit = !0, this.updateMarkers(position), this.startTransit(this.m_cPanoverse.getCurrentNode(), position))
        } else {
            this.jumpToPosition( position );
        }
    },
    selectMarker: function(x, y) {
        if (!this.m_fIsInTransit) {
            var vector = new THREE.Vector3( x, y, .5 );
            vector.unproject(this.m_cCamera);
            this.m_cRaycaster.set(this.m_cCamera.position, vector.sub(this.m_cCamera.position).normalize());
            var intersects = this.m_cRaycaster.intersectObjects(this.m_cMarkerContainer.children);
            return 0 < intersects.length && !0 === intersects[0].object.visible ? (0 < this.m_cFloatMarkerContainer.children.length && this.removeFloatMarkers(), this.moveToPosition(intersects[0].object.node ), !0) : !1
        }
    },
    removeFloatMarkers: function() {
        this.m_cFloatMarkerContainer.visible = !1;
        this.m_cFloatMarkerContainer.children.length = 0
    },
    highlightMarker: function(x3D, y3D) {
        if (!this.m_fIsInTransit) {
            var c = new THREE.Vector3(x3D, y3D, .5);
            c.unproject(this.m_cCamera);
            this.m_cRaycaster.set(this.m_cCamera.position, c.sub(this.m_cCamera.position).normalize());
            c = this.m_cRaycaster.intersectObjects(this.m_cMarkerContainer.children);
            0 < c.length && !0 === c[0].object.visible ? this.m_highlightedMarker !== c[0].object && (this.m_highlightedMarker && (this.m_highlightedMarker.material.map = this.m_markerImages.inactive), this.m_highlightedMarker = c[0].object, this.m_highlightedMarker.material.map = this.m_markerImages.active) : (this.m_highlightedMarker && (this.m_highlightedMarker.material.map = this.m_markerImages.inactive), this.m_highlightedMarker = null)
        }
    },
    turn: function( positionX, positionY ) {
        this.m_fIsInTransit || this.updateRotation( positionX, positionY )
    },
    computeWalkDirection: function(a, b) {
        var c = Math.atan(Math.tan(THREE.Math.degToRad(.5 * this.m_cCamera.fov * this.m_cCamera.aspect)) * a);
        return THREE.Math.radToDeg(-c)
    },
    walk: function( direction ) {
        if (!this.m_fIsInTransit) {
            for (var currentSphereCenter = this.m_cPanoverse.getCurrentSphere().m_center, vector = new THREE.Vector3(this.m_cCamera.vTarget.x - currentSphereCenter.x, this.m_cCamera.vTarget.y - currentSphereCenter.y, 0), connectingNodes = this.m_cPanoverse.getConnectingNodes(), e = [], g = [], i = 0; i < connectingNodes.length; i++) {
                var center = this.m_cPanoverse.getSphereByIndex(parseInt(connectingNodes[i])).m_center;
                e[i] = currentSphereCenter.distanceTo(center);
                center = new THREE.Vector3(center.x - currentSphereCenter.x, center.y - currentSphereCenter.y, 0);
                g[i] = THREE.Math.radToDeg(vector.angleTo(center));
                var threeVector = new THREE.Vector3;
                threeVector.crossVectors(vector, center);
                g[i] *= Math.sign(threeVector.z)
            }
            var index = -1;
            var time = 1E3;
            for (i = 0; i < connectingNodes.length; i++) 30 > this.angleDistance(direction, g[i]) && e[i] < time && (time = e[i], index = i);
            0 < this.m_cFloatMarkerContainer.children.length && this.removeFloatMarkers();
            - 1 < index && this.moveToPosition(connectingNodes[index]);
        }
    },
    angleDistance: function(angle1, angle2) {
        var angle = Math.abs(angle2 - angle1);
        180 < angle && (angle = 360 - angle);
        return angle
    },
    jumpToGalaxy: function(a) {
        if (!this.m_fIsInTransit) {
            a = this.m_cPanoverse.getToStartGalaxyId(a);
            var b = this.m_cPanoverse.m_aPanoGalaxies[a].m_nStartSphere;
            this.m_rLatitude = 0;
            this.m_rLongitude = this.m_cPanoverse.m_aPanoGalaxies[a].m_rStartOrientation;
            this.jumpToPosition(b)
        }
    },
    onUpdateGalaxy: function(a) {
        this.m_cPanoverse.onUpdateGalaxy(a)
    },
    updateGalaxyInfo: function() {
        this.m_cPanoverse.updateGalaxyInfo()
    },
    hideAllMarkers: function() {
        this.m_cMarkerContainer
            .children
            .forEach(function( marker ) {
                marker.visible = !1
            });
    },
    showConnectedMarkers: function(){
        var connectingNodes = this.m_cPanoverse.getConnectingNodes();
        this.m_cMarkerContainer
            .children
            .forEach(function( marker ) {
                if( connectingNodes.indexOf( marker.node ) != -1 ) {
                    marker.visible = !0
                }
            });
    },
    showAllMarkers: function(){
        this.m_cMarkerContainer
            .children
            .forEach(function( marker ) {
                marker.visible = !0
            });
    },
    showMarkerById: function( id ){
        this.m_cMarkerContainer
            .children
            .forEach(function( marker ){
                if( marker.node == id ) {
                    marker.visible = !0
                }
            });
    },
    getMarkerById: function( id ){
        var returnMarker = null;
        this.m_cMarkerContainer
            .children
            .forEach(function( marker ){
                if( marker.node == id ) {
                    returnMarker= marker;
                }
            });

        return returnMarker
    },
    destroyAndCreateGUI: function(){
        //destroy and create new gui
        this.m_cPanoverse.m_controls.markerSelected ? (this.m_cPanoverse.initGUI(),this.m_cPanoverse.m_controls.resetBeforeMarkerSet(),this.m_cPanoverse.m_controls.reset(), this.m_cPanoverse.m_controls.generateXML(true)):this.m_cPanoverse.initGUI();
    }
};