/* use strict */
app.controller('AddPoopCtrl', ['$scope', 'poopDataFactory', '$location', 'Upload', function ($scope, poopDataFactory, $location, Upload) {
    $scope.datetime = new Date();
    $scope.consistency = 5;
    $scope.size = 5;
    $scope.latitude = 0;
    $scope.longitude = 0;
    $scope.fileId = 0;

    $scope.insertPoop = function () {
        var Poop = {
            datetime: $scope.datetime,
            consistency: $scope.consistency,
            size: $scope.size,
            latitude: $scope.latitude,
            longitude: $scope.longitude,
            fileId: $scope.fileId
        };

        poopDataFactory.insert(Poop)
            .success(function () {
                $location.path('/');
            }).
            error(function (error) {
                $scope.status = 'Unable to insert Poop: ' + error.message;
            });
    };


    $scope.$watch('files', function () {
        console.log($scope);
        $scope.upload($scope.files);
    });

    $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: 'http://dogdiary.bincik.sk/server/upload-file/',
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    console.log(data);
                    $scope.fileId = data.id;
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                });
            }
        }
    };
}]);
