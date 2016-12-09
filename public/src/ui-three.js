(function() {
    angular.module("automationApp").directive("uiThree", [UiThree]);

    function UiThree() {
        return {
            restrict: "AC",
            link: function(scope, element, attrs){

                var camera, scene, renderer;

                var isUserInteracting = false,
                    onMouseDownMouseX = 0, onMouseDownMouseY = 0,
                    lon = 0, onMouseDownLon = 0,
                    lat = 0, onMouseDownLat = 0,
                    phi = 0, theta = 0;

                var width = 540,
                    height = 500;

                init();
                animate();

                function init() {

                    var container, mesh;

                    container = element[0];

                    camera = new THREE.PerspectiveCamera( 75, width/height, 1, 1100 );
                    camera.target = new THREE.Vector3( 0, 0, 0 );

                    scene = new THREE.Scene();

                    var geometry = new THREE.SphereGeometry( 500, 60, 40 );
                    geometry.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) );

                    var material = new THREE.MeshBasicMaterial( {
                        map: THREE.ImageUtils.loadTexture( attrs.uiThree )
                    } );

                    mesh = new THREE.Mesh( geometry, material );

                    scene.add( mesh );

                    renderer = new THREE.WebGLRenderer();
                    renderer.setSize( width, height );
                    container.appendChild( renderer.domElement );

                    container.addEventListener( 'mousedown', onDocumentMouseDown, false );
                    container.addEventListener( 'mousemove', onDocumentMouseMove, false );
                    container.addEventListener( 'mouseup', onDocumentMouseUp, false );

                    //

                    container.addEventListener( 'dragover', function ( event ) {

                        event.preventDefault();
                        event.dataTransfer.dropEffect = 'copy';

                    }, false );

                    container.addEventListener( 'dragenter', function ( event ) {

                        document.body.style.opacity = 0.5;

                    }, false );

                    container.addEventListener( 'dragleave', function ( event ) {

                        document.body.style.opacity = 1;

                    }, false );

                    container.addEventListener( 'drop', function ( event ) {

                        event.preventDefault();

                        var reader = new FileReader();
                        reader.addEventListener( 'load', function ( event ) {

                            material.map.image.src = event.target.result;
                            material.map.needsUpdate = true;

                        }, false );
                        reader.readAsDataURL( event.dataTransfer.files[ 0 ] );

                        document.body.style.opacity = 1;

                    }, false );

                    //

                }


                function onDocumentMouseDown( event ) {

                    event.preventDefault();

                    isUserInteracting = true;

                    onPointerDownPointerX = event.clientX;
                    onPointerDownPointerY = event.clientY;

                    onPointerDownLon = lon;
                    onPointerDownLat = lat;

                }

                function onDocumentMouseMove( event ) {

                    if ( isUserInteracting === true ) {

                        lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
                        lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

                    }

                }

                function onDocumentMouseUp( event ) {

                    isUserInteracting = false;

                }

                function animate() {

                    requestAnimationFrame( animate );
                    update();

                }

                function update() {

                    // if ( isUserInteracting === false ) {

                    // 	lon += 0.1;

                    // }

                    lat = Math.max( - 85, Math.min( 85, lat ) );
                    phi = THREE.Math.degToRad( 90 - lat );
                    theta = THREE.Math.degToRad( lon );

                    camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
                    camera.target.y = 500 * Math.cos( phi );
                    camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );

                    camera.lookAt( camera.target );

                    /*
                     // distortion
                     camera.position.copy( camera.target ).negate();
                     */

                    renderer.render( scene, camera );

                }

            }
        }
    }
})();