/* use strict */
var app = angular.module('MyApp', ['ngRoute']);
app.controller('MainController', function ($scope) {
    $scope.labelName = "New Button";
    $scope.mainPageMessage = '<h2>Im a new page</h2>';
    $scope.newElement = angular.element('<div class="btn btn-default">' + $scope.labelName + '</div>');
});

app.controller('MainCtrl', function($scope){
   $scope.message = 'palo';
});

app.config(function ($routeProvider) {

    $routeProvider.when('/', {
        templateUrl: 'partials/sample.html',
        controller: "MainController"
    })
        .when('/calendar/:month/:day/:year',{
            templateUrl: "partials/calendar.html",
            controller: "CalendarCtrl"
        })
    .when('/pageTwo', {
            template: '<h1>page 3</h1>'
        })
        .otherwise({
            template: '<h1>404</h1>'
        })
});

app.controller('CalendarCtrl', function($scope, $routeParams){
    $scope.model = {
        message: "Date: " + $routeParams.month + " / " + $routeParams.day + " / " + $routeParams.year
    };
})