/* use strict */
var app = angular.module('DogDiaryApp', ['ngRoute']);

/* use strict */
app.controller('AddFoodCtrl', ['$scope', 'dataFoodFactory', '$location', function ($scope, dataFoodFactory, $location) {
        $scope.insertFood = function () {
            var food = {
                datetime: $scope.datetime,
                name: $scope.name,
                weight: $scope.weight,
                dufalact: $scope.dufalact
            };

            dataFoodFactory.urlBase = 'http://dogdiary.bincik.sk/api/food';
            dataFoodFactory.insert(food)
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
        .otherwise({
            template: '<h1>404</h1>'
        })
});