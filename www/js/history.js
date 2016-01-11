$('document').ready(function(){
    $('#logout').click(function(){
        sessionStorage.clear();
        window.location.href = "index.html"
    });
      
    var ref = new Firebase('https://glaring-inferno-4440.firebaseio.com/Users/' + sessionStorage.user);
               
    ref.on('value', function(snapshot){
        var hasActivities = snapshot.hasChild("activities");
         if(hasActivities){
            // List activity history in start_date order - latest activities listed first
            ref.child('activities').orderByChild('start_date').on('child_added', function(snap){
                // Table row
                var row = document.createElement('div');
                row.className = "row";
                        
                // Name column
                var name = document.createElement('div');
                name.className = "col";
                name.setAttribute("id", "contents");
                name.innerHTML = snap.val().name;
                    
                // Steps column
                var steps = document.createElement('div');
                steps.className = "col";
                steps.setAttribute("id", "contents");
                steps.innerHTML = snap.val().steps;

                // Duration column
                var startDate = new Date(parseInt(snap.val().start_date));
                var endDate = new Date(parseInt(snap.val().end_date));
                var duration = document.createElement('div');
                duration.setAttribute("id", "contents");
                duration.className = "col";
                // Calculate hours, minutes and seconds
                var durationS = ((endDate.getTime() - startDate.getTime())/1000);
                var durationM = ((endDate.getTime() - startDate.getTime())/1000/60);
                var durationH = ((endDate.getTime() - startDate.getTime())/1000/60/60);
                if(durationS <= 60){
                  duration.innerHTML = parseInt(durationS) + " Seconds";
                }else if(durationS >= 60 && durationS <= 3600){
                  duration.innerHTML = parseInt(durationM) + " Minutes";
                }else{
                  duration.innerHTML = parseInt(durationH) + " Hours";
                }
                
                // Append the table columns into the table row
                row.appendChild(name);
                row.appendChild(steps);
                row.appendChild(duration);
                        
                // Append the row into the history table
                $('#history').append(row);
            });
                        
        }else{
            console.log("Nothing yet");
        }
    });
});