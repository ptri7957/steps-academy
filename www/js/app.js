var app = angular.module('starter', ['ionic', 'ngRoute', 'firebase']);

app.config(function($routeProvider){
    $routeProvider
    .when('/', {
        templateUrl : 'pages/home.html',
        controller : 'mainController'
    })
    
    .when('/signup', {
        templateUrl : 'pages/signup.html',
        controller : 'signupController'
    })
    
    .when('/history', {
        templateUrl : 'pages/history.html',
        controller : 'historyController'  
    })
    
    .when('/selftest', {
        templateUrl : 'pages/selftest.html',
        controller : 'pedometerController'
    })
   
    .when('/estimate', {
        templateUrl : 'pages/estimate.html',
        controller : 'estimateController'
    })
});