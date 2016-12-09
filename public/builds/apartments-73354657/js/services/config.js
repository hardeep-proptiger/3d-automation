/**
 * This file is called first for Initiation, Basically sets certain objects and properties, It is not ins $(document).load function
 * It is called first before initiating anything else
 */

function inspect( str ){
    console.log(JSON.stringify( str ));
};

function cloneObj( obj ) {
    return JSON.parse(JSON.stringify( obj ));
}

Math.PI_2 = .5 * Math.PI;
THREE.ImageUtils.crossOrigin = "";

var g_htmlCanvas, g_cRenderer = null,
    g_cSystemSpecs = {};