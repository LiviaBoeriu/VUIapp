'use strict';


// Import the Dialogflow module and response creation dependencies
// from the Actions on Google client library.
const {
  dialogflow,
  Permission,
  Suggestions,
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({
    debug: true,
  });

app.intent('deepLink', (conv) => {
  conv.ask("Good morning");
});

app.intent('Stuff', (conv) => {
  conv.ask("Stuffers");
});

app.intent('Game enter', (conv) => {
  const name = conv.user.storage.userName;
 if (!name) {
   // Asks the user's permission to know their name, for personalization.
   conv.ask(new Permission({
     context: 'Hi there, to get to know you better',
     permissions: 'NAME',
   }));
 } else {
   conv.ask(`Hi again, ${name}. What's your favorite color?`);
 }
});

// Handle the Dialogflow intent named 'actions_intent_PERMISSION'. If user
// agreed to PERMISSION prompt, then boolean value 'permissionGranted' is true.
app.intent('game_intent_PERMISSION', (conv, params, permissionGranted) => {
  if (!permissionGranted) {
    // If the user denied our request, go ahead with the conversation.
    conv.ask(`I am sorry. You need to give your name to be able to play`);
  } else {
    // If the user accepted our request, store their name in
    // the 'conv.user.storage' object for future conversations.
    conv.user.storage.userName = conv.user.name.display;
    conv.ask(`Thanks, ${conv.user.storage.userName}. ` +
      `Are you ready to begin?`);
    conv.ask(new Suggestions('Yes', 'No'));
  }
});


// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);