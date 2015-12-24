var pedometerApp = angular.module("pedometer", ['ionic']);
pedometerApp.controller('PedometerCtrl', ['$scope', function($scope){
    
    var successHandler = function(pedometerData){
        alert(pedometerData.numberOfSteps);
        alert(pedometerData.startDate);
        alert(pedometerData.endDate);
        sessionStorage.numberOfSteps = pedometerData.numberOfSteps;
        sessionStorage.startDate = pedometerData.startDate;
        sessionStorage.endDate = pedometerData.endDate;
    }
    
    var onError = function(error){
        alert(error);
    }
    
    // Function to start the pedometer updates
    $scope.startPedometerUpdates = function(){
        // Start steps counter
        pedometer.startPedometerUpdates(successHandler, onError); 
        document.getElementById('recording').innerHTML = "Recording in session...";
        $('#start').hide();
        $('#end').show();
    };
    
    // Function to stop the pedometer updates
    $scope.stopPedometerUpdates = function(){
        // Stop updating
        pedometer.stopPedometerUpdates(function(){
            alert("stopping success");
        }, function(){
            alert("error");
        });
        document.getElementById('recording').innerHTML = "Recording finished";
        $('#start').show();
        $('#end').hide();
        $('#showResults').show();
    }
    
    $scope.getResults = function(){
        var options = {
            "startDate": new Date("Fri May 01 2015 15:20:00"),
            "endDate": new Date()
        }
        pedometer.queryData(successHandler, onError, options);
    }
}]);