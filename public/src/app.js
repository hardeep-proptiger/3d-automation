var contactsApp = angular.module('automationApp',[ 'ui.bootstrap', 'toaster', 'ui.select', 'ngSanitize' ]);
contactsApp.controller('MainController', ['$scope', '$http', 'toaster', '$modal', function( $scope, $http, toaster, $modal ){

	$scope.slide = false;

	$scope.getLocation = function(val) {
		return $http.get('/directory', {
			params: {
				name: val
			}
		}).then(function(response){
			return response.data;
		});
	};

	$scope.checkBeforeGeneration = function( ) {
		$scope.splash = true;
		return $http.get('/check-directory', {
			params: {
				name: $scope.asyncSelected.name.name
			}
		}).then(function( res ){
			if( res.data.error ) {

				switch( res.data.reason ) {
					case 'exist':
						toaster.pop( 'error', '', 'This project does not exist' );
						break;
					case 'sanity':
                        var found = !1;
                        var error = '';
						for( var i in res.data.sanity ) {
                            if( !found && !res.data.sanity[i] ) {
                                found = !0;
                                error = i;
                            }
						}
                        toaster.pop('error', error.toUpperCase()+' did not pass!', '', 10000, '', function(){  $scope.sanity( error ); });
						break;
					case 'connection':
						toaster.pop( 'error', '', 'This project does not exist' );
						break;
				}

				$scope.splash = false;

			} else {

                $scope.response = res.data;

                $scope.extension    = res.data.images[0].substr(res.data.images[0].lastIndexOf('.'));
				$scope.images       = res.data.images;
				$scope.connections  = res.data.connections;
				$scope.floorplan    = res.data.floorplan;
                $scope.project      = res.data.project;

                $scope.splash       = false;
				$scope.animateUp();
                $scope.setUpDropdownMenus();
                $scope.enhanceMenu();


			}
		});
	};

	$scope.generateData = function() {
        $scope.asyncSelected.name && $scope.asyncSelected.name.name && $scope.asyncSelected.name.name != ''?( $scope.checkBeforeGeneration() ): toaster.pop('error', '', 'Cannot leave directory empty');
};

	$scope.animateUp = function() {
		$scope.slide = !$scope.slide;
	};

    $scope.testing = function() {

        $scope.asyncSelected = $scope.project = {"name":{"name":"apartments","type":"Projects"}};
        $scope.checkBeforeGeneration();
    };

    //$scope.testing();

    $scope.open3d = function( url ) {

        $modal.open({
            templateUrl: 'views/modal.3d.html',
            windowClass: 'center-window-modal light-grey-modal',
            controller: ['$scope','url',function( $scope, url ){
                $scope.url = url;
            }],
            size: 'md',
            resolve: {
                url: [function() {
                    return url
                }]
            }
        });

    };

    $scope.openSource = function( $index ) {

        $scope.open3d( 'projects/'+$scope.project+'/midres/'+$index+'.jpg' );

    };

    $scope.openConnections = function() {
        $scope.open3d( 'projects/'+$scope.project+'/midres/'+$scope.connections[ this.$parent.$index ][ this.$index ]+'.jpg' );
    };

    $scope.generateBuild = function( ) {

        var error = !1;

        angular.forEach( $scope.connections, function( val ){
            if( val.length < 1 ) {
                error = !0;
            }
        });

        if( error ) {

            toaster.pop('error','','All spheres should have atleast 1 connection');

        } else {

            $scope.splash = true;
            return $http.post('/generate-build', {response: $scope.response, connections: $scope.connections  }).then(function (res) {
                if (res.data.error) {

                    $scope.splash = true;
                    toaster.pop('error', '', 'Some error occurred...');

                } else {

                    $scope.generated = true;

                    $modal.open({
                        templateUrl: 'views/modal.goTo.html',
                        windowClass: 'center-window-modal light-grey-modal',
                        controller: ['$scope', 'href', function ($scope, href) {
                            $scope.href = 'http://localhost:7000/builds/' + href;
                        }],
                        backdrop: 'static',
                        size: 'md',
                        resolve: {
                            href: [function () {
                                return res.data.projectName
                            }]
                        }
                    });


                }
            });
        }
    };

    $scope.asyncSelected = $scope.project = {};

    $scope.projects = [];

    $scope.getDirectories = function() {
        return $http.get('/all-directory').then(function(response){
            $scope.projects = response.data;
        });
    };

    $scope.getDirectories();

    $scope.sanity = function( san ) {
        $modal.open({
            templateUrl: 'views/modal.sanity.html',
            windowClass: 'light-grey-modal',
            controller: ['$scope','sanity',function( $scope, sanity ){
               $scope.sanity = {
                   sanity1: false,
                   sanity2: false,
                   sanity3: false,
                   sanity4: false,
                   sanity5: false,
                   sanity6: false
               };

               $scope.sanity[ sanity ] = true;
            }],
            size: 'md',
            resolve: {
                sanity: [function() {
                    return san
                }]
            }
        });
    };

    /**
     * Dropdown functionality
     */

    $scope.setUpDropdownMenus = function() {

        $scope.dropdownMenu = [];
        var length = $scope.images.length;
        var tempArr = [];
        for( var i=0; i<length; i++ ) {
            tempArr.push(i);
        }
        $scope.images.forEach(function(){
           $scope.dropdownMenu.push( JSON.parse( JSON.stringify( tempArr ) ) );
        });
    };

    $scope.enhanceMenu = function() {

        $scope.setUpDropdownMenus();

        angular.forEach( $scope.connections, function( connectionsArr, ind ){

             $scope.removeFromMenu( ind, connectionsArr );

        });

    };

    $scope.removeFromMenu = function( ind, connectionsArr ) {

        $scope.dropdownMenu[ind].splice( ind, 1 );
         angular.forEach(connectionsArr, function( val ){
                var index = $scope.dropdownMenu[ ind ].indexOf( val );
                if( index != -1 ) {
                    $scope.dropdownMenu[ind].splice( index, 1 );
                }
         });

    };

    $scope.menuClick = function( $event, $index ) {
        $event.stopPropagation();
        var index = this.$parent.$index;
        var value = $scope.dropdownMenu[index][$index];

        $scope.connections[index].push( value );
        $scope.connections[value].push( index );


        $scope.enhanceMenu();
    };

    $scope.deleteConnection = function( $event, $index ) {
        $event.stopPropagation();
        var index = this.$parent.$index;
        var value = $scope.connections[index][$index];

        $scope.connections[index].splice( $index, 1 );
        $scope.connections[value].splice( $scope.getConnectionIndex( value, index ), 1 );

        $scope.enhanceMenu();
    };

    $scope.getConnectionIndex = function( ind1, value ) {
       return $scope.connections[ind1].indexOf(value);
    };

}]);