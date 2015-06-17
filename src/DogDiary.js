/* use strict */
var app = angular.module('DogDiaryApp', ['ngRoute','chart.js']);

app.controller("ChartCtrl", function ($scope) {
    $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    $scope.series = ['Series A', 'Series B'];

    $scope.data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];
});

/* use strict */
app.controller('AddFoodCtrl', ['$scope', 'dataFactory', '$location', function ($scope, dataFactory, $location) {
    $scope.datetime = new Date();
    $scope.insertFood = function () {
        var food = {
            datetime: $scope.datetime,
            name: $scope.name,
            weight: $scope.weight,
            dufalact: $scope.dufalact
        };

        dataFactory.urlBase = 'http://dogdiary.bincik.sk/api/food';
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
    $scope.insertPoop = function () {
        var Poop = {
            datetime: $scope.datetime,
            consistency: $scope.consistency,
            size: $scope.size
        };

        dataFoodFactory.urlBase = 'http://dogdiary.bincik.sk/api/poop';

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
    $scope.foods = {};

    $scope.getFood = function () {
        dataFactory.urlBase = 'http://dogdiary.bincik.sk/api/food';
        dataFactory.getAll()
            .success(function (data) {
                console.log(data);
                $scope.foods = data.foods;
            }).
            error(function (error) {
                $scope.status = 'Unable to get foods: ' + error.message;
            });
    };

    $scope.getFood();

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