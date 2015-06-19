/* use strict */
app.controller('MainCtrl', ['$scope', 'dataFactory', function ($scope, dataFactory) {
    var ctrl = this;

    $scope.foods = {};

    $scope.labels = [];
    $scope.series = [
        'Series A',
        'Series B'
    ];
    $scope.data = [
        [],
        []
    ];

    ctrl.dateToYMD = function(date) {
        var d = date.getDate();
        var m = date.getMonth() + 1;
        var y = date.getFullYear();
        return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
    };

    ctrl.generateDayRange = function (day) {
        for(var i = 0; i < day; i++){
            var dateObj = new Date();
            dateObj.setDate(dateObj.getDate()-i);
            $scope.labels.push(ctrl.dateToYMD(dateObj));
        }
    };

    ctrl.generateDayRange(10);

    ctrl.processFoodData = function (data) {
        //set date to usable format
        angular.forEach(data, function(value) {
            var date = value.datetime.date;
            if(date !== undefined){
                value.datetime.date = date.split(" ")[0];
            }
        });

        //map date with values of weight and dufalact
        var dataMappingFood = {};

        angular.forEach(data, function(value) {
            var date = value.datetime.date;
            if(dataMappingFood[date] === undefined){
                dataMappingFood[date] = {
                    "weight": value.weight,
                    "dufalact": value.dufalact
                }
            } else {
                dataMappingFood[date]["weight"] += value.weight;
                dataMappingFood[date]["dufalact"] += value.dufalact;
            }
        });

        //set values to chart
        for(var i = 0; i < $scope.labels.length; i++){
            if(dataMappingFood[$scope.labels[i]] === undefined){
                $scope.data[0].push(0);
                $scope.data[1].push(0);
            } else {
                $scope.data[0].push(dataMappingFood[$scope.labels[i]]["weight"]);
                $scope.data[1].push(dataMappingFood[$scope.labels[i]]["dufalact"]);
            }
        }
    };

    ctrl.getFood = function () {
        dataFactory.urlBase = 'http://dogdiary.bincik.sk/server/api/food';
        dataFactory.getAll()
            .success(function (data) {
                ctrl.processFoodData(data.foods);
            }).
            error(function (error) {
                $scope.status = 'Unable to get foods: ' + error.message;
            });
    };

    ctrl.getPoop = function () {
        dataFactory.urlBase = 'http://dogdiary.bincik.sk/server/api/poop';
        dataFactory.getAll()
            .success(function (data) {
                $scope.poops = data.poops;
            }).
            error(function (error) {
                $scope.status = 'Unable to get poops: ' + error.message;
            });
    };

    ctrl.getFood();
    ctrl.getPoop();

}]);