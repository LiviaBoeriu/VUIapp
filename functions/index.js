'use strict';


// Import the Dialogflow module and response creation dependencies
// from the Actions on Google client library.
const {dialogflow} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({
    debug: true,
  });

app.intent('Game', (conv) => {
  conv.ask("Ok, lets play two truths one lie game. Haha, kidding, you are going to do most of the work. Each of you think of of three statements out of which one is wrong. Then say correct or incorrect when the other person tries to guess.");
});

app.intent('FirstStatement', (conv) => {

});

app.intent('Correct', (conv) => {
  conv.ask('Yey, that was a good one! Would you like to play another round?');
});

app.intent('Incorrect', (conv) => {
  conv.ask('Awww, not this time around. Would you like to try again?');
});

app.intent('Correct try again', (conv) => {
  conv.followup('tryagain');
});
  
// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app)