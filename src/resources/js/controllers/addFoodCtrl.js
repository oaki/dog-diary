/* use strict */
app.controller('AddFoodCtrl', ['$scope', 'dataFoodFactory', function ($scope, dataFoodFactory) {
        $scope.foods = {};
/**/
        $scope.insertFood = function () {
            //Fake customer data
            var food = {
                date: $scope.date
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
