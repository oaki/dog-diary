/* use strict */
app.controller('AddPoopCtrl', ['$scope', 'dataFactory', '$location', function ($scope, dataFactory, $location) {
        $scope.insertPoop = function () {
            var Poop = {
                datetime: $scope.datetime,
                consistency: $scope.consistency,
                size: $scope.size
            };
            
            dataFoodFactory.urlBase = 'http://dogdiary.bincik.sk/api/poop';

            dataFactory.insert(Poop)
                .success(function () {
                    $location.path('/');
                }).
                error(function (error) {
                    $scope.status = 'Unable to insert Poop: ' + error.message;
                });
        };
    }]);
