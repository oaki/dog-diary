/* use strict */
app.controller('AddFoodCtrl', ['$scope', 'dataFoodFactory', '$location', function ($scope, dataFoodFactory, $location) {
        $scope.insertFood = function () {
            var food = {
                datetime: $scope.datetime,
                name: $scope.name,
                weight: $scope.weight,
                dufalact: $scope.dufalact
            };
            dataFoodFactory.insert(food)
                .success(function () {
                    $location.path('/');
                }).
                error(function (error) {
                    $scope.status = 'Unable to insert food: ' + error.message;
                });
        };
    }]);
