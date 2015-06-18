/* use strict */
app.controller('AddFoodCtrl', ['$scope', 'dataFactory', '$location', function ($scope, dataFactory, $location) {
    $scope.datetime = new Date();
    $scope.insertFood = function () {
        var food = {
            datetime: $scope.datetime,
            name: $scope.name,
            weight: $scope.weight,
            dufalact: $scope.dufalact
        };

        dataFactory.urlBase = 'http://dogdiary.bincik.sk/server/api/food';
        dataFactory.insert(food)
            .success(function () {
                $location.path('/');
            }).
            error(function (error) {
                $scope.status = 'Unable to insert food: ' + error.message;
            });
    };
}]);
