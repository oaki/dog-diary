/* use strict */
app.controller('AddFoodCtrl', ['$scope', 'dataFoodFactory', function ($scope, dataFoodFactory) {
        $scope.foods = {};

        $scope.insertFood = function () {
            var food = {
                datetime: $scope.datetime,
                name: $scope.name,
                weight: $scope.weight,
                dufalact: $scope.dufalact
            };
            dataFoodFactory.insert(food)
                .success(function () {
                    $scope.status = 'Inserted Customer! Refreshing customer list.';
                    $scope.foods.push(food);
                }).
                error(function (error) {
                    $scope.status = 'Unable to insert customer: ' + error.message;
                });
        };
    }]);
