/* use strict */
var app = angular.module('DogDiaryApp', ['ngRoute']);

/* use strict */
app.controller('AddFoodCtrl', ['$scope', 'dataFoodFactory', function ($scope, dataFoodFactory) {
        $scope.foods = {};

        $scope.insertFood = function () {
            //Fake customer data
            var food = {
                date: $scope.date
            };
            dataFoodFactory.insert(food)
                .success(function () {
                    $scope.status = 'Inserted Customer! Refreshing customer list.';
                    $scope.foods.push(food);
                }).
                error(function (error) {
                    $scope.status = 'Unable to insert customer: ' + error.message;
                });
        };
    }]);


/* use strict */
app.controller('MainCtrl', ['$scope', function ($scope) {

    }]);

/* use strict */
app.factory('dataFoodFactory', ['$http', function ($http) {
        var urlBase = '/api/foods';
        var dataFactory = {};

        dataFactory.getAll = function () {
            return $http.get(urlBase);
        };

        dataFactory.get = function (id) {
            return $http.get(urlBase + '/' + id);
        };

        dataFactory.insert = function (food) {
            return $http.post(urlBase, food);
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
        .when('/addMessage', {
            templateUrl: 'partials/addFood.html',
            controller: "AddFoodCtrl"
        })
        .otherwise({
            template: '<h1>404</h1>'
        })
});