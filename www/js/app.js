var pedometerApp = angular.module("pedometer", ['ionic']);
pedometerApp.controller('PedometerCtrl', ['$scope', function($scope){
    
    // When the pedometer starts, grab pedometer data
    var successHandler = function(pedometerData){
        alert(pedometerData.numberOfSteps);
        //alert(pedometerData.startDate);
        //alert(pedometerData.endDate);
        
        // Store pedometer data into the scope.
        $scope.numberOfSteps = pedometerData.numberOfSteps;
        $scope.startDate = pedometerData.startDate;
        $scope.endDate = pedometerData.endDate;
    }
    
    // Pedometer will throw error if
    // there is something wrong i.e.
    // no sensors found on phone.
    var onError = function(error){
        alert(JSON.stringify(error));
    }
    
    // Function to start the pedometer updates
    $scope.startPedometerUpdates = function(){
        if($('#text').val() == ""){
            alert("Please enter a name for your activity.");
        }else{
            // Start steps counter
            pedometer.startPedometerUpdates(successHandler, onError); 
            $('#recording').append("<h3>App has started recording</h3>");
        
            var name = $('#text').val();
        
            // Hide main content
            $('.desc').hide();   
            $('#label').hide();
            $('#name').append("<h1>" + name + "</h1>");
            $('#name').show();
            $('#inst').html("Click End when you have completed your activity.");
            $('#inst').show();
            $('#start').hide();
            $('#end').show();
        }
    };
    
    // Function to stop the pedometer updates
    $scope.stopPedometerUpdates = function(){
        
        // Stop updating
        pedometer.stopPedometerUpdates(function(success){
            alert(success);
        }, function(error){
            alert(error);
        });
            //$('#start').show();
            //$('#end').hide();
            //$('#showResults').show();
            
        // Pass on pedometer data onto the next page
        if($scope.numberOfSteps){
            sessionStorage.numberOfSteps = $scope.numberOfSteps;
        }
            
        if($scope.startDate){
            sessionStorage.startDate = $scope.startDate;
        }
            
        if($scope.endDate){
            sessionStorage.endDate = $scope.endDate;
        }
    }
}]);