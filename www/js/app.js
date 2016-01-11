// Module
var pedometerApp = angular.module("pedometer", ['ionic']);

// Controller
pedometerApp.controller('PedometerCtrl', ['$scope', function($scope) {
    
    // When the pedometer starts, grab pedometer data
    var successHandler = function(pedometerData) {
        //alert(pedometerData.numberOfSteps);
        //alert(pedometerData.startDate);
        //alert(pedometerData.endDate);
        
        // Store pedometer data into the scope.
        $scope.numberOfSteps = pedometerData.numberOfSteps;
        $scope.startDate = pedometerData.startDate;
        $scope.endDate = pedometerData.endDate;
    };
    
    // Pedometer will throw error if
    // there is something wrong i.e.
    // no sensors found on phone.
    var onError = function(error) {
        alert(JSON.stringify(error));
    };
    
    // Success callback
    var successCallback = function(success) {
        alert(success);
    };
    
    // Failure callback
    var failureCallback = function(failure) {
        alert(failure);
    };
    
    $scope.addNotes = function() {
        $('#notes').show();
        $('#intro').hide();
        $scope.startFlag = false;
    };
    
    $scope.addNotess = function() {
        $('#notes').show();
        $('#started').hide();
        $scope.startFlag = true;
    };
    
    $scope.done = function() {
        if($scope.startFlag) {
            $('#started').show();
        }else{
            $('#intro').show();
        }
        $('#notes').hide();
        
        if($('#mood').val().length > 0) {
            sessionStorage.mood = $('#mood').val();
        }
        
        if($('#health').val().length > 0) {
            sessionStorage.health = $('#health').val();
        }
        
        if($('#weather').val().length > 0) {
            sessionStorage.weather = $('#weather').val();
        }
        
        if($('#activity').val().length > 0) {
            sessionStorage.activity = $('#activity').val();
        }
        
        if($('#transport').val().length > 0) {
            sessionStorage.transport = $('#transport').val();
        }
        
    };
    
    // Function to start the pedometer updates
    $scope.startPedometerUpdates = function() {
        if($('#text').val() == ""){
            alert("Please enter a name for your activity.");
        } else {
            // Start steps counter
            pedometer.startPedometerUpdates(successHandler, onError); 
            $('#recording').append("<h3>App has started recording</h3>");
        
            var name = $('#text').val();
            sessionStorage.name = name;
        
            // Hide main content
            $('#name').append("<h1>" + name + "</h1>");
            $('#intro').hide();
            $('#started').show();
        }
    };
    
    // Function to stop the pedometer updates
    $scope.stopPedometerUpdates = function() {
        
        // Stop updating
        pedometer.stopPedometerUpdates(successCallback, failureCallback);

        // Pass on pedometer data onto the next page
        if($scope.numberOfSteps) {
            sessionStorage.numberOfSteps = $scope.numberOfSteps;
        }
            
        if($scope.startDate) {
            sessionStorage.startDate = $scope.startDate;
        }
            
        if($scope.endDate) {
            sessionStorage.endDate = $scope.endDate;
        }
        window.location.href = "estimate.html";
    };
}]);

// Sign-in controller
pedometerApp.controller('PedometerLoginCtrl', ['$scope', function($scope){
    $scope.signin = function(){
        // Reference firebase app
        var ref = new Firebase('https://glaring-inferno-4440.firebaseio.com');
        
        // User's email and password
        var email = $("#email").val();
        var pass = $("#password").val();
        
        // Authenticate user using email and password
        ref.authWithPassword({
            email : email,
            password : pass}, 
        // During authentication, check credentials.
        // If successful, lead user to history page.
        function(error, authData) {
            if(error){
                console.log("Login Failed!", error);
                $('.error').append(error);
            }else{
                console.log("Authenticated successfully:", authData);
                // Send user to their history page
                window.location.href = "history.html"
                // Store user id for future firebase reference
                sessionStorage.user = authData.uid;
            }
        });
    }
    
    $scope.signout = function(){
        var email = $("#email").val();
        var pass = $("#password").val();
        var cpass = $("#comp-pass").val();
    
        if(cpass != pass){
            $('#errormessage').html("Password confirmation does not match.")
        }else{
            var ref = new Firebase('https://glaring-inferno-4440.firebaseio.com');
            ref.createUser({
                email: email,
                password: pass
            }, function(error, userData){
                if(error){
                    $('#errormessage').html(error);
                }else{
                    var userRef = ref.child("Users");
                    console.log(userData.uid);
                    userRef.child(userData.uid).update({
                        email: email
                    });
                    alert('Sign up successful.');
                }
            });
        }
    }
}]);

// Estimation controller
pedometerApp.controller('EstimateCtrl', ['$scope', function($scope){
    $('#results').hide();
    
    $scope.logout = function(){
        sessionStorage.clear();
        window.location.href = "index.html";
    }
    
    $scope.name = sessionStorage.name;
    
    $scope.actualIntensity = "Low";
    
    $scope.show = function(){
        var estimate = $("#stepInput").val();
        var intensity = $('#intensityInput').val();
                
        if(estimate.length > 0 && intensity.length > 0){
            $('#yourSteps').html(estimate);
            $('#yourIntensity').html(intensity);  
            
            // Calculate the intensity
            if(sessionStorage.numberOfSteps){
                $('#actualSteps').html(sessionStorage.numberOfSteps);
                if(parseInt(sessionStorage.numberOfSteps) <= 100){
                    $scope.actualIntensity = "Low";
                }else if(parseInt(sessionStorage.numberOfSteps) > 100
                        && parseInt(sessionStorage.numberOfSteps) <= 120){
                    $scope.actualIntensity = "Light";
                }else if(parseInt(sessionStorage.numberOfSteps) > 120
                        && parseInt(sessionStorage.numberOfSteps) <= 130){
                    $scope.actualIntensity = "Moderate";
                }else if(parseInt(sessionStorage.numberOfSteps) > 130
                        && parseInt(sessionStorage.numberOfSteps) <= 140){
                    $scope.actualIntensity = "Active";
                }else if(parseInt(sessionStorage.numberOfSteps) > 140
                        && parseInt(sessionStorage.numberOfSteps) <= 150){
                    $scope.actualIntensity = "Very Active";
                }else if(parseInt(sessionStorage.numberOfSteps) > 150
                        && parseInt(sessionStorage.numberOfSteps) <= 160){
                    $scope.actualIntensity = "Exceptionally Active";
                }else{
                    $scope.actualIntensity = "Athletic";
                }
            }else{
                $('#actualSteps').html(0);
            }
            $('#actualIntensity').html($scope.actualIntensity);
            
            
            $('#estimates').hide();
            $('#results').show();
        }else{
            alert("One or more fields are empty");
        }
    }
    
    $scope.finish = function(){
        var ref = new Firebase('https://glaring-inferno-4440.firebaseio.com/Users');
        var onComplete = function(error){
            if (error) {
                console.log('Synchronization failed');
            } else {
                console.log('Synchronization succeeded');
                window.location.replace("history.html");
            }
        }
        
        // Save activity data
        if(sessionStorage.numberOfSteps && sessionStorage.startDate && sessionStorage.endDate){
            ref.child(sessionStorage.user + "/activities/" +
                      sessionStorage.name)
               .update({name: sessionStorage.name,
                        steps: sessionStorage.numberOfSteps, 
                        start_date: sessionStorage.startDate,
                        end_date: sessionStorage.endDate,
                        mood: sessionStorage.mood,
                        health: sessionStorage.health,
                        weather: sessionStorage.weather,
                        activity: sessionStorage.activity,
                        transport: sessionStorage.transport,
                        intensity: $scope.actualIntensity}, onComplete);
        }else{
            ref.child(sessionStorage.user + "/activities/" +
                      sessionStorage.name)
               .update({name: sessionStorage.name,
                        steps: 0, 
                        start_date: 0,
                        end_date: 0,
                        mood: sessionStorage.mood,
                        health: sessionStorage.health,
                        weather: sessionStorage.weather,
                        activity: sessionStorage.activity,
                        transport: sessionStorage.transport,
                        intensity: $scope.actualIntensity}, onComplete);
        }
    }
}]);