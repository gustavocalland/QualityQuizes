//Controller used for the sign up and editing of user data
qqApp.controller("userFormController", function($scope, $location, loginService, storageService) {
    var currentUser=null;

    $scope.pageTitle = "Sign Up";
    $scope.pageMessage = "Join us today and answer thousands of quizes!";
    $scope.buttonTitle = "Sign up";

    $scope.firstNameInput = ""
    $scope.lastNameInput  = ""
    $scope.emailInput     = ""
    $scope.phoneInput     = ""
    $scope.addressInput   = ""
    
    $scope.passwordInput        = ""
    $scope.confirmPasswordInput = ""

    //If the user is logged in and is accessing this controller, it means that 
    // he is trying to edit his info
    if(loginService.isLoggedIn()){
        $scope.pageTitle = "My profile";   
        $scope.pageMessage = "";     
        $scope.buttonTitle = "Update my profile";

        currentUser = loginService.getLoggedUser();
        $scope.firstNameInput = currentUser.firstName;
        $scope.lastNameInput  = currentUser.lastName;
        $scope.emailInput     = currentUser.email;
        $scope.phoneInput     = currentUser.phone;
        $scope.addressInput   = currentUser.address;
    }

    $scope.signUp = function () {
        $scope.errorMessage = "";
        $scope.emailContainerClass = "";

        storageService.getUserByEmail($scope.emailInput, function (user) {

            if(user && !(currentUser != null && currentUser.id == user.id)){
                $scope.errorMessage = "This e-mail is already registered. Try loggin in.";
                return;
            }
            

            if($scope.passwordInput != $scope.confirmPasswordInput){
                $scope.errorMessage = "The passwords do not match.";
                $scope.emailContainerClass = "has-error"
            }

            //No errors detected
            if($scope.errorMessage == ""){

                var newUser = {
                                "firstName":$scope.firstNameInput,
                                "lastName":$scope.lastNameInput,
                                "email":$scope.emailInput,
                                "phone":$scope.phoneInput,
                                "address":$scope.addressInput,
                                "password":$scope.passwordInput,
                                "quizTries" :[]
                            };

                if (currentUser != null){
                    newUser.id = currentUser.id;
                }

                storageService.setUser(newUser).then(
                    function(){
                        //save the results to the current user
                        loginService.login(newUser);

                        $location.path('/');

                        $scope.$emit('loginEvent', "user entrou");

                    },
                    function(err){
                        alert(err);
                    }
                );
                
            }
        })
    }

    $scope.editInfo = function(){
        //get all the user info and update the json file
    }
});