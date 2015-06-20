/* use strict */
app.factory('poopDataFactory', ['$http', 'dataFactory', function ($http, dataFactory) {
    var factory = angular.copy(dataFactory);

    factory.urlBase = factory.urlBase + "poop";

    return factory;
}]);