qqApp.controller("menuController", function ($scope, $rootScope, $http, storageService, loginService) {
    init();

    $rootScope.$on('loginEvent', function(event, message) {
        init();
    });

    function init(){
        $scope.showLoginRequiredAlert = false;
        $scope.userIsLoggedIn = loginService.isLoggedIn();

        loadQuiz();
    }

    function loadQuiz(){
        storageService.getQuizList().then(
            function(quizList) {
                listQuiz(quizList);
            }, 
            function(reason) {
                alert('Failed: ' + reason);
            }
        );
    };


    function listQuiz(quizList){

        var user = loginService.getLoggedUser();

        if(user){
            for (var qIndex = 0; qIndex < quizList.length; qIndex++) {
                var element = quizList[qIndex];

                quizList[qIndex].showResults = false;
                quizList[qIndex].numberOfTries = 0;
                quizList[qIndex].maxScore = "0/0";

                for(var qTriesIndex=0; qTriesIndex<user.quizTries.length; qTriesIndex++){
                    if(user.quizTries[qTriesIndex].quizId == quizList[qIndex].id){

                        quizList[qIndex].showResults = true;
                        quizList[qIndex].numberOfTries = user.quizTries[qTriesIndex].numberOfTries;
                        quizList[qIndex].maxScore = user.quizTries[qTriesIndex].maxScore;

                        break;
                    }
                }
            }
        }

        $scope.quizList = quizList;
    }
    
    //This function takes a quiz object (definied in the JSON) and generates a new quiz object 
    // with only 10 questions, taken randomly from the original quiz
    $scope.generateQuiz = function (selectedQuiz, event) {
        if(loginService.isLoggedIn()){
            //Removes 10 random questions from the array (assuming it has 20 elements), leaving it with only 10
            for (qTriesIndex = 20; qTriesIndex > 10; qTriesIndex--) {
                var removedPosition = Math.floor(Math.random() * qTriesIndex);
                selectedQuiz.questions.splice(removedPosition, 1);
                shuffle(selectedQuiz.questions);
            }
            //set the generate quiz to $rootScope so the quizController can get ot
            $rootScope.generatedQuiz = selectedQuiz;
        }else{
            //Cancels the redirect to the next page and demands login
            $scope.showLoginRequiredAlert = true;
            event.preventDefault();
        }       
    }

    //Shuffles an array
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
});