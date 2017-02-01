var qqApp = angular.module("qqApp", ["ngRoute","ngAnimate"]);

qqApp.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when("/quiz", {
            templateUrl : "views/quiz-view.html"
        })
        .when("/signUp",{
            templateUrl : "views/user-form-view.html"
        })
        .when("/myProfile",{
            templateUrl : "views/user-form-view.html"
        })
        .otherwise({
            templateUrl : "views/menu-view.html"
        });

    $locationProvider.html5Mode(true).hashPrefix('!');
});