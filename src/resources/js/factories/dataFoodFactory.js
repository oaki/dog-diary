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
