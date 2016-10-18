app.controller('ViewerController', function($rootScope, $scope) {
    $rootScope.user = null;

    /**
     * FirebaseUI initialization to be used in a Single Page application context.
     */
    // FirebaseUI config.
    var uiConfig = {
    'callbacks': {
        // Called when the user has been successfully signed in.
        'signInSuccess': function(user, credential, redirectUrl) {
        $rootScope.user = user;
        console.log($rootScope.user);
        handleSignedInUser();
        // Do not redirect.
        return false;
        }
    },
    // Opens IDP Providers sign-in flow in a popup.
    'signInFlow': 'popup',
    'signInOptions': [
        // TODO(developer): Remove the providers you don't need for your app.
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
        // {
        //   provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        //   scopes :[
        //     'public_profile',
        //     'email',
        //     'user_likes',
        //     'user_friends'
        //   ]
        // },
        //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        //firebase.auth.GithubAuthProvider.PROVIDER_ID,
        //firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    'tosUrl': 'https://www.google.com'
    };

    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    // Keep track of the currently signed in user.
    var currentUid = null;

    /**
     * Redirects to the FirebaseUI widget.
     */
    var signInWithRedirect = function() {
    window.location.assign('./views/signin');
    };


    /**
     * Open a popup with the FirebaseUI widget.
     */
    var signInWithPopup = function() {
    window.open('/widget', 'Sign In', 'width=985,height=735');
    };


    /**
     * Displays the UI for a signed in user.
     */
    var handleSignedInUser = function() {
    currentUid = $rootScope.user.uid;
    document.getElementById('user-signed-in').style.display = 'block';
    document.getElementById('user-signed-out').style.display = 'none';
    document.getElementById('name').textContent = $rootScope.user.displayName;
    document.getElementById('email').textContent = $rootScope.user.email;
    if ($rootScope.user.photoURL){
        document.getElementById('photo').src = $rootScope.user.photoURL;
        document.getElementById('photo').style.display = 'block';
    } else {
        document.getElementById('photo').style.display = 'none';
    }
    };


    /**
     * Displays the UI for a signed out user.
     */
    var handleSignedOutUser = function() {
    document.getElementById('user-signed-in').style.display = 'none';
    document.getElementById('user-signed-out').style.display = 'block';
    ui.start('#firebaseui-container', uiConfig);
    //$rootScope.user = null;
    };

    // Listen to change in auth state so it displays the correct UI for when
    // the user is signed in or not.
    firebase.auth().onAuthStateChanged(function(user) {
    // The observer is also triggered when the user's token has expired and is
    // automatically refreshed. In that case, the user hasn't changed so we should
    // not update the UI.
    if ($rootScope.user && $rootScope.user.uid == currentUid) {
        return;
    }
    document.getElementById('loading').style.display = 'none';
    document.getElementById('loaded').style.display = 'block';
    $rootScope.user ? handleSignedInUser() : handleSignedOutUser();
    });


    /**
     * Initializes the app.
     */
    var initApp = function() {
    document.getElementById('sign-in-with-redirect').addEventListener(
        'click', signInWithRedirect);
    document.getElementById('sign-in-with-popup').addEventListener(
        'click', signInWithPopup);
    document.getElementById('sign-out').addEventListener('click', function() {
        firebase.auth().signOut();
    });
    document.getElementById('delete-account').addEventListener(
        'click', function() {
            console.log(firebase.auth().currentUser);
            firebase.auth().currentUser.delete();
        });
    };

    window.addEventListener('load', initApp);
});
