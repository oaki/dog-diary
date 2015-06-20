/* use strict */
app.factory('foodDataFactory', ['$http', 'dataFactory', function ($http, dataFactory) {
    var factory = angular.copy(dataFactory);

    factory.urlBase = factory.urlBase + "food";

    return factory;
}]);