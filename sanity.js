var checkIfDirectoryExists = require('./routes.js').checkIfDirectoryExists;
var checkIfFileExists = require('./routes.js').checkIfFileExists;

var fs = require('fs');
var fsExtra = require('fs-extra');

var sanity = {
    sanity1: false,
    sanity2: false,
    sanity3: false,
    sanity4: false,
    sanity5: false
};

// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};

var sanity1 = function( response, dirPath, successCallBack ) {
    checkIfDirectoryExists( dirPath+'/highres', function(){

        checkIfDirectoryExists(dirPath+'/midres', function(){

            checkIfDirectoryExists(dirPath+'/lowres', function(){

                sanity.sanity1 = true;
                successCallBack();

            }, function(){
                sanity.sanity1 = false;
                response.send({
                    error: true,
                    reason: 'sanity',
                    sanity: sanity
                })
            });

        }, function(){
            sanity.sanity1 = false;
            response.send({
                error: true,
                reason: 'sanity',
                sanity: sanity
            })
        });

    }, function(){
        sanity.sanity1 = false;
        response.send({
            error: true,
            reason: 'sanity',
            sanity: sanity
        })
    })
};

var sanity2 = function( response, dirPath, successCallBack ) {

    var highresLength = 0;
    var midresLength = 0;
    var lowresLength = 0;

    fs.readdir( dirPath+'/highres',function(err,files){
        if (err) throw err;

        files.forEach(function(file){
            if( (/\.(gif|jpg|jpeg|tiff|png)$/i).test( file ) ) {
                highresLength++;
            }
        });

        fs.readdir( dirPath+'/midres',function(err,files){
            if (err) throw err;

            files.forEach(function(file){
                if( (/\.(gif|jpg|jpeg|tiff|png)$/i).test( file ) ) {
                    midresLength++;
                }
            });

            fs.readdir( dirPath+'/lowres',function(err,files){
                if (err) throw err;

                files.forEach(function(file){
                    if( (/\.(gif|jpg|jpeg|tiff|png)$/i).test( file ) ) {
                        lowresLength++;
                    }
                });

                if( ( highresLength === lowresLength ) && ( highresLength === midresLength ) && ( highresLength > 2 ) ) {

                    sanity.sanity2 = true;
                    successCallBack();

                } else {
                    sanity.sanity2 = false;
                    response.send({
                        error: true,
                        reason: 'sanity',
                        sanity: sanity
                    })

                }

            });

        });

    });

};

var sanity3 = function( response, dirPath, successCallBack ) {

    var highresLength = [];
    var midresLength = [];
    var lowresLength = [];

    fs.readdir( dirPath+'/highres',function(err,files){
        if (err) throw err;

        files.forEach(function(file){
            if( (/\.(gif|jpg|jpeg|tiff|png)$/i).test( file ) ) {
                highresLength.push( file );
            }
        });

        fs.readdir( dirPath+'/midres',function(err,files){
            if (err) throw err;

            files.forEach(function(file){
                if( (/\.(gif|jpg|jpeg|tiff|png)$/i).test( file ) ) {
                    midresLength.push( file );
                }
            });

            fs.readdir( dirPath+'/lowres',function(err,files){
                if (err) throw err;

                files.forEach(function(file){
                    if( (/\.(gif|jpg|jpeg|tiff|png)$/i).test( file ) ) {
                        lowresLength.push( file );
                    }
                });

                if( ( highresLength.equals(lowresLength) ) && ( highresLength.equals(midresLength) ) && ( lowresLength.equals(midresLength) ) ) {

                    sanity.sanity3 = true;
                    var images = [];

                    var extension = highresLength[0].substr(highresLength[0].lastIndexOf('.'));
                    for( var i = 0; i< highresLength.length; i++ ) {
                        images.push(i+extension);
                    }

                    successCallBack( images );

                } else {
                    sanity.sanity3 = false;
                    response.send({
                        error: true,
                        reason: 'sanity',
                        sanity: sanity
                    })

                }

            });

        });

    });

};

var sanity4 = function( response, dirPath, successCallBack ) {

    checkIfFileExists( dirPath+'/connections.json', function(){

        fsExtra.readJson(dirPath+'/connections.json', function (err, packageObj) {
            if( err ) {
                sanity.sanity4 = false;
                response.send({
                    error: true,
                    reason: 'sanity',
                    sanity: sanity
                })

            } else {

                var found = null;
                Object.keys( packageObj ).length === 0 ? found = !0:found=!1;
                for( i in packageObj ) {
                    if( !(packageObj[i] && packageObj[i].length > 0) ) {
                        found =!0;
                    }
                }

                if( found ) {
                    sanity.sanity4 = false;
                    response.send({
                        error:  true,
                        reason: 'sanity',
                        sanity: sanity
                    })
                } else {
                    sanity.sanity4 = true;
                    successCallBack( packageObj );
                }

            }
        });

    }, function(){
        sanity3( response, dirPath, function( images ){
             var tempArr = {};
             images.forEach(function( val, ind ){
                  tempArr[ind] = [];
             });

             successCallBack( tempArr );
        });
    });
};


var sanity5 = function( response, dirPath, successCallBack ) {

    var fileFound = !1,
        filename = null;
    fs.readdir( dirPath,function(err,files){
        files.forEach(function( file ){
            if( (/floorplan\.(jpg|jpeg|gif|JPG|png|PNG)$/).test( file ) ) {
                fileFound = !0;
                filename = file;
            }
        });

        if( fileFound ) {
            sanity.sanity5 = true;
            successCallBack( filename );
        } else {
            sanity.sanity5 = false;
            response.send({
                error: true,
                reason: 'sanity',
                sanity: sanity
            })
        }
    });

};

module.exports = {
    sanity1: sanity1,
    sanity2: sanity2,
    sanity3: sanity3,
    sanity4: sanity4,
    sanity5: sanity5
};