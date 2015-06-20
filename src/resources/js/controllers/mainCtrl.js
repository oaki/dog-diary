/* use strict */
app.controller('MainCtrl', ['$scope', 'foodDataFactory', 'poopDataFactory', '$q', function ($scope, foodDataFactory, poopDataFactory, $q) {
    var ctrl = this;

    $scope.series = [
        'Food weight',
        'Dufalact',
        'Poop'
    ];

    ctrl.attributesFood = {
        0: "weight",
        1: "dufalact"
    };

    ctrl.attributesPoop = {
        2: "size"
    };

    ctrl.dataMappingFood = {};
    ctrl.dataMappingPoop = {};

    $scope.$watch('days', function () {
        $scope.labels = [];
        $scope.data = [
            [],
            [],
            []
        ];

        ctrl.generateDayRange($scope.days);
        ctrl.setValuesToChart(ctrl.dataMappingFood, ctrl.attributesFood);
        ctrl.setValuesToChart(ctrl.dataMappingPoop, ctrl.attributesPoop);
    });

    ctrl.dateToYMD = function (date) {
        var d = date.getDate();
        var m = date.getMonth() + 1;
        var y = date.getFullYear();
        return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
    };

    ctrl.generateDayRange = function (day) {
        for (var i = 0; i < day; i++) {
            var dateObj = new Date();
            dateObj.setDate(dateObj.getDate() - i);
            $scope.labels.push(ctrl.dateToYMD(dateObj));
        }
    };

    ctrl.setDataWithDate = function (data) {
        angular.forEach(data, function (value) {
            var date = value.datetime.date;
            if (date !== undefined) {
                value.datetime.date = date.split(" ")[0];
            }
        });
    };

    ctrl.getMapValuesToDate = function (data, attributes) {
        var dataMapping = {};

        angular.forEach(data, function (value) {
            var date = value.datetime.date;
            if (dataMapping[date] === undefined) {
                dataMapping[date] = {};
                angular.forEach(attributes, function (attribute) {
                    dataMapping[date][attribute] = value[attribute];
                });
            } else {
                angular.forEach(attributes, function (attribute) {
                    dataMapping[date][attribute] += value[attribute];
                });
            }
        });

        return dataMapping;
    };

    ctrl.setValuesToChart = function (dataMapping, attributes) {
        for (var i = 0; i < $scope.labels.length; i++) {
            if (typeof dataMapping[$scope.labels[i]] === 'undefined') {
                angular.forEach(attributes, function (attribute, key) {
                    $scope.data[key].push(0);
                });
            } else {
                angular.forEach(attributes, function (attribute, key) {
                    $scope.data[key].push(dataMapping[$scope.labels[i]][attribute]);
                });
            }
        }
    };

    ctrl.getDataForChart = function (data, attributes) {
        //set date to usable format
        ctrl.setDataWithDate(data);

        //map values to date
        return ctrl.getMapValuesToDate(data, attributes);
    };

    ctrl.getData = function () {
        $q.all(
                [
                    poopDataFactory.getAll(),
                    foodDataFactory.getAll()
                ]
            ).then(function (response) {
                ctrl.dataMappingPoop = ctrl.getDataForChart(response[0].data.poops, ctrl.attributesPoop);
                ctrl.dataMappingFood = ctrl.getDataForChart(response[1].data.foods, ctrl.attributesFood);
                $scope.days = 5;
            });
    };

    ctrl.getData();
}]);