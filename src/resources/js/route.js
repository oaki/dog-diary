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