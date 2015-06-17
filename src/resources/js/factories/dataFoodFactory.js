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