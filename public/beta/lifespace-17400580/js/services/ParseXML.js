function parseSphereProps( strStoragePath, urlSDataFile) {
    var returnObj = {};
    $.ajax({
        type: "GET",
        url: urlSDataFile,
        dataType: "xml",
        async: !1,
        success: function(response) {

            var Url3DModel = response.getElementsByTagName("Url3DModel")[0],
                Url3DModel = strStoragePath + (Url3DModel ? Url3DModel.childNodes[0].nodeValue : ""),
                NoOfSpheres = response.getElementsByTagName("NoOfSpheres")[0],
                NoOfSpheres = parseInt(NoOfSpheres ? NoOfSpheres.childNodes[0].nodeValue : 0),
                StartNode = response.getElementsByTagName("StartNode")[0],
                StartNode = parseInt(StartNode ? StartNode.childNodes[0].nodeValue : 0),
                StartOrientation = response.getElementsByTagName("StartOrientation")[0],
                StartOrientation = parseFloat(StartOrientation ? StartOrientation.childNodes[0].nodeValue : 0),
                latitude = response.getElementsByTagName("latitude")[0],
                latitude = parseFloat(latitude ? latitude.childNodes[0].nodeValue : 0),
                TripodHeight = response.getElementsByTagName("TripodHeight")[0],
                TripodHeight = parseFloat(TripodHeight ? TripodHeight.childNodes[0].nodeValue : 150),

                SphereID = response.getElementsByTagName("SphereID"),
                ImagePath = response.getElementsByTagName("ImagePath"),
                MImagePath = response.getElementsByTagName("MImagePath"),
                LImagePath = response.getElementsByTagName("LImagePath"),
                CenterX = response.getElementsByTagName("CenterX"),
                CenterY = response.getElementsByTagName("CenterY"),
                CenterZ = response.getElementsByTagName("CenterZ"),
                Radius = response.getElementsByTagName("Radius"),
                RotationX = response.getElementsByTagName("RotationX"),
                RotationY = response.getElementsByTagName("RotationY"),
                RotationZ = response.getElementsByTagName("RotationZ"),
                Connections = response.getElementsByTagName("Connections");

            for (var aaConnectionGraph = [], aPanoSpheres = [], i = 0; i < NoOfSpheres; i++) {
                var sphereInfo = {};
                sphereInfo.nSphereId = SphereID[i] ? parseInt(SphereID[i].childNodes[0].nodeValue) : 0;
                sphereInfo.urlSphereTex = strStoragePath + (ImagePath[i] ? ImagePath[i].childNodes[0].nodeValue : "");
                sphereInfo.urlMSphereTex = strStoragePath + (MImagePath[i] ? MImagePath[i].childNodes[0].nodeValue : "");
                sphereInfo.urlLSphereTex = strStoragePath + (LImagePath[i] ? LImagePath[i].childNodes[0].nodeValue : "");
                sphereInfo.center = new THREE.Vector3(parseFloat(CenterX[i] ? CenterX[i].childNodes[0].nodeValue : 0), parseFloat(CenterY[i] ? CenterY[i].childNodes[0].nodeValue : 0), parseFloat(CenterZ[i] ? CenterZ[i].childNodes[0].nodeValue : 0));
                sphereInfo.rRadius = Radius[i] ? Radius[i].childNodes[0].nodeValue : 25;
                sphereInfo.rotation = new THREE.Euler(THREE.Math.degToRad(parseFloat(RotationX[i] ? RotationX[i].childNodes[0].nodeValue : 0)), THREE.Math.degToRad(parseFloat(RotationY[i] ? RotationY[i].childNodes[0].nodeValue : 0)), THREE.Math.degToRad(parseFloat(RotationZ[i] ? RotationZ[i].childNodes[0].nodeValue : 0)), "XYZ");

                l_cPanosphere = new CPanosphere;
                l_cPanosphere.initialize(sphereInfo);

                aPanoSpheres[sphereInfo.nSphereId] = l_cPanosphere;
                aaConnectionGraph[sphereInfo.nSphereId] = Connections[i] && Connections[i].childNodes[0] && "" !== Connections[i].childNodes[0].nodeValue.trim() ? Connections[i].childNodes[0].nodeValue.trim().split(" ").map(Number) : []
            }

            returnObj.url3DModel = Url3DModel;
            returnObj.nNumNodes = NoOfSpheres;
            returnObj.aaConnectionGraph = aaConnectionGraph;
            returnObj.aPanoSpheres = aPanoSpheres;
            returnObj.nStartNode = StartNode;
            returnObj.rStartOrientation = StartOrientation;
            returnObj.rTripodHeight = TripodHeight;
            returnObj.latitude = latitude;

        }
    });
    return returnObj
}

function parseGalaxyProps( strStoragePath, urlGDataFile) {
    var c = {};
    if (!g_cSystemSpecs.fUseGalaxy) return c;
    $.ajax({
        type: "GET",
        url: urlGDataFile,
        dataType: "xml",
        async: !1,
        success: function(a) {
            var b = a.getElementsByTagName("NoOfGalaxies")[0],
                b = parseInt(b ? b.childNodes[0].nodeValue : 0),
                g = a.getElementsByTagName("GalaxyID"),
                f = a.getElementsByTagName("ParentID"),
                k = a.getElementsByTagName("Children"),
                r = a.getElementsByTagName("Spheres"),
                p = a.getElementsByTagName("StartGalaxy"),
                A = a.getElementsByTagName("StartSphere"),
                B = a.getElementsByTagName("StartOrientation"),
                u = a.getElementsByTagName("Title"),
                x = a.getElementsByTagName("Description"),
                C = a.getElementsByTagName("TagValueCount");
            a = a.getElementsByTagName("TagValues");
            for (var y = [], h = 0; h < b; h++) {
                var l = {};
                l.nGalaxyId = g[h] ? parseInt(g[h].childNodes[0].nodeValue) : 0;
                l.nParentId = f[h] ? parseInt(f[h].childNodes[0].nodeValue) : 0;
                l.aiChildren = k[h] && k[h].childNodes[0] && "" !== k[h].childNodes[0].nodeValue.trim() ? k[h].childNodes[0].nodeValue.trim().split(" ").map(Number) : [];
                l.aiSpheres = r[h] && r[h].childNodes[0] && "" !== r[h].childNodes[0].nodeValue.trim() ?
                    r[h].childNodes[0].nodeValue.trim().split(" ").map(Number) : [];
                l.nStartGalaxy = p[h] ? parseInt(p[h].childNodes[0].nodeValue) : 0;
                l.nStartSphere = A[h] ? parseInt(A[h].childNodes[0].nodeValue) : 0;
                l.rStartOrientation = B[h] ? parseFloat(B[h].childNodes[0].nodeValue) : 0;
                l.strTitle = u[h] ? u[h].childNodes[0].nodeValue.replace(/\"/g, "") : "";
                l.strDescription = x[h] ? x[h].childNodes[0].nodeValue.replace(/\"/g, "") : "";
                l.nTagValueCount = C[h] ? parseInt(C[h].childNodes[0].nodeValue) : 0;
                l.aTags = {};
                for (var t = 1; t <= l.nTagValueCount; t++) {
                    var z = 1 + 2 * (t - 1),
                        n = a[h] && a[h].childNodes[z] ? a[h].childNodes[z].childNodes[0].childNodes[0].nodeValue.replace(/\"/g, "") : "",
                        z = a[h] && a[h].childNodes[z] ? a[h].childNodes[z].childNodes[2].childNodes[0].nodeValue.replace(/\"/g, "") : "";
                    l.aTags[n] = z
                }
                t = new CPanogalaxy;
                t.initialize(l);
                y[l.nGalaxyId] = t
            }
            c.aPanoGalaxies = y;
            c.nNumGalaxies = b
        },
        error: function() {
            g_cSystemSpecs.fUseGalaxy = !1
        }
    });
    return c
};