function CPanoverse() {
    this.m_strTitle = "";
    this.m_c3DModel = this.m_url3DModel = null;
    this.m_nNumNodes = 0;
    this.m_aPanoSpheres = [];
    this.m_aaConnectionGraph = [];
    this.m_rawConnections = [];
    this.m_nNumGalaxies = this.m_iCurrentNode = 0;
    this.m_aPanoGalaxies = [];
    this.m_rStartOrientation = this.m_nStartNode = this.m_startGalaxy = this.m_nRootGalaxy = this.m_iCurrentGalaxy = this.m_rlatitude = 0;
    this.m_rTripodHeight = 150;
    this.m_workingSphere = null;
    this.m_gui = null;
    this.m_controls = null;
}

CPanoverse.prototype = {
    constructor: CPanoverse,
    initialize: function(sphere, galaxy) {
        this.m_url3DModel = sphere.url3DModel;
        this.m_nNumNodes = sphere.nNumNodes;
        this.m_aPanoSpheres = sphere.aPanoSpheres;
        this.m_aaConnectionGraph = sphere.aaConnectionGraph;
        this.m_rawConnections = sphere.rawConnections;
        g_cSystemSpecs.fUseGalaxy ? (this.m_nNumGalaxies = galaxy.nNumGalaxies, this.m_aPanoGalaxies = galaxy.aPanoGalaxies, this.m_nRootGalaxy = 0, this.m_nStartGalaxy = this.getToStartGalaxyId(this.m_nRootGalaxy), this.m_nStartNode = this.m_aPanoGalaxies[this.m_nStartGalaxy].m_nStartSphere, this.m_rStartOrientation = this.m_aPanoGalaxies[this.m_nStartGalaxy].m_rStartOrientation, this.m_iCurrentGalaxy = this.m_nStartGalaxy) : (this.m_nStartNode = sphere.nStartNode, this.m_rStartOrientation = sphere.rStartOrientation, this.m_rlatitude = sphere.latitude);
        this.m_iCurrentNode = this.m_nStartNode;
        this.m_aPanoSpheres[this.m_nStartNode].loadSphere();
        this.m_rTripodHeight = sphere.rTripodHeight;

        /**
         * The main GUI function
         */
        this.initGUI();
    },
    get3DModel: function() {
        return this.m_c3DModel
    },
    getStartNode: function() {
        return this.m_nStartNode
    },
    getLatitude: function(){
        return this.m_rlatitude
    },
    getStartOrientation: function() {
        return this.m_rStartOrientation
    },
    getConnectingNodes: function( startNode ) {
        //returns connection graph
        void 0 === startNode && (startNode = this.m_iCurrentNode);
        if (this.isValidNode(startNode)) return this.m_aaConnectionGraph[startNode]
    },
    getCurrentNode: function() {
        return this.m_iCurrentNode
    },
    getCurrentSphere: function() {
        return this.m_aPanoSpheres[this.m_iCurrentNode]
    },
    getSphereByIndex: function( index ) {
        if (this.isValidNode( index )) return this.m_aPanoSpheres[ index ]
    },
    isValidNode: function(startNode) {
        return 0 <= startNode && this.m_aPanoSpheres.length > startNode && void 0 !== this.m_aPanoSpheres[startNode]
    },
    isValidMove: function(position) {
        return this.isValidNode(position)
    },
    moveToNode: function( startNode ) {
        if (this.isValidNode(startNode)) {
            var disjointNodes = this.getDisjointNodes(startNode, this.m_iCurrentNode);
            this.unloadSpheres( disjointNodes );
            this.m_iCurrentNode = startNode;

            galaxyId = this.m_aPanoSpheres[startNode].m_nGalaxyId;
            galaxyId !== this.m_iCurrentGalaxy && (this.m_iCurrentGalaxy = galaxyId, this.updateGalaxyInfo());

            this.loadConnectingSpheres(startNode);
            return !0
        }
        return !1
    },
    loadConnectingSpheres: function( startNode ) {
        for (var i = 0; i < this.m_aaConnectionGraph[startNode].length; i++) {
            this.m_aPanoSpheres[this.m_aaConnectionGraph[startNode][i]].loadSphere()
        }
    },
    getDisjointNodes: function(startNode, currentNode) {
        var sliced = this.m_aaConnectionGraph[startNode].slice();
        sliced.push(currentNode, startNode);
        return sliced
    },
    unloadSpheres: function(disjointNodes) {
        for (var i = 0; i < this.m_aPanoSpheres.length; i++) {
            //inspect('i is '+i+' ----> '+ (void 0 !== this.m_aPanoSpheres[i]) + ' and 2nd condition is '+(0 > disjointNodes.indexOf(i)));
            void 0 !== this.m_aPanoSpheres[i] && 0 > disjointNodes.indexOf(i) && this.m_aPanoSpheres[i].unloadSphere()
        }
    },
    getToStartGalaxyId: function(a) {
        var b;
        do b = this.m_aPanoGalaxies[a].m_nStartSphere, a = this.m_aPanoGalaxies[a].m_nStartGalaxy; while (-1 === b);
        return a
    },
    getRootGalaxy: function() {
        return this.m_aPanoGalaxies[this.m_nRootGalaxy]
    },
    onUpdateGalaxy: function(a) {
        this.onUpdateGalaxyFn = a
    },
    updateGalaxyInfo: function() {
        if (this.onUpdateGalaxyFn) {
            var a = {};
            a.strPrimaryTitle = this.m_aPanoGalaxies[this.m_nRootGalaxy].m_strTitle;
            a.strPrimaryDescr = this.m_aPanoGalaxies[this.m_nRootGalaxy].m_strDescription;
            a.strPrimarySpecs = this.m_aPanoGalaxies[this.m_nRootGalaxy].m_aTags;
            a.strSecondTitle = this.m_aPanoGalaxies[this.m_iCurrentGalaxy].m_strTitle;
            a.strSecondDescr = this.m_aPanoGalaxies[this.m_iCurrentGalaxy].m_strDescription;
            a.strSecondSpecs = this.m_aPanoGalaxies[this.m_iCurrentGalaxy].m_aTags;
            a.iCurrentGalaxy = this.m_iCurrentGalaxy;
            a.aGalaxyRefs = this.getNextGalaxyRefs(this.m_iCurrentGalaxy);
            this.onUpdateGalaxyFn(a)
        }
    },
    getNextGalaxyRefs: function(a) {
        var b =
            this.getGalaxyChildren(a);
        0 === b.length && (b = this.getGalaxySiblings(a));
        return b
    },
    getGalaxyChildren: function(a) {
        var b = [];
        a = this.m_aPanoGalaxies[a].m_aiChildren;
        for (var c = 0; c < a.length; c++) b.push({
            nGalaxyId: this.m_aPanoGalaxies[a[c]].m_nGalaxyId,
            strTitle: this.m_aPanoGalaxies[a[c]].m_strTitle
        });
        return b
    },
    getGalaxySiblings: function(a) {
        var b = [];
        a = this.m_aPanoGalaxies[this.m_aPanoGalaxies[a].m_nParentId].m_aiChildren;
        for (var c = 0; c < a.length; c++) b.push({
            nGalaxyId: this.m_aPanoGalaxies[a[c]].m_nGalaxyId,
            strTitle: this.m_aPanoGalaxies[a[c]].m_strTitle
        });
        return b
    },
    initGUI: function( notReset, preset ) {

        this.m_workingSphere = this.getCurrentSphere();
        var resetValues = null,
            nodes = null;
        this.m_controls = new CGController();
        if( notReset ) {
            resetValues = preset;
        } else {
            resetValues = {};
            resetValues.centerX     = this.m_workingSphere.m_center.x;
            resetValues.centerY     = this.m_workingSphere.m_center.y;
            resetValues.centerZ     = this.m_workingSphere.m_center.z;
            resetValues.rotationX   = THREE.Math.radToDeg( this.m_workingSphere.m_rotation._x );
            resetValues.rotationY   = THREE.Math.radToDeg( this.m_workingSphere.m_rotation._y );
            resetValues.rotationZ   = THREE.Math.radToDeg( this.m_workingSphere.m_rotation._z );
            nodes                   = this.getConnectingNodes( this.getCurrentNode() );
        }

        this.m_controls.initialize( this, this.m_workingSphere, nodes, resetValues );
        this.m_gui?this.m_gui.destroy():'';
        this.m_gui = this.m_controls.getGUI();

        this.m_controls.attachEvents();

    }
};