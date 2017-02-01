qqApp.controller("quizController", function($scope, $rootScope, $location, loginService, storageService) {
    //Gets the quiz the user selected on the index page. This quiz will have 10 questions, selected randomly.
    var generatedQuiz = $rootScope.generatedQuiz;  
    
    if (!generatedQuiz){
        $location.path('/');
        return;
    }

    //This variable will store the user's answers for each question.
    //The array will store a boolean value: TRUE if he got the question correctly, FALSE if not.
    var userAnswers = new Array(10);
    //Marks the position inside the generated quiz. Position 0 for the first question, 1 for the second, and so on.
    //Also marks the position inside the userAnswers array in the same way
    var currentQuestionIndex = 0;
    
    //Initialization
    updateQuestion();
    $scope.quizTitle = generatedQuiz.title;
    $scope.disabledNextButton = true;
    $scope.disabledBackButton = true;
    $scope.quizFinished = false;


    //Called when the user clicks one of the answers on the quiz-view page.
    $scope.selectAnswer = function(selectedAnswer){
        userAnswers[currentQuestionIndex] = {answer: selectedAnswer, isCorrect: (selectedAnswer==generatedQuiz.questions[currentQuestionIndex].correctAnswer)};
        $scope.userAnswer = selectedAnswer;
        $scope.disabledNextButton = false;
    }

    $scope.nextQuestion = function(){
        currentQuestionIndex++;
        updateQuestion();
        $scope.userAnswer = -1;
        $scope.disabledNextButton = true;
        $scope.disabledBackButton = false;
    }
    $scope.previousQuestion = function(){
        currentQuestionIndex--;
        updateQuestion();
        $scope.userAnswer = userAnswers[currentQuestionIndex].answer;
        $scope.disabledNextButton = false;
        $scope.disabledBackButton = (currentQuestionIndex==0);
    }


    //===== FUNCTIONS =====\\
    //Updates the question/answer fields with the current question
    function updateQuestion(){
        if(currentQuestionIndex>=0){
            if(currentQuestionIndex<10){
                $scope.currentQuestion = generatedQuiz.questions[currentQuestionIndex];
            }else{
                $scope.quizFinished = true;
                calculateFinalScore();
            }
        }
    }

    function calculateFinalScore(){
        var successMessage = "You have successfully passed the test. You are now a certified scholar in '"+$scope.quizTitle+"'!!!";
        var failedMessage = "Unfortunately you did not pass the test. Please try again later!";
        var successColor = "#5cb85c";
        var failureColor = "#d9534f";
        var successImage = "images/successfullTest.png";
        var failureImage = "images/failedTest.jpg";

        $scope.finalScore = 0;

        for(var i=0; i<userAnswers.length; i++){
            $scope.finalScore += (userAnswers[i].isCorrect)?1:0;
        }

        if($scope.finalScore<8){//Failed test
            $scope.finalScoreCss     = failureColor;
            $scope.finalScoreImage   = failureImage;
            $scope.finalScoreMessage = failedMessage;
        }else{//Success
            $scope.finalScoreCss     = successColor;
            $scope.finalScoreImage   = successImage;
            $scope.finalScoreMessage = successMessage;
        }

        //persist the information about this attempt
        var user = loginService.getLoggedUser();

        var quizTries = null;
        for(i=0; i<user.quizTries.length; i++){
            if(user.quizTries[i].quizId == $rootScope.generatedQuiz.id){
                quizTries = user.quizTries[i];

                quizTries.numberOfTries = parseInt(quizTries.numberOfTries) + 1;
                var maxScore = parseInt(quizTries.maxScore.split("/")[0]);

                if (maxScore < $scope.finalScore){
                    quizTries.maxScore = $scope.finalScore +"/10";
                }
                break;
            }
        }

        if (quizTries == null){
            user.quizTries.push({"quizId" : $rootScope.generatedQuiz.id,"numberOfTries":1,"maxScore": ($scope.finalScore +"/10")});
        }

        //persits the result to current user
        storageService.setUser(user, function(){
                    
            //save the results to the current user
            loginService.login(user);

        });

     }
});