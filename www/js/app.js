var starter = angular.module('starter', ['ionic']);
starter.run(function($ionicPlatform){
    $ionicPlatform.ready(function(){
        
    });
});

    
var pedometerApp = angular.module("pedometer", ['ionic']);
pedometerApp.run(function($ionicPlatform){
    $ionicPlatform.ready(function(){
        if(pedometer) {
            console.log(pedometer);
            console.log("Available!");
        
            // Check if counting is available
            pedometer.isStepCountingAvailable(function(){
                console.log("success");
            }, function(){
                console.log("failure");
            });
        }else{
            console.log("Not available...");
        }
    });
});
    
pedometerApp.controller('PedometerCtrl', ['$scope', function($scope){
    // Function to start the pedometer updates
    $scope.startPedometerUpdates = function(){
        // Start steps counter
        pedometer.startPedometerUpdates(function(pedometerData){
            console.log(pedometerData.startDate);
            document.getElementById('steps').innerHTML = pedometerData.numberOfSteps;
        }, function(){
            console.log("error");
        }); 
        document.getElementById('recording').innerHTML = "Recording in session...";
        
    };
    
    // Function to stop the pedometer updates
    $scope.stopPedometerUpdates = function(){
        // Stop updating
        pedometer.stopPedometerUpdates(function(){
            console.log("stopping success");
        }, function(){
            console.log("error");
        });
        document.getElementById('recording').innerHTML = "Recording finished";
    }
}]);