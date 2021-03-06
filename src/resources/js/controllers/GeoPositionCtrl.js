app.controller("GeoPositionCtrl", function ($scope, uiGmapGoogleMapApi, geolocation, $log) {

    geolocation.getLocation().then(function(data){
        uiGmapGoogleMapApi.then(function (maps) {

            $scope.$parent.latitude = data.coords.latitude;
            $scope.$parent.longitude = data.coords.longitude;
            $log.debug(maps);
            $scope.map = {
                center: {
                    latitude: data.coords.latitude, longitude: data.coords.longitude
                }, zoom: 18};

            $scope.marker = {
                id: 0,
                coords: {
                    latitude: data.coords.latitude,
                    longitude: data.coords.longitude
                },
                options: { draggable: true },
                events: {
                    dragend: function (marker, eventName, args) {
                        $log.log('marker dragend');
                        var lat = marker.getPosition().lat();
                        var lon = marker.getPosition().lng();
                        $log.log(lat);
                        $log.log(lon);
                        $scope.$parent.latitude = $scope.marker.coords.latitude;
                        $scope.$parent.longitude = $scope.marker.coords.longitude;
                        $scope.marker.options = {
                            draggable: true,
                            labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
                            labelAnchor: "100 0",
                            labelClass: "marker-labels"
                        };
                    }
                }
            };
        });
    });


});