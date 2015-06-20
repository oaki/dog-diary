/* use strict */
app.controller('MainCtrl', ['$scope', 'dataFactory', function ($scope, dataFactory) {
    var ctrl = this;

    $scope.labels = [];
    $scope.series = [
        'Food weight',
        'Dufalact',
        'Poop'
    ];
    $scope.data = [
        [],
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

    ctrl.setDataWithDate = function (data) {
        angular.forEach(data, function(value) {
            var date = value.datetime.date;
            if(date !== undefined){
                value.datetime.date = date.split(" ")[0];
            }
        });
    };

    ctrl.getMapValuesToDate = function (data, attributes) {
        var dataMapping = {};

        angular.forEach(data, function(value) {
            var date = value.datetime.date;
            if(dataMapping[date] === undefined){
                dataMapping[date] = {};
                angular.forEach(attributes, function(attribute){
                    dataMapping[date][attribute] = value[attribute];
                });
            } else {
                angular.forEach(attributes, function(attribute){
                    dataMapping[date][attribute] += value[attribute];
                });
            }
        });

        return dataMapping;
    };

    ctrl.setValuesToChart = function (dataMapping, attributes) {
        for(var i = 0; i < $scope.labels.length; i++){
            if(dataMapping[$scope.labels[i]] === undefined){
                angular.forEach(attributes, function(attribute, key){
                    $scope.data[key].push(0);
                });
            } else {
                angular.forEach(attributes, function(attribute, key){
                    $scope.data[key].push(dataMapping[$scope.labels[i]][attribute]);
                });
            }
        }
    };

    ctrl.processData = function (data, attributes) {
        //set date to usable format
        ctrl.setDataWithDate(data);

        //map values to date
        var dataMapping = ctrl.getMapValuesToDate(data, attributes);

        //set values to chart
        ctrl.setValuesToChart(dataMapping, attributes);
    };

    ctrl.processFoodData = function (data) {
        //define attributes for chart
        var attributes = {
            0 : "weight",
            1 : "dufalact"
        };

        ctrl.processData(data, attributes);
    };

    ctrl.processPoopData = function (data) {
        //define attributes for chart
        var attributes = {
            2 : "size"
        };

        ctrl.processData(data, attributes);
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
                ctrl.processPoopData(data.poops);
            }).
            error(function (error) {
                $scope.status = 'Unable to get poops: ' + error.message;
            });
    };

    ctrl.getFood();
    ctrl.getPoop();

}]);