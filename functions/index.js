'use strict';


// Import the Dialogflow module and response creation dependencies
// from the Actions on Google client library.
const {
  dialogflow,
  Suggestions,
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({
    debug: true,
});

// Default welcome intent
app.intent('Default Welcome Intent', (conv) => {
  conv.ask(`Hello, I am here to enrich your conversations! What would you like to do? You can play a game, get a topic for conversation or go to the message board`);

  conv.ask(new Suggestions('Game'));
  conv.ask(new Suggestions('Conversation'));
  conv.ask(new Suggestions('Message Board'));
});

/*
  Start of section for the game functionality
  Path: Game enter > Get statements > Guess which is the false statement > Reveal if that is the correct choice > Choose whether to play another round or end
*/

// Game entry point
app.intent('Game: Enter', (conv) => {
  conv.close(`Ok, lets play two truths one lie. 
    Haha, kidding! You are going to do most of the work. 
    One of you should begin thinking of three statements out of which one is false. 
    When you have done that just say: Ok Google, tell Discloser we are done`);
});

// Initial get statements entry point [deprecated right now]
app.intent('Game: GetStatements original', (conv, params) => {
  conv.user.storage.firstStatement = conv.parameters.first;
  var firstStatement = conv.user.storage.firstStatement;

  conv.user.storage.secondStatement = conv.parameters.second;
  var secondStatement = conv.user.storage.secondStatement;

  conv.user.storage.thirdStatement = conv.parameters.third;
  var thirdStatement = conv.user.storage.thirdStatement;

  conv.ask(`Super, now you have to guess which is the false statement!`);

  conv.ask(new Suggestions('I think the false one is'));
  conv.ask(new Suggestions('I think the false one is'));
  conv.ask(new Suggestions('I think the false one is'));
});

// Try again round
app.intent('Game: GetStatements TryAgain', (conv, params) => {
  conv.user.storage.firstStatement = conv.parameters.first;
  var firstStatement = conv.user.storage.firstStatement;

  conv.user.storage.secondStatement = conv.parameters.second;
  var secondStatement = conv.user.storage.secondStatement;

  conv.user.storage.thirdStatement = conv.parameters.third;
  var thirdStatement = conv.user.storage.thirdStatement;

  conv.ask(`Awesome! Now you have to guess which is the false statement!`);
  
  conv.ask(new Suggestions('The first one'));
  conv.ask(new Suggestions('The second one'));
  conv.ask(new Suggestions('The third one'));
});

// What is the right answer entry point
app.intent('Game: TheAnswerIs', (conv) => {
  conv.followup(`what-do-you-think`);
});

// Verify if the guess is right
app.intent('Game: IsThatTheAnswer', (conv) => {
  conv.ask('Was that the correct guess?');

  conv.ask(new Suggestions('Yes, that is correct!'));
  conv.ask(new Suggestions('No, that is wrong!'));
});

// Intent for the correct guess
app.intent('Correct', (conv) => {
  const audioSound = 'https://actions.google.com/sounds/v1/cartoon/cartoon_cowbell.ogg';

  conv.ask(`<speak><audio src="${audioSound}"></audio> Yey! That was correct! Do you want to try again? </speak>`);

  conv.ask(new Suggestions('Yes'));
  conv.ask(new Suggestions('No'));
});

// Intent for the incorrect guess
app.intent('Incorrect', (conv) => {
  const audioSound = 'https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg';

  conv.ask(`<speak><audio src="${audioSound}"></audio> Oh no! That was not it! Do you want to play another round? </speak>`);
  
  conv.ask(new Suggestions('Yes'));
  conv.ask(new Suggestions('No'));
});

// Try again funnel from the correct guess
app.intent('Correct try again', (conv) => {
  conv.followup(`get-statements`);
});

// End of game after correct guess
app.intent('Correct end game', (conv) => {
  conv.ask('Ok, no problem! Let me know if you want to try the other modes, or if you want to quit.');

  
  conv.ask(new Suggestions('Conversation'));
  conv.ask(new Suggestions('Message Board'));
  conv.ask(new Suggestions('Quit'));
});

// Try again second funnel
app.intent('Game: TryAgainScope', (conv) => {
  conv.close(`Ok, that's awesome. I will give you some time to think of the three statements. When you are done just say: Ok Google, tell Discloser we are done!`);
});

// Try again funnel from the incorrect guess
app.intent('Incorrect try again', (conv) => {
  conv.followup(`get-statements`);
});

// End of game after incorrect guess
app.intent('Incorrect end game', (conv) => {
  conv.ask('Ok, no problem! Let me know if you want to try the conversation mode by saying: conversation, or if you want to quit.');

  conv.ask(new Suggestions('Conversation'));
  conv.ask(new Suggestions('Message Board'));
  conv.ask(new Suggestions('Quit'));
});

// Deep link connection for the game statements
app.intent('Game DeepLinkStatements', (conv) => {
  conv.followup(`deepLinkFunnel`);
});

/*
  End of section for the game functionality
*/


/*
  Start of section for the conversation functionality 
  Path: Conversation > Get question > Next question/ Repeat question > End Conversation
*/

// The conversation module takes conversation as invocation and returns a response asking the users to say a phase to begin
// The phase is "Give us a question".
app.intent('Conversation: Welcome', (conv) => {
  conv.ask("Hi guys, and welcome to self-disclosure conversation! Say: Give us a question to start. When you are done talking about the matter, just wake me up by saying: Ok google, ask ThisCloser for the next question.");
});

// The give us a question module is in the context of the Conversation module and it should give the users a 
// random low or high intimacy question and then standby for the "Next question" or "end" invocation.
app.intent('Conversation: GetQuestion', (conv) => {
  
  // The output command getting a question and asking the users
  // Missing: Wait for the invocation needed to continue. Right now it asked what the users are saying which it should not.
  conv.close(`${question.getQuestion()}`);
  question.updateQuestionPool();
});

// The next question Intent takes the user from the GetQuestion Intent through the next question scope and to the next question
// where a new queastion is asked.
app.intent('Conversation DeepLinkNextQuestion', (conv) => {

  conv.followup(`getNextQuestion`);
});

// app.intent('Conversation: NextQuestionScope', (conv) => {

//   conv.followup(`get-next-question-ask`);
// });

// A method for ending the conversation and return to app welcome intent
app.intent('Conversation: Cancel', (conv) => {

  conv.ask("Ending conversation! Would you like to try another module or would you like to quit?");

});

// The question object contains arrays of high and low intimacy questions. It stores them in a question pool.
// It includes the function getQuestion that returns a random question from the pool.
// Afterwards it updates the question pool so it does not ask the same question twice.
  var question = {
  
  // An array containing the pool of high intimacy questions
  highIntimacyQuestions: [
    "What is something your partner did today that made you happy?",
    "What was something that your partner did, that made you thankful this week?",
    "Would any of you do something differently today to make the day more enjoyable?",
    "If you could level up any aspect of yourself (i.e., strength, intelligence, charisma, etc.) but you had to decrease another aspect of yourself by the same amount, what aspects would you increase, and which would you decrease?",
    "Which of your partner's personality traits you do wish you also had to the same degree?",
    "When was the last time that you really felt like doing a difference for your local community or for the environment?",
    "What are the personal aspects that you would most like to improve, or that you are struggling to do something about at present, e.g. appearance, lack of knowledge, loneliness, temper etc?",
    "What kind of future are you aiming towards, working for, planning for - both personally, educationally and professionally?",
    "What are your problems and worries about your personality, what do you dislike most about yourself?",
    "What are your thoughts about your health, including any problems, worries, or concerns that you might have at present?",
    "For what in your life do you feel most grateful?",
    "If you could change anything about the way you were raised, what would it be?",
    "Take four minutes and tell your partner your life story in as much detail as possible.",
    "If you could wake up tomorrow having gained any one quality or ability, what would it be?",
    "Is there something that you’ve dreamed of doing for a long time? Why haven’t you done it?",
    "What is the greatest accomplishment of your life?",
    "What do you value most in a friendship?",
    "What is your most treasured memory?",
    "What is your most terrible memory?",
    "If you knew that in one year you would die suddenly, would you change anything about the way you are now living? Why?",
    "What does friendship mean to you?",
    "What roles do love and affection play in your life?",
    "How close and warm is your family? Do you feel your childhood was happier than most other people’s?",
    "How do you feel about your relationship with your mother?",
    "What, if anything, is too serious to be joked about?",
    "Your house, containing everything you own, catches fire. After saving your loved ones and pets, you have time to safely make a final dash to save any one item. What would it be? Why?",
    "Share a personal problem and ask your partner’s advice on how he or she might handle it. Also, ask your partner to reflect back to you how you seem to be feeling about the problem you have chosen."
  ],

  // An array containing the pool of low intimacy questions
  lowIntimacyQuestions: [
    "How do you find our current political situation?",
    "What would you guys change about this week?",
    "What do you guys like to do in your spare time at home at the present moment?",
    "What are your favorite song as for now?",
    "If you had absolutely free choice and no restrcitions, what is then the sport that you see yourself participating in?",
    "What was something that happened this week, that made you stop and ponder on it, or fascinated you?",
    "Debate time! What’s worse: Laundry or Dishes?",
    "Debate time! What is best: Money or Free Time?",
    "What are your favorite foods right now?",
    "Story time! Tell a story about a place you have travelled to that made an unforgettable impression on you.",
    "Debate time! What is more enjoyable: Big Party or Small Gathering?",
    "What do you guys think about the news this past week?",
    "Sory time! Tell a story about about a proud moment you have had in you educational life or work life.",
    "Would you like to be famous? In what way?",
    "Before making a telephone call, do you ever rehearse what you are going to say? Why?",
    "What would constitute a “perfect” day for you?",
    "When did you last sing to yourself? Or to someone else?",
    "Name five! Name five things you and your partner appear to have in common.",
    "Name five! Name five things you consider positive characteristics of your partner.",
    "Name five! Name five series or movies that you want to rewatch the most.",
    "Name five! Name five things that you are grateful for in your life."
  ],

  // A merged array containing all the questions for the conversation module
  getQuestionPool: function () {

    return question.highIntimacyQuestions.concat(question.lowIntimacyQuestions)
  },
  
  // A function that returns a random question from the merged array called questionPool
  getQuestion: function () {

    return question.getQuestionPool()[Math.round(Math.random() * question.getQuestionPool().length)];

  },

  // Updating the question pool to exclude the questions already asked
  updateQuestionPool: function () {

    question.getQuestionPool().splice(question.getQuestion());
  
  },

  // lastQuestion: this.getQuestion()

};

/*
  End of section for the conversation functionality
*/

/*
  Start of section for sandbox message module
*/

app.intent('Sandbox: MessageWelcome', (conv) => {
  conv.ask(`Welcome to the message sandbox. Here, you can leave messages for the other person, or enter a memory and later remember it!`);
  conv.ask(`For writing a memory say: enter message, and for relieving a memory say: relieve memory`);

  conv.ask(new Suggestions('Enter message'));
  conv.ask(new Suggestions('Relieve memory'));
});

app.intent('Sandbox: WriteMessage', (conv) => {
  if (conv.user.verification === 'VERIFIED') {
    conv.user.storage.message = conv.parameters.message;
    conv.ask(`Your message is ${conv.user.storage.message}`);
  } else {
    conv.close(`I can't store you message unfortunately because you are not signed in.`);
  }
});

app.intent('Sandbox: Relieve memory', (conv) => {
  if (conv.user.verification === 'VERIFIED') {
    conv.ask(`Your message still is ${conv.user.storage.message}`);
  } else {
    conv.close(`I can't store you message unfortunately because you are not signed in.`);
  }
});

/*
  End of section for sandbox message module
*/


// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app)