/* use strict */
app.controller('MainCtrl', ['$scope', 'dataFactory', function ($scope, dataFactory) {
    $scope.foods = {};

    $scope.getFood = function () {
        dataFactory.urlBase = 'http://dogdiary.bincik.sk/api/food';
        dataFactory.getAll()
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