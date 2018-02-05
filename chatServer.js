/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Modified by : Jennifer Ding (jd953) Lab 1
Closely based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function(){// we wait until the client has loaded and contacted us that it is ready to go.

  socket.emit('answer',"Hey, Hello I am BroBot a simple chat bot that can help make your dates great."); //We start with the introduction;
  setTimeout(timedQuestion, 2500, socket,"What is your Name?"); // Wait a moment and respond with a question.

});
  socket.on('message', (data)=>{ // If we get a new message from the client we process it;
        console.log(data);
        questionNum= bot(data,socket,questionNum);	// run the bot function with the new message
      });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data,socket,questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;

/// These are the main statments that make up the conversation.
  if (questionNum == 0) {
  answer= 'Sup ' + input + ' :-)';// output response
  waitTime =2000;
  question = 'Congrats on getting a date! Which number is this?'; // load next question
  }
  else if (questionNum == 1) {
  answer= 'Really? Date number ' + input + ' is a big one!';// output response
  waitTime =2000;
  question = 'Where are you going?'; // load next question
  }
  else if (questionNum == 2) {
  answer= ' Sweeeeeet. I hear ' + input+' is a great spot.';
  waitTime =2000;
  question = "Now all you need is a good line. How nerdy are you on a scale of 1 to 10?" // load next question
  }
  else if (questionNum == 3) {
  if (input > 5){
  answer="Nerdy and flirty! I've got a good one for ya: Can I be Windows and crash at your place tonight?"
  }
  else{
  answer="So you're a cool cat. I've got a line for you: Are you a camera? Everytime I look at you, I smile."
  }
  waitTime = 2000;
  question = 'Do you need another line?'; // load next question
  }
  else if (questionNum == 4) {
    if(input.toLowerCase()==='yes'|| input===1){
      answer = "BroBot's got your back: Are you a 90 degree angle? Cuz you're lookin' right.";
      waitTime =2000;
      question = "Are you feeling ready?";
    }
    else if(input.toLowerCase()==='no'|| input===0){
        //socket.emit('changeFont','white');
        answer='YOU GOT THIS'
        question='Are you feeling ready now?';
        waitTime =0;
        //questionNum--; // Here we go back in the question number this can end up in a loop
    }else{
      answer=" I didn't catch that. Can you please answer with yes or no."
      question='';
      questionNum--;
      waitTime =0;
    }
  // load next question
  }
  else{
    if (input=='no'){
    answer = "Don't stress amigo. Have a great date!"
    }
    else{
    answer= 'Have a great date!';// output response
    }
    waitTime =0;
    question = '';
  }


/// We take the changed data and distribute it across the required objects.
  socket.emit('answer',answer);
  setTimeout(timedQuestion, waitTime,socket,question);
  return (questionNum+1);
}

function timedQuestion(socket,question) {
  if(question!=''){
  socket.emit('question',question);
}
  else{
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
