$('document').ready(function(){
    $('#results').hide();
            
    // Log the user out
    $('#logout').click(function(){
        sessionStorage.clear();
        window.location.href = "index.html";
    });
            
    if(sessionStorage.name){
        $('#name').html("<h3>" + sessionStorage.name + "</h3>");
    }
    /*
        80-100 low
        120 light
        130 moderate
        140 active
        150 very active
        160 exceptionally active
        >170 athletic
    */
    var actualIntensity = "Low"; 
    // Action when show is clicked
    $('#show-me').click(function(){
        var estimate = $("#stepInput").val();
        var intensity = $('#intensityInput').val();
                
        if(estimate.length > 0 && intensity.length > 0){
            $('#yourSteps').html(estimate);
            $('#yourIntensity').html(intensity);  
            
            if(sessionStorage.numberOfSteps){
                $('#actualSteps').html(sessionStorage.numberOfSteps);
                if(parseInt(sessionStorage.numberOfSteps) <= 100){
                    actualIntensity = "Low";
                }else if(parseInt(sessionStorage.numberOfSteps) > 100
                        && parseInt(sessionStorage.numberOfSteps) <= 120){
                    actualIntensity = "Light";
                }else if(parseInt(sessionStorage.numberOfSteps) > 120
                        && parseInt(sessionStorage.numberOfSteps) <= 130){
                    actualIntensity = "Moderate";
                }else if(parseInt(sessionStorage.numberOfSteps) > 130
                        && parseInt(sessionStorage.numberOfSteps) <= 140){
                    actualIntensity = "Active";
                }else if(parseInt(sessionStorage.numberOfSteps) > 140
                        && parseInt(sessionStorage.numberOfSteps) <= 150){
                    actualIntensity = "Very Active";
                }else if(parseInt(sessionStorage.numberOfSteps) > 150
                        && parseInt(sessionStorage.numberOfSteps) <= 160){
                    actualIntensity = "Exceptionally Active";
                }else{
                    actualIntensity = "Athletic";
                }
            }else{
                $('#actualSteps').html(0);
            }
            $('#actualIntensity').html(actualIntensity);
            
            
            $('#estimates').hide();
            $('#results').show();
        }else{
            alert("One or more fields are empty");
        }
                
    });
            
    // Action when finish is clicked
    $('#finish').click(function(){
        var ref = new Firebase('https://glaring-inferno-4440.firebaseio.com/Users');
        var onComplete = function(error){
            if (error) {
                console.log('Synchronization failed');
            } else {
                console.log('Synchronization succeeded');
                window.location.replace("history.html");
            }
        }
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
                        intensity: actualIntensity}, onComplete);
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
                        intensity: actualIntensity}, onComplete);
        }
        
    });
            
});