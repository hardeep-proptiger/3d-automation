function CGController(){
    this.centerX = this.centerY = this.centerZ = this.rotationX = this.rotationY = this.rotationZ = this.latitude = this.longitude = this._this = this.sphere = this.resetValues = this.marker = this.markerX = this.markerY = this.markerZ = null;
    this.selectMarker = 'connected';
    this.options = [];
    this.rawOptions = [];
    this.gui = null;
    this.resetMarker = {};
    this.markerSelected = false;
}

CGController.prototype = {
    constructor: CGController,
    initialize: function( _this, sphere, options, resetValues ) {
    this._this = _this;
    this.sphere = sphere;
    this.resetValues = resetValues;
    if( !options ) {
        this.rawOptions   = resetValues.rawOptions;
        this.options      = resetValues.options;
        this.selectMarker = resetValues.selectMarker;
        if( !!resetValues.marker ) {
            this.marker       = resetValues.marker;
            this.markerX      = resetValues.marker.position.x;
            this.markerY      = resetValues.marker.position.y;
            this.markerZ      = resetValues.marker.position.z+this._this.m_rTripodHeight;
            this.resetMarker.markerX = this.markerX;
            this.resetMarker.markerY = this.markerY;
            this.resetMarker.markerZ = this.markerZ;
            this.markerSelected = false;
        }
    } else {
        this.rawOptions = JSON.parse(JSON.stringify( options ));
        this.options = JSON.parse(JSON.stringify( this.rawOptions ));
        this.options.push( this.selectMarker, 'all' );
    }

    this.centerX = sphere.m_center.x;
    this.centerY = sphere.m_center.y;
    this.centerZ = sphere.m_center.z;
    this.rotationX = THREE.Math.radToDeg( sphere.m_rotation._x );
    this.rotationY = THREE.Math.radToDeg( sphere.m_rotation._y );
    this.rotationZ = THREE.Math.radToDeg( sphere.m_rotation._z );
    this.latitude = _this.m_rlatitude;
    this.longitude = _this.m_rStartOrientation;
    this.gui = new dat.GUI();

    },
    resetMarkerChanges: function(){
        this.marker.position.set( this.resetMarker.markerX, this.resetMarker.markerY, this.resetMarker.markerZ - this._this.m_rTripodHeight);
        this._this.getSphereByIndex( this.marker.node ).m_center = new THREE.Vector3( this.resetMarker.markerX, this.resetMarker.markerY, this.resetMarker.markerZ );
        this.markerX = this.resetMarker.markerX;
        this.markerY = this.resetMarker.markerY;
        this.markerZ = this.resetMarker.markerZ;
        this._this.initGUI( true, this );
    },
    markerXChange: function( value ){
        this.object.markerSelected = true;
        var y = this.object._this.getSphereByIndex( this.object.marker.node ).m_center.y;
        var z = this.object._this.getSphereByIndex( this.object.marker.node ).m_center.z;
        this.object._this.getSphereByIndex( this.object.marker.node ).m_center = new THREE.Vector3( parseFloat( value ), y, z );
        this.object.marker.position.set( value, this.object.marker.position.y, this.object.marker.position.z );
        this.object.sphere.manualLoad();
    },
    markerYChange: function( value ){
        this.object.markerSelected = true;
        var x = this.object._this.getSphereByIndex( this.object.marker.node ).m_center.x;
        var z = this.object._this.getSphereByIndex( this.object.marker.node ).m_center.z;
        this.object._this.getSphereByIndex( this.object.marker.node ).m_center = new THREE.Vector3( x, parseFloat( value ), z );
        this.object.marker.position.set( this.object.marker.position.x, value, this.object.marker.position.z);
        this.object.sphere.manualLoad();
    },
    markerZChange: function( value ){
        this.object.markerSelected = true;
        var x = this.object._this.getSphereByIndex( this.object.marker.node ).m_center.x;
        var y = this.object._this.getSphereByIndex( this.object.marker.node ).m_center.y;
        this.object._this.getSphereByIndex( this.object.marker.node ).m_center = new THREE.Vector3( x, y, parseFloat( value ));
        this.object.marker.position.set( this.object.marker.position.x, this.object.marker.position.y, parseFloat( value ) - this.object._this.m_rTripodHeight );
        this.object.sphere.manualLoad();
    },
    resetBeforeMarkerSet: function(){
        this._this.initGUI( true, this);
    },
    reset: function() {
        this.centerX = this.resetValues.centerX;
        this.centerY = this.resetValues.centerY;
        this.centerZ = this.resetValues.centerZ;
        this.rotationX = THREE.Math.degToRad( this.resetValues.rotationX );
        this.rotationY = THREE.Math.degToRad( this.resetValues.rotationY );
        this.rotationZ = THREE.Math.degToRad( this.resetValues.rotationZ );

        this.sphere.m_center = new THREE.Vector3( this.centerX, this.centerY, this.centerZ  );
        this.sphere.m_rotation = new THREE.Euler( this.rotationX, this.rotationY, this.rotationZ, "XYZ");
        this.sphere.manualLoad();
        this._this.initGUI();
    },
    generateXML: function( bool ) {

        var generate = false;

        var startNode = ( bool ) ? this._this.getCurrentNode() : (generate = true,0);

        var startXml = '<?xml version="1.0"?><opencv_storage><NoOfSpheres>'+this._this.m_nNumNodes+'</NoOfSpheres><StartNode>'+startNode+'</StartNode><latitude>'+ this.latitude +'</latitude><StartOrientation>'+this.longitude+'</StartOrientation><TripodHeight>140.</TripodHeight>';

        var spheresStart = '<Spheres>';

        var spheres = '';

        var spheresEnd = '</Spheres>';

        var endXml = '</opencv_storage>';

        for (var i = 0; i < this._this.m_aPanoSpheres.length; i++) {

            if( void 0 !== this._this.m_aPanoSpheres[i] ) {

                var panoSphere = this._this.m_aPanoSpheres[i];
                spheres = spheres+'<_><SphereID>'+i+'</SphereID><ImagePath>'+panoSphere.m_urlSphereTex.substr( g_cRenderer.m_proptigerObj.strStoragePath.length )+'</ImagePath><LImagePath>'+panoSphere.m_urlLSphereTex.substr( g_cRenderer.m_proptigerObj.strStoragePath.length )+'</LImagePath><MImagePath>'+panoSphere.m_urlMSphereTex.substr( g_cRenderer.m_proptigerObj.strStoragePath.length )+'</MImagePath><CenterX>'+panoSphere.m_center.x+'</CenterX><CenterY>'+panoSphere.m_center.y+'</CenterY><CenterZ>'+panoSphere.m_center.z+'</CenterZ><Radius>25.</Radius><RotationX>'+THREE.Math.radToDeg( panoSphere.m_rotation._x )+'</RotationX><RotationY>'+THREE.Math.radToDeg( panoSphere.m_rotation._y )+'</RotationY><RotationZ>'+THREE.Math.radToDeg( panoSphere.m_rotation._z )+'</RotationZ><Connections>'+this._this.m_rawConnections[i]+'</Connections></_>';

            }

        }

        var xml = startXml + spheresStart + spheres + spheresEnd + endXml;

        var obj = {
          xml        : xml,
          projectName: projectName,
          generate: generate
        };

        this.automatic( obj );

        console.log( xml );
    },
    getGUI: function(){
        return this.gui
    },
    getOptions: function() {
        return this.options
    },
    attachEvents: function(){
        var _this = this;

        if( !_this.marker ) {

            this.gui.add(_this, 'centerX', -1000, 1000)
                .onChange(_this.centerXChange);

            this.gui.add(_this, 'centerY', -1000, 1000)
                .onChange(_this.centerYChange);

            this.gui.add(_this, 'centerZ', 0, 700)
                .onChange(_this.centerZChange);

            this.gui.add(_this, 'rotationX', -500, 500)
                .onChange(_this.rotationXChange);

            this.gui.add(_this, 'rotationY', -500, 500)
                .onChange(_this.rotationYChange);

            this.gui.add(_this, 'rotationZ', -360, 360)
                .onChange(_this.rotationZChange);

            this.gui.add(_this,'reset');

        } else {

            this.gui.add(_this, 'markerX', -2000, 2000)
                .onChange(_this.markerXChange);

            this.gui.add(_this, 'markerY', -2000, 2000)
                .onChange(_this.markerYChange);

            this.gui.add(_this, 'markerZ', -500, 500)
                .onChange(_this.markerZChange);

            this.gui.add(_this, 'bringMarkerHere');

            this.gui.add(_this,'resetMarkerChanges');

        }

        this._this.getCurrentNode() === 0?this.startOrientation():'';

        //!this._this.marker ? this.startOrientation():'';

        this.gui.add( _this, 'selectMarker', _this.getOptions() )
            .onChange(_this.selectOnChange);

        this.gui.add(_this,'toggleFloorPlan').name('Toggle Floor Plan');

        this.gui.add(_this,'generateXML').name('Generate Project');

    },
    centerXChange: function( value ){
        this.object.sphere.m_center = new THREE.Vector3( parseFloat( value ), this.object.centerY, this.object.centerZ  );
        this.object.sphere.manualLoad();
    },
    centerYChange: function( value ){
        this.object.sphere.m_center = new THREE.Vector3( this.object.centerX, parseFloat( value ), this.object.centerZ  );
        this.object.sphere.manualLoad();
    },
    centerZChange: function( value ){
        this.object.sphere.m_center = new THREE.Vector3( this.object.centerX, this.object.centerY, parseFloat( value ) );
        this.object.sphere.manualLoad();
    },
    rotationXChange: function( value ){
        this.object.sphere.m_rotation = new THREE.Euler(THREE.Math.degToRad(parseFloat( value )), THREE.Math.degToRad(parseFloat( this.object.rotationY )), THREE.Math.degToRad(parseFloat( this.object.rotationZ )), "XYZ");
        this.object.sphere.manualLoad();
    },
    rotationYChange: function( value ){
        this.object.sphere.m_rotation = new THREE.Euler(THREE.Math.degToRad(parseFloat( this.object.rotationX )), THREE.Math.degToRad(parseFloat( value )), THREE.Math.degToRad(parseFloat( this.object.rotationZ )), "XYZ");
        this.object.sphere.manualLoad();
    },
    rotationZChange: function( value ){
        this.object.sphere.m_rotation = new THREE.Euler(THREE.Math.degToRad(parseFloat( this.object.rotationX )), THREE.Math.degToRad(parseFloat( this.object.rotationY )), THREE.Math.degToRad(parseFloat( value )), "XYZ");
        this.object.sphere.manualLoad();
    },
    latitudeChange: function( value ){
        g_cRenderer.m_cPanowalk.m_rLatitude = value;
        this.object._this.m_rlatitude = value;
        g_cRenderer.m_cPanowalk.manualRotation(0,0);
    },
    longitudeChange: function( value ){
        this.object._this.m_rStartOrientation = value;
        g_cRenderer.m_cPanowalk.m_rLongitude = value;
        g_cRenderer.m_cPanowalk.manualRotation(0,0);
    },
    selectOnChange: function( value ){
        if( value == 'all' ) {
            g_cRenderer.m_cPanowalk.hideAllMarkers();
            g_cRenderer.m_cPanowalk.showAllMarkers();
            this.object.marker = null;
            this.object.resetBeforeMarkerSet();
        } else if( value == 'connected' ) {
            g_cRenderer.m_cPanowalk.hideAllMarkers();
            g_cRenderer.m_cPanowalk.showConnectedMarkers();
            this.object.marker = null;
            this.object.reset();
        } else {
            g_cRenderer.m_cPanowalk.hideAllMarkers();
            g_cRenderer.m_cPanowalk.showMarkerById( value );
            this.object.marker = g_cRenderer.m_cPanowalk.getMarkerById( value );
            this.object.resetBeforeMarkerSet();
        }
    },
    startOrientation: function() {
        var _this = this;
        var latitude = this.gui.add(_this, 'latitude', -180, 180).listen();
        var longitude = this.gui.add(_this, 'longitude', -180, 180).listen();

        latitude.onChange(_this.latitudeChange);

        longitude.onChange(_this.longitudeChange);
    },
    moveToPosition: function(){
        g_cRenderer.m_cPanowalk.moveToPosition( this.selectMarker );
    },
    toggleFloorPlan: function() {
        var display = document.getElementById('content').style.display;
        if(  display == 'block' ) {
            document.getElementById('content').style.display = 'none';
        } else {
            document.getElementById('content').style.display = 'block';
        }
    },
    automatic: function( data ) {

        ( data.generate ) ? $('.splash').fadeIn():'';

        var _this = this;
        $.ajax({
            url: '/automatic-xml',
            type: "POST",
            dataType: "json",
            data: data,
            success: function( res ) {
                if( data.generate ) {

                    $('.splash').fadeOut();
                    if( res.error ) {

                        _this.showAndHide( $('.not-saved') );
                        
                    } else {

                        _this.show( $('.saved') );

                    }

                }
            }
        });
    },
    showAndHide: function( elem ) {
        elem.fadeIn(500);
        setTimeout(function(){
           elem.fadeOut(500);
        },2000);
    },
    show: function( elem ) {
        elem.fadeIn(500);
    },
    bringMarkerHere: function() {
        var currentSphere = this._this.getSphereByIndex( this._this.getCurrentNode() );
        var nextSphere = this._this.getSphereByIndex( this.selectMarker );

        var currentMarker = g_cRenderer.m_cPanowalk.getMarkerById( this._this.getCurrentNode() );
        var nextMarker = g_cRenderer.m_cPanowalk.getMarkerById( this.selectMarker );

        nextSphere.m_center = new THREE.Vector3( currentSphere.m_center.x, currentSphere.m_center.y, currentSphere.m_center.z );
        nextMarker.position.set( currentMarker.position.x, currentMarker.position.y, currentMarker.position.z );
        nextSphere.manualLoad();

        this.resetBeforeMarkerSet();
    }
};