angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(pedometer) {
        console.log("Available!");
    }else{
        console.log("Not available...");
    }
  });
}).controller('PedometerCtrl', ['$scope', function($scope){
    // Success handler for starting pedometer updates
    var successHandler = function(pedometerData){
        
        // Grab the number of steps taken, and start and end dates
        $scope.numberOfSteps = pedometerData.numberOfSteps;
        $scope.startDate = pedometerData.startDate;
        $scope.endDate = pedometerData.endDate;
    };
    
    // The error to throw if updating pedometer data fails
    var onError = function(error){
        console.log("Error: ", error);
    };
    
    // Start pedometer updates
    $scope.startPedometer = function(){
        pedometer.startPedometerUpdates(successHandler, onError);
        document.getElementById("recording").innerHTML = "Recording...";
    };
    
    // Stop pedometer updates
    $scope.stopPedometer = function(){
        pedometer.stopPedometerUpdates(function(success){
            console.log(success);
        }, function(error){
            console.log(error);
        });
        document.getElementById("recording").innerHTML = (JSON.stringify(successHandler));
    };
}]);
