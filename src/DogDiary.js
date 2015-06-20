/* use strict */
var app = angular.module('DogDiaryApp',
    [
        'ngRoute',
        'chart.js',
        'uiGmapgoogle-maps',
        'geolocation'
    ]);

/* use strict */
app.config(function (uiGmapGoogleMapApiProvider) {

    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
});

app.controller("ChartCtrl", function ($scope) {

});

app.controller("GeoPositionCtrl", function ($scope, uiGmapGoogleMapApi, geolocation, $log) {

    geolocation.getLocation().then(function(data){
        uiGmapGoogleMapApi.then(function (maps) {
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

/* use strict */
app.controller('AddFoodCtrl', ['$scope', 'dataFactory', '$location', function ($scope, dataFactory, $location) {
    $scope.datetime = new Date();
    $scope.weight = 40;
    $scope.dufalact = 5;
    $scope.insertFood = function () {
        var food = {
            datetime: $scope.datetime,
            name: $scope.name,
            weight: $scope.weight,
            dufalact: $scope.dufalact
        };

        dataFactory.urlBase = 'http://dogdiary.bincik.sk/server/api/food';
        dataFactory.insert(food)
            .success(function () {
                $location.path('/');
            }).
            error(function (error) {
                $scope.status = 'Unable to insert food: ' + error.message;
            });
    };
}]);


/* use strict */
app.controller('AddPoopCtrl', ['$scope', 'dataFactory', '$location', function ($scope, dataFactory, $location) {
    $scope.datetime = new Date();
    $scope.consistency = 5;
    $scope.size = 5;

    $scope.insertPoop = function () {
        var Poop = {
            datetime: $scope.datetime,
            consistency: $scope.consistency,
            size: $scope.size
        };

        dataFactory.urlBase = 'http://dogdiary.bincik.sk/server/api/poop';

        dataFactory.insert(Poop)
            .success(function () {
                $location.path('/');
            }).
            error(function (error) {
                $scope.status = 'Unable to insert Poop: ' + error.message;
            });
    };
}]);


/* use strict */
app.controller('MainCtrl', ['$scope', 'dataFactory', function ($scope, dataFactory) {
    var ctrl = this;

    $scope.labels = [];
    $scope.series = [
        'Food weight',
        'Dufalact',
        'Poop'
    ];
    $scope.data = [
        [],
        [],
        []
    ];

    ctrl.dateToYMD = function(date) {
        var d = date.getDate();
        var m = date.getMonth() + 1;
        var y = date.getFullYear();
        return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
    };

    ctrl.generateDayRange = function (day) {
        for(var i = 0; i < day; i++){
            var dateObj = new Date();
            dateObj.setDate(dateObj.getDate()-i);
            $scope.labels.push(ctrl.dateToYMD(dateObj));
        }
    };

    ctrl.generateDayRange(10);

    ctrl.setDataWithDate = function (data) {
        angular.forEach(data, function(value) {
            var date = value.datetime.date;
            if(date !== undefined){
                value.datetime.date = date.split(" ")[0];
            }
        });
    };

    ctrl.getMapValuesToDate = function (data, attributes) {
        var dataMapping = {};

        angular.forEach(data, function(value) {
            var date = value.datetime.date;
            if(dataMapping[date] === undefined){
                dataMapping[date] = {};
                angular.forEach(attributes, function(attribute){
                    dataMapping[date][attribute] = value[attribute];
                });
            } else {
                angular.forEach(attributes, function(attribute){
                    dataMapping[date][attribute] += value[attribute];
                });
            }
        });

        return dataMapping;
    };

    ctrl.setValuesToChart = function (dataMapping, attributes) {
        for(var i = 0; i < $scope.labels.length; i++){
            if(dataMapping[$scope.labels[i]] === undefined){
                angular.forEach(attributes, function(attribute, key){
                    $scope.data[key].push(0);
                });
            } else {
                angular.forEach(attributes, function(attribute, key){
                    $scope.data[key].push(dataMapping[$scope.labels[i]][attribute]);
                });
            }
        }
    };

    ctrl.processData = function (data, attributes) {
        //set date to usable format
        ctrl.setDataWithDate(data);

        //map values to date
        var dataMapping = ctrl.getMapValuesToDate(data, attributes);

        //set values to chart
        ctrl.setValuesToChart(dataMapping, attributes);
    };

    ctrl.processFoodData = function (data) {
        //define attributes for chart
        var attributes = {
            0 : "weight",
            1 : "dufalact"
        };

        ctrl.processData(data, attributes);
    };

    ctrl.processPoopData = function (data) {
        //define attributes for chart
        var attributes = {
            2 : "size"
        };

        ctrl.processData(data, attributes);
    };

    ctrl.getFood = function () {
        dataFactory.urlBase = 'http://dogdiary.bincik.sk/server/api/food';
        dataFactory.getAll()
            .success(function (data) {
                ctrl.processFoodData(data.foods);
            }).
            error(function (error) {
                $scope.status = 'Unable to get foods: ' + error.message;
            });
    };

    ctrl.getPoop = function () {
        dataFactory.urlBase = 'http://dogdiary.bincik.sk/server/api/poop';
        dataFactory.getAll()
            .success(function (data) {
                ctrl.processPoopData(data.poops);
            }).
            error(function (error) {
                $scope.status = 'Unable to get poops: ' + error.message;
            });
    };

    ctrl.getFood();
    ctrl.getPoop();

}]);

/* use strict */
app.factory('dataFactory', ['$http', function ($http) {

        var dataFactory = {
            'urlBase':''
        };

        dataFactory.getAll = function () {
            return $http.get(this.urlBase);
        };

        dataFactory.get = function (id) {
            return $http.get(this.urlBase + '/' + id);
        };

        dataFactory.insert = function (food) {
            return $http.post(this.urlBase, JSON.stringify(food));
        };

        dataFactory.update = function (cust) {
            return $http.put(this.urlBase + '/' + cust.ID, cust)
        };

        dataFactory.delete = function (id) {
            return $http.delete(this.urlBase + '/' + id);
        };

        return dataFactory;
    }]);


/* use strict */
app.config(function ($routeProvider) {

    $routeProvider.when('/', {
        templateUrl: 'partials/home.html',
        controller: "MainCtrl"
    })
        //.when('/calendar/:month/:day/:year',{
        //    templateUrl: "partials/calendar.html",
        //    controller: "CalendarCtrl"
        //})
        .when('/addFood', {
            templateUrl: 'partials/addFood.html',
            controller: "AddFoodCtrl"
        })
        .when('/addPoop', {
            templateUrl: 'partials/addPoop.html',
            controller: "AddPoopCtrl"
        })
        .when('/chart', {
            templateUrl: 'partials/chart.html',
            controller: "ChartCtrl"
        })
        .otherwise({
            template: '<h1>404</h1>'
        })
});