/* use strict */
app.controller('MainCtrl', ['$scope', 'dataFoodFactory', function ($scope, dataFoodFactory) {
    $scope.foods = {};

    $scope.getFood = function () {
        dataFoodFactory.getAll()
            .success(function (data) {
                console.log(data);
                $scope.foods = data.foods;
            }).
            error(function (error) {
                $scope.status = 'Unable to get foods: ' + error.message;
            });
    };

    $scope.getFood();

}]);