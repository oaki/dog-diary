/* use strict */
var app = angular.module('DogDiaryApp', ['ngRoute']);

app.controller('MainCtrl', function($scope){
   $scope.message = 'palo';
});

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
            template: '<h1>page 3</h1>'
        })
        .otherwise({
            template: '<h1>404</h1>'
        })
});
//
//app.controller('CalendarCtrl', function($scope, $routeParams){
//    $scope.model = {
//        message: "Date: " + $routeParams.month + " / " + $routeParams.day + " / " + $routeParams.year
//    };
//})