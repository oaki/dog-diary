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
app.controller('MainCtrl', ['$scope', 'dataFoodFactory', function ($scope, dataFoodFactory) {
    $scope.foods = {};

    $scope.getFood = function () {
        dataFoodFactory.getAll()
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
app.factory('dataFoodFactory', ['$http', function ($http) {
        var urlBase = 'http://dogdiary.bincik.sk/api/food';
        var dataFactory = {};

        dataFactory.getAll = function () {
            return $http.get(urlBase);
        };

        dataFactory.get = function (id) {
            return $http.get(urlBase + '/' + id);
        };

        dataFactory.insert = function (food) {
            return $http.post(urlBase, JSON.stringify(food));
        };

        dataFactory.update = function (cust) {
            return $http.put(urlBase + '/' + cust.ID, cust)
        };

        dataFactory.delete = function (id) {
            return $http.delete(urlBase + '/' + id);
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
        .otherwise({
            template: '<h1>404</h1>'
        })
});