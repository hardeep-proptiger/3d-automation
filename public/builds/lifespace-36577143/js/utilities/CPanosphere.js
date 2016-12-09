function CPanosphere() {
    this.m_nGalaxyId = 0;
    this.m_strLocationTag = "";
    this.m_nSphereId = 0;
    this.m_mapSphereTex = this.m_urlLSphereTex = this.m_urlMSphereTex = this.m_urlSphereTex = null;
    this.m_fLowTexLoaded = this.m_fHighTexLoaded = this.m_fSphereCreated = !1;
    this.m_cSphereContainer = this.m_rotation = this.m_center = this.m_mapLSphereTex = this.m_mapHSphereTex = null;
    this.m_nSphereRadius = 25;
    this.m_nHeightSegments = this.m_nWidthSegments = 60;
    this.m_mesh = null;
}
CPanosphere.prototype = {
    constructor: CPanosphere,
    initialize: function( sphereInfo ) {
        //this.m_strLocationTag = sphereInfo.strLocationTag;
        this.m_nSphereId = sphereInfo.nSphereId;
        this.m_urlSphereTex = sphereInfo.urlSphereTex;
        this.m_urlMSphereTex = sphereInfo.urlMSphereTex;
        this.m_urlLSphereTex = sphereInfo.urlLSphereTex;
        this.m_center = sphereInfo.center;
        this.m_rotation = sphereInfo.rotation;
        this.m_nSphereRadius = sphereInfo.rRadius;
        this.m_cSphereContainer = new THREE.Object3D;
    },
    setGalaxyId: function(a) {
        this.m_nGalaxyId = a
    },
    getGalaxyId: function() {
        return this.m_nGalaxyId
    },
    getSphereId: function() {
        return this.m_nSphereId
    },
    getTexLoadStatus: function() {
        var a = this;
        return function() {
            return a.m_fLowTexLoaded && a.m_fSphereCreated
        }
    },
    getCenter: function() {
        return this.m_center
    },
    getRotation: function() {
        return this.m_rotation
    },
    getSphereModel: function() {
        return this.m_cSphereContainer
    },
    loadSphere: function() {
        var a = this;
        if (!this.m_fSphereCreated) {
            this.m_mapLSphereTex = THREE.ImageUtils.loadTexture(a.m_urlLSphereTex, void 0, function() {
                a.m_fLowTexLoaded = !0;
                a.m_mapLSphereTex.wrapS = THREE.MirroredRepeatWrapping;
                a.m_mapLSphereTex.wrapT = THREE.MirroredRepeatWrapping;
                a.m_mapHSphereTex = THREE.ImageUtils.loadTexture(a.m_urlMSphereTex && "Mobile" === g_cSystemSpecs.strDevType ? a.m_urlMSphereTex : a.m_urlSphereTex, void 0, function() {
                    a.m_fLowTexLoaded && (a.m_fHighTexLoaded = !0, a.m_mapHSphereTex.wrapS = THREE.MirroredRepeatWrapping, a.m_mapHSphereTex.wrapT = THREE.MirroredRepeatWrapping, a.m_cSphereContainer.children[0] && (a.m_cSphereContainer.children[0].material.map = a.m_mapHSphereTex))
                })
            });

            this.m_mapSphereTex = this.m_fHighTexLoaded ? this.m_mapHSphereTex : this.m_mapLSphereTex;
            var b = new THREE.MeshBasicMaterial({
                    map: this.m_mapSphereTex,
                    side: THREE.DoubleSide
                }),

            c = new THREE.SphereGeometry(this.m_nSphereRadius, this.m_nWidthSegments, this.m_nHeightSegments);
            c.applyMatrix((new THREE.Matrix4).makeScale(-1, 1, 1));
            b = new THREE.Mesh(c, b);
            b.rotation.set(Math.PI_2 + this.m_rotation.x, this.m_rotation.z, this.m_rotation.y, "XYZ");
            b.position.set(this.m_center.x, this.m_center.y, this.m_center.z);
            this.m_mesh = b;
            this.m_cSphereContainer.add(b);
            this.m_cSphereContainer.visible = !1;
            this.m_fSphereCreated = !0;
            //console.log('NOW SPHERE HAS BEEN CREATED!!!');
        }
    },
    unloadSphere: function() {
        //console.log('unloadSphere is called!!');
        if (this.m_fSphereCreated) {
            //console.log('Called unloadSphere() and SPHERE HAS BEEN CREATED');
            var a = this.m_cSphereContainer.children[0];
            this.m_cSphereContainer.remove(a);
            a.material.dispose();
            a.geometry.dispose();
            this.m_mapHSphereTex = null;
            this.m_fHighTexLoaded = !1;
            this.m_mapLSphereTex = null;
            this.m_fLowTexLoaded = !1;
            this.m_mapSphereTex = null;
            this.m_fSphereCreated = !1
        }
    },
    manualLoad: function() {
        this.m_mesh.rotation.set(Math.PI_2 + this.m_rotation.x, this.m_rotation.z, this.m_rotation.y, "XYZ");
        this.m_mesh.position.set(this.m_center.x, this.m_center.y, this.m_center.z);
    }
};