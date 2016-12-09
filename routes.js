var fs = require('fs'),
    path = require('path'),
    source = 'public/projects',
    builds = 'public/builds',
    fse = require('fs-extra'),
    pd = require('pretty-data2').pd,
    noCache = require('connect-nocache')();

var generateXML = function( data ) {

    var startXml = '<?xml version="1.0"?><opencv_storage><NoOfSpheres>'+data.images.length+'</NoOfSpheres><StartNode>0</StartNode><latitude>-15.993690851735115</latitude><StartOrientation>-54.203125</StartOrientation><TripodHeight>140.</TripodHeight>';

    var spheresStart = '<Spheres>';

    var spheres = '';

    var spheresEnd = '</Spheres>';

    var endXml = '</opencv_storage>';

    var projectName = data.projectName;

    for (var i = 0; i < data.images.length; i++) {
        spheres = spheres+'<_><SphereID>'+i+'</SphereID><ImagePath>highres/'+data.images[i]+'</ImagePath><LImagePath>lowres/'+data.images[i]+'</LImagePath><MImagePath>midres/'+data.images[i]+'</MImagePath><CenterX>0</CenterX><CenterY>0</CenterY><CenterZ>140</CenterZ><Radius>25.</Radius><RotationX>0</RotationX><RotationY>0</RotationY><RotationZ>-43.51</RotationZ><Connections>'+ data.connections[i].join(" ") +'</Connections></_>';
    }

    var final = startXml + spheresStart + spheres + spheresEnd + endXml;

    return final;

};

var checkIfDirectoryExists = function( dirPath, successCallback, errorCallback ) {

    try {
        // Query the entry
        var stats = fs.lstatSync( dirPath );

        // Is it a directory?
        if (stats.isDirectory()) {
           successCallback()
        }
    }
    catch (e) {
        errorCallback();
    }

};

var checkIfFileExists = function( dirPath, successCallback, errorCallback ) {

    try {
        // Query the entry
        var stats = fs.lstatSync( dirPath );

        // Is it a directory?
        if (stats.isFile()) {
            successCallback()
        }
    }
    catch (e) {
        errorCallback();
    }

};

module.exports = {
    checkIfFileExists: checkIfFileExists,
    checkIfDirectoryExists: checkIfDirectoryExists,
    directory: function( app ) {
        /**
         * Read folder contents and give suggestions
         */
        app.get('/directory',  function(req , res){

            var params = req.query.name;
            var suggestions = [];

            function getDirectories() {
                return fs.readdirSync( source ).filter(function(file) {
                    return fs.statSync(path.join( __dirname, source+'/'+file)).isDirectory();
                });
            }

            getDirectories()
                .forEach(function( dir ){
                    if( dir.toLowerCase().indexOf( params.toLowerCase()) > -1 ) {
                        suggestions.push( dir );
                    }
                });

            var send = suggestions.length > 8 ? suggestions.slice( 0,7 ):suggestions;
            res.send(send)
        });

        app.get('/all-directory', noCache, function(req , res){

            var suggestions = [];

            function getSource() {
                return fs.readdirSync( source ).filter(function(file) {
                    return fs.statSync(path.join( __dirname, source+'/'+file)).isDirectory();
                });
            }

            function getBuilds() {
                return fs.readdirSync( builds ).filter(function(file) {
                    return fs.statSync(path.join( __dirname, builds+'/'+file)).isDirectory();
                });
            }

            getSource()
                .forEach(function( dir ){
                    suggestions.push({
                        name: dir,
                        type: 'Projects'
                    });
                });

            getBuilds()
                .forEach(function( dir ){
                    suggestions.push({
                        name: dir,
                        type: 'Builds'
                    });
                });

            res.send(suggestions)
        });

        app.get('/check-directory', noCache, function( req, res ){

            var file = req.query.name;
            var dirPath = path.join( __dirname, source+'/'+file);

            var images = [],
                floorplan = '',
                connections = {};

            checkIfDirectoryExists( dirPath, function(){

                var sanityTests = require('./sanity.js');

                sanityTests.sanity1( res, dirPath, function(){
                   sanityTests.sanity2( res, dirPath, function() {
                       sanityTests.sanity3( res, dirPath, function( imagesArr ) {
                           images = imagesArr;
                           sanityTests.sanity4( res, dirPath, function( connectionsObj ) {
                               connections = connectionsObj;
                               sanityTests.sanity5( res, dirPath, function( floorfile ) {
                                   floorplan = floorfile;
                                   res.send({
                                       error: false,
                                       images: images,
                                       floorplan: floorplan,
                                       connections: connections,
                                       project: file
                                   })
                               });
                           });
                       });
                   })
                });

            }, function() {
                res.send({
                    error: true,
                    reason: 'exist'
                })
            });
        });

        //

        //HANDLE post request

        app.post('/generate-build', function( req, res ){

            if (!req.body) return res.sendStatus(400);
            var data = req.body.response;
            var connections = JSON.stringify(req.body.connections);

            var random = Math.round( Math.random()*100000000 );

            var projectName = data.project + '-' + random;

            data.projectName = projectName;

            fs.writeFile(path.join( __dirname, 'public/projects/'+data.project+'/connections.json'), connections, function (err) {
                if (err) throw err;
                fse.copy(path.join( __dirname, 'public/projects/'+data.project), path.join( __dirname, 'public/builds/'+projectName+'/proptiger'), function (err) {
                    if (err) return res.send({error: true});
                    fse.copy( path.join( __dirname, 'framework/'), path.join( __dirname, 'public/builds/'+projectName+'/' ), function( err ){
                        if (err) res.send({ error: true });
                        fse.copy(path.join( __dirname, 'public/builds/'+projectName+'/proptiger'), path.join( __dirname, 'public/builds/'+projectName+'/assets/proptiger'), function (err) {
                            if (err) return res.send({error: true});
                            fse.removeSync(path.join( __dirname, 'public/builds/'+projectName+'/proptiger'));
                            var dirty = generateXML( data );

                            var xml = pd.xml( dirty );

                            var global = 'var floorplan = "'+ data.floorplan +'"; var projectName = "'+ data.projectName +'"';

                            fs.writeFile(path.join( __dirname, 'public/builds/'+projectName+'/assets/proptiger/sphereProps.xml'), xml, function (err) {
                                if (err) res.send({ error: true });
                                fs.writeFile(path.join( __dirname, 'public/builds/'+projectName+'/js/services/globals.js'), global, function (err) {
                                    if (err) return res.send({error: true});

                                    res.send({
                                        error: false,
                                        projectName: projectName
                                    })
                                });
                            });
                        })
                    })
                });
            });

        });

        //Save XML
        app.post('/automatic-xml', function( req, res ){

            if (!req.body) return res.sendStatus(400);

            var projectName = req.body.projectName;
            var dirty = req.body.xml;

            var xml = pd.xml( dirty );

            fs.writeFile(path.join( __dirname, 'public/builds/'+projectName+'/assets/proptiger/sphereProps.xml'), xml, function (err) {
                if (err) throw err;
                if(  req.body.generate ) {

                    fse.copy( path.join( __dirname, 'codeBase/'), path.join( __dirname, 'public/beta/'+projectName+'/' ), function( err ) {
                        if (err) return res.send({error: true});
                        fse.copy(path.join( __dirname, 'public/builds/'+projectName+'/assets/proptiger/'), path.join( __dirname, 'public/beta/'+projectName+'/assets/proptiger'), function (err) {
                            if (err) return res.send({error: true});
                            res.send({
                                error: false
                            });
                        });
                    });

                } else {
                    res.send({
                        error: false
                    });
                }
            });

        });


    }
};