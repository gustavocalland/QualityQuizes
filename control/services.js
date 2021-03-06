qqApp.service('loginService', function() {
    this.isLoggedIn = function(){
        return sessionStorage.loggedInUser != null;
    };
    this.login = function(user){
        sessionStorage.setItem("loggedInUser",JSON.stringify(user));
    }
    this.logout = function(){
        sessionStorage.removeItem("loggedInUser");
    }
    this.getLoggedUser = function(){
        return JSON.parse(sessionStorage.getItem('loggedInUser'));
    }
});

//Obtains data from the json
qqApp.service('storageService', function($http, $q){

    this.getQuizList = function () {

        return $q(function (resolve, reject) {

            if (localStorage.getItem("quizes")) {
                resolve(JSON.parse(localStorage.getItem("quizes")));
            }else{
                //not found, lets get from the json
                $http.get("database/quizes.json").then(function(response) {
                    var json = response.data.quizes;
                    setQuizes(json);
                    resolve(json); 

                }, function(err) {
                    //some error
                    reject(err);
                });
            }

            
        });
    };

    var setQuizes = function(quizesJson){
        localStorage.setItem("quizes", JSON.stringify(quizesJson));
    }


    this.getUserByEmail = function (email, callback) {
       getAllUsers().then(
           function(response){
                var users = response;

                for(i=0; i<users.length; i++){
                    if(users[i].email == email){
                        callback(users[i]);
                        return;
                    }
                }

                callback(null);
            },
            function (error){
                logError(error)
            }
        );
    };


    this.setUser = function(user){
        return $q(function(success){
            getAllUsers().then(
                function(allUsers){

                    var users = allUsers;
                    var exists = false;
                    var i=0;

                    for(i=0; i<users.length; i++){
                        if(users[i].id == user.id){
                            exists = true;
                            //replace previous user
                            users[i] = user;
                            
                            break;
                        }
                    }

                    if (!exists){
                        user.id = i+1;
                        users.push(user);
                    }

                    //persist users list
                    setUsers(users);
                    success();
                    
                },
                function(error){
                    logError(error)
                }
            );
        });
    }

    //private functions to get all users from the localstorage
    var getAllUsers = function(){
        return $q(function(success, failure){
            if (localStorage.getItem("users")) {
                success(JSON.parse(localStorage.getItem("users")));
            }else{
                //No user list found on local storage. We get the initial list from the json
                $http.get("database/users.json").then(function(response) {
                    var json = response.data.users;
                    setUsers(json);
                    success(json);
                }, function(err) {
                    //some error
                    failure(err);
                });
            }
        });
    }

    //Sets a group of users (json format) into the local storage
    var setUsers = function(usersJson){
        localStorage.setItem("users", JSON.stringify(usersJson));
    }

    function logError(error){
        console.log("ERROR: "+error);
    }
});

