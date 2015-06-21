/* use strict */
app.controller('MainCtrl', [
    '$scope',
    'foodDataFactory',
    'poopDataFactory',
    'chartService',
    '$q',
    function ($scope, foodDataFactory, poopDataFactory, chartService, $q) {
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

            $scope.labels = chartService.getDayRange($scope.days);

            chartService.setValuesToChart(
                ctrl.dataMappingFood,
                ctrl.attributesFood,
                $scope.labels,
                $scope.data
            );
            chartService.setValuesToChart(
                ctrl.dataMappingPoop,
                ctrl.attributesPoop,
                $scope.labels,
                $scope.data
            );
        });

        ctrl.createChart = function () {
            $q.all(
                    [
                        poopDataFactory.getAll(),
                        foodDataFactory.getAll()
                    ]
                ).then(function (response) {
                    ctrl.dataMappingPoop = chartService.getDataForChart(
                        response[0].data.poops,
                        ctrl.attributesPoop
                    );
                    ctrl.dataMappingFood = chartService.getDataForChart(
                        response[1].data.foods,
                        ctrl.attributesFood
                    );
                    $scope.days = 5;
                });
        };

        ctrl.createChart();
    }]);