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
            
    // Action when show is clicked
    $('#show-me').click(function(){
        var estimate = $("#stepInput").val();
        var intensity = $('#intensityInput').val();
                
        if(estimate.length > 0 && intensity.length > 0){
            $('#yourSteps').html(estimate);
            $('#yourIntensity').html(intensity);
            if(sessionStorage.numberOfSteps){
                $('#actualSteps').html(sessionStorage.numberOfSteps);
            }else{
                $('#actualSteps').html("Not given");
            }
            $('#actualIntensity').html("Not given");
            $('#estimates').hide();
            $('#results').show();
        }else{
            alert("One or more fields are empty");
        }
                
    });
            
    // Action when finish is clicked
    $('#finish').click(function(){
        if(sessionStorage.numberOfSteps && sessionStorage.startDate && sessionStorage.endDate){
            var ref = new Firebase('https://glaring-inferno-4440.firebaseio.com/Users');
            var onComplete = function(error){
                if (error) {
                    console.log('Synchronization failed');
                } else {
                    console.log('Synchronization succeeded');
                    window.location.replace("history.html");
                }
            }
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
                        transport: sessionStorage.transport}, onComplete);
        }
        
    });
            
});
