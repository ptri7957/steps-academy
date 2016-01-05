$('document').ready(function(){
    // Authenticate the user when they click the sign in button
    $('.sign-in').click(function(){
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
    });
});