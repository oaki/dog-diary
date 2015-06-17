/* use strict */
app.factory('dataFactory', ['$http', function ($http) {

        var dataFactory = {
            'urlBase':''
        };

        dataFactory.getAll = function () {
            return $http.get(this.urlBase);
        };

        dataFactory.get = function (id) {
            return $http.get(this.urlBase + '/' + id);
        };

        dataFactory.insert = function (food) {
            return $http.post(this.urlBase, JSON.stringify(food));
        };

        dataFactory.update = function (cust) {
            return $http.put(this.urlBase + '/' + cust.ID, cust)
        };

        dataFactory.delete = function (id) {
            return $http.delete(this.urlBase + '/' + id);
        };

        return dataFactory;
    }]);
