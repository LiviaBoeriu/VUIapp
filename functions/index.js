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
  conv.ask("Ok, lets play two truths one lie. Haha, kidding! You are going to do most of the work. Each of you should think of three statements out of which one is false.");
  conv.ask("After the other person tries to guess, just say correct after they got the right answer. Are you ready to begin?");
});

app.intent('GetStatements', (conv, params) => {
  conv.user.storage.firstStatement = conv.parameters.first;
  var firstStatement = conv.user.storage.firstStatement;

  conv.user.storage.secondStatement = conv.parameters.second;
  var secondStatement = conv.user.storage.secondStatement;

  conv.user.storage.thirdStatement = conv.parameters.third;
  var thirdStatement = conv.user.storage.thirdStatement;

  conv.ask(`Super, now you have to guess which is the false statement!`);
});


app.intent('The Answer Is', (conv) => {
  conv.followup(`what-do-you-think`);
});

app.intent('Which is correct', (conv) => {
  conv.ask('Is that the correct one?');
});

app.intent('Correct', (conv) => {
  conv.ask('Do you want to try again?');
});

app.intent('Incorrect', (conv) => {
  conv.ask('Awww, not this time around. Would you like to try again?');
});

app.intent('Try again', (conv) => {
  conv.followup(`get-statements`);
});

app.intent('End Game', (conv) => {
  conv.ask('Ok, no problem! Let me know if you want to try the conversation mode by sayind: conversation, or if you want to quit.')
});

app.intent('Test try again', (conv) => {
  conv.followup(`tryagain`);
});
  
// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app)