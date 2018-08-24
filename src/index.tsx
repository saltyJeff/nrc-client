//from head tags
declare var firebaseui: any
declare var firebase: any

import State from './AppState'
// FirebaseUI config.
var uiConfig = {
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
        signInSuccessWithAuthResult: () => false
    },
    signInFlow: 'popup'
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

firebase.auth().onAuthStateChanged((user) => {
    if(user) {
        user.getIdToken().then(State.startNrc)
    }
    return false
})