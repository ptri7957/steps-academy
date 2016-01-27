$('document').ready(function(){
    var ref = new Firebase('https://glaring-inferno-4440.firebaseio.com');
        $('#home').click(function(){
        $('#home').hide();
        window.location.href = "#history";
    });   
        
    $('#logout').click(function(){
        ref.unauth();
        sessionStorage.clear();
        alert("Logged out successfully");
        window.location.href = "#/";
        $('#home').hide();
        $('#logout').hide();
    });
});