qqApp.controller("navBarController", function($scope, $rootScope, $location, loginService) {

    init();

    function init(){
        $scope.userIsLoggedIn = loginService.isLoggedIn();

        if($scope.userIsLoggedIn){
            $scope.loggedInUser = loginService.getLoggedUser();
        }
    }

    $scope.logout = function()
    {
        $scope.userIsLoggedIn = false;
        $scope.loggedInUser = null;

        loginService.logout();
        $location.path('/');

        $scope.$emit('loginEvent', "user saiu");
    }

    $rootScope.$on('loginEvent', function(event, message) {
        init();
    });

});

qqApp.controller("loginModalController", function($scope, $location, storageService, loginService) {
    $scope.invalidCredentials = false;

    $scope.login = function () {

        storageService.getUserByEmail($scope.emailInput, function(user){

            if (user == undefined || user.password != $scope.passwordInput){
                $scope.invalidCredentials = true;
            }else{
                loginService.login(user);
                $location.path('/');
                
                $scope.$emit('loginEvent', "user entrou");

                //jquery bootstrap
                $('#loginModal').modal('hide');

                return true;
            }

        });

    }
});