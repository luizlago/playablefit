app.controller('ViewerController', function ($rootScope, $scope, $http) {
    $scope.user = null;

    var uiConfig = {
        'callbacks': {
            // Called when the user has been successfully signed in.
            'signInSuccess': function (user, credential, redirectUrl) {
                $scope.user = user;
                $scope.user.credential = credential;
                handleSignedInUser($scope.user);
                
                $scope.$apply();
                return false;
            }
        },
        'signInFlow': 'popup',
        'signInOptions': [
            {
                provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                scopes: [
                    'https://www.googleapis.com/auth/plus.login',
                    'https://www.googleapis.com/auth/fitness.activity.read',
                    'https://www.googleapis.com/auth/fitness.body.read',
                    'https://www.googleapis.com/auth/fitness.location.read',
                    'https://www.googleapis.com/auth/fitness.nutrition.read'
                ]
            }
        ],
        // Terms of service url.
        'tosUrl': 'https://www.google.com'
    };

    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    // Keep track of the currently signed in user.
    var currentUid = null;

    /**
     * Displays the UI for a signed in user.
     */
    var handleSignedInUser = function (user) {
        $scope.user = user;
        currentUid = user.uid;
        console.log($scope.user);

        $scope.$apply();
    };


    /**
     * Displays the UI for a signed out user.
     */
    $scope.handleSignedOutUser = function () {
        ui.start('#user-loggin', uiConfig);
        firebase.auth().signOut();
        $scope.user = null;
    };

    // Listen to change in auth state so it displays the correct UI for when
    // the user is signed in or not.
    firebase.auth().onAuthStateChanged(function (user) {
        // The observer is also triggered when the user's token has expired and is
        // automatically refreshed. In that case, the user hasn't changed so we should
        // not update the UI.
        if (user && user.uid == currentUid) {
            return;
        }
        user ? handleSignedInUser(user) : $scope.handleSignedOutUser();
    });

    $scope.showSettingsMenu = function($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
    };

    $scope.fitListData = function(){
        console.log('called');
        $scope.user.getToken().then(function(accessToken) {
            console.log($scope.user.credential.accessToken);
            var req = {
                method: 'POST',
                url: 'http://localhost:8000/getListData',
                headers: {
                'Content-Type': 'application/json'
                },
                data: { userId: $scope.user.uid, accessToken: $scope.user.credential.accessToken }
            }

            $http(req).then(function(response){
                console.log(response);
            }, function(x){
                console.log(x);
            });
        });
    };
});
