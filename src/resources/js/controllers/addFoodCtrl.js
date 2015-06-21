/* use strict */
app.controller('AddFoodCtrl', ['$scope', 'foodDataFactory', '$location', function ($scope, foodDataFactory, $location) {
    $scope.datetime = new Date();
    $scope.weight = 40;
    $scope.dufalact = 5;
    $scope.insertFood = function () {
        var food = {
            datetime: $scope.datetime,
            name: $scope.name,
            weight: $scope.weight,
            dufalact: $scope.dufalact
        };

        foodDataFactory.insert(food)
            .success(function () {
                $location.path('/');
            }).
            error(function (error) {
                $scope.status = 'Unable to insert food: ' + error.message;
            });
    };
}]);
