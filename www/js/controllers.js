// Main controller
app.controller('mainController', function($scope){
    $('#home').hide();
    $('#logout').hide();
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
                $('#home').show();
                $('#logout').show();
                // Send user to their history page
                window.location.href = "#history";
                // Store user id for future firebase reference
                sessionStorage.user = authData.uid;
            }
        });
    }
});

// Sign up controller
app.controller('signupController', function($scope){
    $scope.signup = function(){
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
})

// History controller
app.controller('historyController',  ['$scope', '$firebaseArray', 
                                      function($scope, $firebaseArray){

    var ref = new Firebase('https://glaring-inferno-4440.firebaseio.com/Users/' 
                           + sessionStorage.user);
    
    $scope.messages = $firebaseArray(ref);
    
    var query = ref.child('activities').orderByChild('start_date');
    $scope.filteredMessages = $firebaseArray(query);
    
    $scope.filteredMessages.$loaded().then(function(){
        angular.forEach($scope.filteredMessages, function(result){
            
        });
    });
    
}]);

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

// Pedometer controller
app.controller('pedometerController', function($scope, $ionicPopup){
    $('#started').hide();
    $('#notes').hide();
    
    sessionStorage.mood = "None";
    sessionStorage.health = "None";
    sessionStorage.weather = "None";
    sessionStorage.activity = "None";
    sessionStorage.transport = "None";
    
    sessionStorage.numberOfSteps = 0;
    
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
    
    // When the pedometer starts, grab pedometer data
    var successHandler = function(pedometerData) {
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
    
    $scope.ready = function(){
        $scope.data = {};
        $ionicPopup.show({
            templateUrl: 'pages/standby.html', 
            title: 'Recording Ready',
            scope: $scope,
            buttons: [
                {
                    text: 'Record',
                    type: 'button-positive',
                    onTap: function(){
                        $scope.startPedometerUpdates();
                        $('#started').show();
                    }
                }
            ]
        });
    };
    
    // Function to start the pedometer updates
    $scope.startPedometerUpdates = function() {
        sessionStorage.startDate = new Date().getTime();
        if($('#text').val() == ""){
            alert("Please enter a name for your activity.");
        } else {
            // Start steps counter
            pedometer.startPedometerUpdates(successHandler, onError); 
            $('#recording').append("<h3>Recording...</h3>");
        
            var name = $('#text').val();
            sessionStorage.name = name;
        
            // Hide main content
            //$('#name').append("<h1>" + name + "</h1>");
            $('#intro').hide();
            
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
        }else{
            sessionStorage.endDate = new Date().getTime();    
        }
        
        window.location.href = "#estimate";
    };
});

// Estimate controller
app.controller('estimateController', function($scope){
    $('#actual').hide();

    $scope.name = sessionStorage.name;
    $scope.steps = sessionStorage.numberOfSteps;
    $scope.actualIntensity = "Low";
    
    $scope.show = function(){
        var estimate = $("#stepInput").val();
        var intensity = $('#intensityInput').val();
        var duration = $('#durationInput').val();
        var measure = $('#timeInput').val();
                
        if(estimate.length > 0 && intensity.length > 0 && duration.length > 0){
            $('#yourSteps').html(estimate);
            $('#yourIntensity').html(intensity);  
            $('#yourDuration').html(duration + " " + measure);
            
            if(parseInt($scope.steps)/60 <= 100){
                $scope.actualIntensity = "Low";
            }else if(parseInt($scope.steps)/60 > 100
                    && parseInt($scope.steps)/60 <= 120){
                $scope.actualIntensity = "Light";
            }else if(parseInt($scope.steps)/60 > 120
                    && parseInt($scope.steps)/60 <= 130){
                $scope.actualIntensity = "Moderate";
            }else if(parseInt($scope.steps)/60 > 130
                    && parseInt($scope.steps)/60 <= 140){
                $scope.actualIntensity = "Active";
            }else if(parseInt($scope.steps)/60 > 140
                    && parseInt($scope.steps)/60 <= 150){
                $scope.actualIntensity = "Very Active";
            }else if(parseInt($scope.steps)/60 > 150
                    && parseInt($scope.steps)/60 <= 160){
                $scope.actualIntensity = "Exceptionally Active";
            }else{
                $scope.actualIntensity = "Athletic";
            }
        
            var actualStart = parseInt(sessionStorage.startDate);
            var actualEnd = parseInt(sessionStorage.endDate);
            var sec = (actualEnd - actualStart)/1000;
            var min = (actualEnd - actualStart)/1000/60;
            var hr = (actualEnd - actualStart)/1000/60/60;
            
            if(sec < 60){
                $scope.duration = sec + " sec";
            }else if(sec >= 60 && sec <= 3600){
                $scope.duration = min + " min";
            }else{
                $scope.duration = hr + " hr";
            }
            
            $('#estimates').hide();
            $('#actual').show();
        }else{
            alert("One or more fields are empty");
        }
    }
    
    // Save all pedometer data onto firebase dashboard
    $scope.finish = function(){
        var ref = new Firebase('https://glaring-inferno-4440.firebaseio.com/Users');
        var onComplete = function(error){
            if (error) {
                console.log('Synchronization failed');
            } else {
                console.log('Synchronization succeeded');
                window.location.replace("#history");
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
                        start_date: sessionStorage.startDate,
                        end_date: sessionStorage.endDate,
                        mood: sessionStorage.mood,
                        health: sessionStorage.health,
                        weather: sessionStorage.weather,
                        activity: sessionStorage.activity,
                        transport: sessionStorage.transport,
                        intensity: $scope.actualIntensity}, onComplete);
        }
    }
});
