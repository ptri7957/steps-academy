$('document').ready(function(){
    $('.sign-in').click(function(){
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
                        email: email,
                        // Pull array and append new activity objects to activities
                        // e.g. activities.append({name, steps, intensity})
                        // Finally update the activities value
                        activities: ["None"]
                    });
                }
            });
        }
    });
});