$('document').ready(function(){
    $('#logout').click(function(){
        sessionStorage.clear();
        window.location.href = "index.html"
    });
    var ref = new Firebase('https://glaring-inferno-4440.firebaseio.com/Users/' + sessionStorage.user);
               
    ref.on('value', function(snapshot){
        var hasActivities = snapshot.hasChild("activities");
         if(hasActivities){
            ref.child('activities').on('child_added', function(snap){
                var row = document.createElement('div');
                row.className = "row";
                        
                var name = document.createElement('div');
                name.className = "col";
                name.innerHTML = snap.val().name;
                    
                var steps = document.createElement('div');
                steps.className = "col";
                steps.innerHTML = snap.val().steps;

                var startDate = new Date(parseInt(snap.val().start_date));
                var endDate = new Date(parseInt(snap.val().end_date));
                var duration = document.createElement('div');
                duration.className = "col";
                var durationS = ((endDate.getTime() - startDate.getTime())/1000);
                var durationM = ((endDate.getTime() - startDate.getTime())/1000/60);
                var durationH = ((endDate.getTime() - startDate.getTime())/1000/60/60);
                if(duration <= 60){
                  duration.innerHTML = durationS + "Seconds";
                }else if(duration >= 60 && duration <= 3600){
                  duration.innerHTML = durationM + "Minutes";
                }else{
                  duration.innerHTML = durationH + "Hours";
                }
                
                        
                row.appendChild(name);
                row.appendChild(steps);
                row.appendChild(duration);
                        
                $('#history').append(row);
            });
                        
        }else{
            console.log("Nothing yet");
        }
    });
});
