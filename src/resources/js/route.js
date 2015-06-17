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