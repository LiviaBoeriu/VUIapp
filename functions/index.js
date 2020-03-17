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

app.intent('Default Welcome Intent', (conv) => {
  conv.ask("Hello");
});

app.intent('deepLink', (conv) => {
  conv.ask("Good morning");
});

app.intent('Stuff', (conv) => {
  conv.ask("Stuffers");
});
// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);