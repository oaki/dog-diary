/* use strict */
var app = angular.module('DogDiaryApp',
    [
        'ngRoute',
        'chart.js',
        'uiGmapgoogle-maps',
        'geolocation',
        'angular-loading-bar',
        'ngFileUpload',
        'ui.bootstrap.datetimepicker'
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
app.controller('AddPoopCtrl', ['$scope', 'dataFactory', '$location', 'Upload', function ($scope, dataFactory, $location, Upload) {
    $scope.datetime = new Date();
    $scope.consistency = 5;
    $scope.size = 5;
    $scope.latitude = 0;
    $scope.longitude = 0;
    $scope.fileId = 0;

    $scope.insertPoop = function () {
        var Poop = {
            datetime: $scope.datetime,
            consistency: $scope.consistency,
            size: $scope.size,
            latitude: $scope.latitude,
            longitude: $scope.longitude,
            fileId: $scope.fileId
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


    $scope.$watch('files', function () {
        console.log($scope);
        $scope.upload($scope.files);
    });

    $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: 'http://dogdiary.bincik.sk/server/upload-file/',
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    console.log(data);
                    $scope.fileId = data.id;
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                });
            }
        }
    };
}]);


/* use strict */
app.controller('MainCtrl', [
    '$scope',
    'foodDataFactory',
    'poopDataFactory',
    'chartService',
    '$q',
    function ($scope, foodDataFactory, poopDataFactory, chartService, $q) {
        var ctrl = this;

        $scope.series = [
            'Food weight',
            'Dufalact',
            'Poop'
        ];

        ctrl.attributesFood = {
            0: "weight",
            1: "dufalact"
        };

        ctrl.attributesPoop = {
            2: "size"
        };

        ctrl.dataMappingFood = {};
        ctrl.dataMappingPoop = {};

        $scope.$watch('days', function () {
            $scope.labels = [];
            $scope.data = [
                [],
                [],
                []
            ];

            $scope.labels = chartService.getDayRange($scope.days);

            chartService.setValuesToChart(
                ctrl.dataMappingFood,
                ctrl.attributesFood,
                $scope.labels,
                $scope.data
            );
            chartService.setValuesToChart(
                ctrl.dataMappingPoop,
                ctrl.attributesPoop,
                $scope.labels,
                $scope.data
            );
        });

        ctrl.getData = function () {
            $q.all(
                    [
                        poopDataFactory.getAll(),
                        foodDataFactory.getAll()
                    ]
                ).then(function (response) {
                    ctrl.dataMappingPoop = chartService.getDataForChart(
                        response[0].data.poops,
                        ctrl.attributesPoop
                    );
                    ctrl.dataMappingFood = chartService.getDataForChart(
                        response[1].data.foods,
                        ctrl.attributesFood
                    );
                    $scope.days = 5;
                });
        };

        ctrl.getData();
    }]);

app.directive('dateTimePicker', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            recipient: '='
        },
        template:
        '<div>' +
        '<input type="text" readonly data-date-format="yyyy-mm-dd hh:ii" name="recipientDateTime" data-date-time required>'+
        '</div>',
        link: function(scope, element, attrs, ngModel) {
            var input = element.find('input');

            input.datetimepicker({
                format: "mm/dd/yyyy hh:ii",
                showMeridian: true,
                autoclose: true,
                todayBtn: true,
                todayHighlight: true
            });

            element.bind('blur keyup change', function(){
                scope.recipient.datetime = input.val();
            });
        }
    }
});

/* use strict */
app.factory('dataFactory', ['$http', function ($http) {

        var dataFactory = {
            'urlBase':'http://dogdiary.bincik.sk/server/api/'
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
app.factory('foodDataFactory', ['$http', 'dataFactory', function ($http, dataFactory) {
    var factory = angular.copy(dataFactory);

    factory.urlBase = factory.urlBase + "food";

    return factory;
}]);

/* use strict */
app.factory('poopDataFactory', ['$http', 'dataFactory', function ($http, dataFactory) {
    var factory = angular.copy(dataFactory);

    factory.urlBase = factory.urlBase + "poop";

    return factory;
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

/* use strict */
app.service('chartService', [function () {
    var service = this;

    service.dateToYMD = function (date) {
        var d = date.getDate();
        var m = date.getMonth() + 1;
        var y = date.getFullYear();
        return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
    };

    service.getDayRange = function (day) {
        var labels = [];

        for (var i = 0; i < day; i++) {
            var dateObj = new Date();
            dateObj.setDate(dateObj.getDate() - i);
            labels.push(service.dateToYMD(dateObj));
        }

        return labels;
    };

    service.setDataWithDate = function (data) {
        angular.forEach(data, function (value) {
            var date = value.datetime.date;
            if (date !== undefined) {
                value.datetime.date = date.split(" ")[0];
            }
        });
    };

    service.getMapValuesToDate = function (data, attributes) {
        var dataMapping = {};

        angular.forEach(data, function (value) {
            var date = value.datetime.date;
            if (dataMapping[date] === undefined) {
                dataMapping[date] = {};
                angular.forEach(attributes, function (attribute) {
                    dataMapping[date][attribute] = value[attribute];
                });
            } else {
                angular.forEach(attributes, function (attribute) {
                    dataMapping[date][attribute] += value[attribute];
                });
            }
        });

        return dataMapping;
    };

    service.setValuesToChart = function (dataMapping, attributes, labels, data) {
        for (var i = 0; i < labels.length; i++) {
            if (typeof dataMapping[labels[i]] === 'undefined') {
                angular.forEach(attributes, function (attribute, key) {
                    data[key].push(0);
                });
            } else {
                angular.forEach(attributes, function (attribute, key) {
                    data[key].push(dataMapping[labels[i]][attribute]);
                });
            }
        }
    };

    service.getDataForChart = function (data, attributes) {
        //set date to usable format
        service.setDataWithDate(data);

        //map values to date
        return service.getMapValuesToDate(data, attributes);
    };

}]);