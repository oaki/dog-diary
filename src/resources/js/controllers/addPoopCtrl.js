/* use strict */
app.controller('AddPoopCtrl', ['$scope', 'dataFactory', '$location', function ($scope, dataFactory, $location) {
    $scope.datetime = new Date();
    $scope.insertPoop = function () {
        var Poop = {
            datetime: $scope.datetime,
            consistency: $scope.consistency,
            size: $scope.size
        };

        dataFactory.urlBase = 'http://dogdiary.bincik.sk/server/api/poop';

        dataFactory.insert(Poop)
            .success(function () {
                $location.path('/');
            }).
            error(function (error) {
                $scope.status = 'Unable to insert Poop: ' + error.message;
            });
    };
}]);
