const { text } = require("express");

const socket = io();
const urlSearchParams = new URLSearchParams(window.location.search);
const playerName = urlSearchParams.get("playerName");
const room = urlSearchParams.get("room");

const mainHeadingTemplate = document.querySelector(
  "#main-heading-template"
).innerHTML;

const welcomeHeadingHTML = Handlebars.compile(mainHeadingTemplate);

document.querySelector("main").insertAdjacentHTML(
  "afterBegin",
  welcomeHeadingHTML({
    playerName,
  })
);

socket.emit("join", { playerName, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
}
);

socket.on("message", ({playerName, text, createdAt})=> {

  const chatMessages = document.querySelector(".chat__messages");
  const messageTemplate = document.querySelector("#message-template").innerHTML;

  const template = Handlebars.compile(messageTemplate)

  const html = template({
    playerName,
    text,
    createdAt: moment(createdAt).format("h:mm a")
  })

  chatMessages.insertAdjacentHTML("afterbegin",html);

})

socket.on("room", ({room, players})=> {

  const gameInfo = document.querySelector(".game-info");

  const sidebarTemplate = document.querySelector('#game-info-template').innerHTML;

  const template = Handlebars.compile(sidebarTemplate);

  const html = template({
    room,
    players
  })

  gameInfo.innerHTML = html;
})

const chatForm = document.querySelector(".chat__form");

chatForm.addEventListener("submit",(event)=>{
  event.preventDefault();

  const chatInput = document.querySelector(".chat__message");
  const chatButton = document.querySelector(".chat__submit-btn");

  chatButton.setAttribute("disabled","disabled");

  const message = event.target.elements.message.value;

  socket.emit("sendMessage",message, (err)=> {

    chatButton.removeAttribute("disabled");
    chatInput.value = "";
    chatInput.focus();

    if (err) return alert(err)
  })

})

const triviaQuestionButton = document.querySelector('.trivia__question-btn')
triviaQuestionButton.addEventListener('click',()=> {
  socket.emit('getQuestion',null,(err)=>{
    if (err) return alert(err)
  })
})

const decodeHTMLEntities = (text) => {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  return textArea.value;
};

socket.on("question", ({playerName, question, answers, createdAt})=> {

  console.log(question);
  console.log(answers);
  const triviaForm = document.querySelector(".trivia__form");
  const triviaQuestion = document.querySelector(".trivia__question");
  const triviaAnswers = document.querySelector(".trivia__answers");
  const triviaQuestionBtn = document.querySelector(".trivia__question-btn");
  const triviaFormSubmitBtn = triviaForm.querySelector(".trivia__submit-btn");

  const triviaQuestionTemplate = document.querySelector("#trivia-question-template").innerHTML;


  triviaQuestion.innerHTML=""
  triviaAnswers.innerHTML =""

  triviaQuestionBtn.setAttribute("disabled", "disabled");
  triviaFormSubmitBtn.removeAttribute("disabled");

  const template = Handlebars.compile(triviaQuestionTemplate);

  const html = template({
    playerName,
    createdAt: moment(createdAt).format("h:mm a"),
    question: decodeHTMLEntities(question),
    answers
  })

  triviaQuestion.insertAdjacentHTML('beforeend',html);
})

const triviaForm = document.querySelector(".trivia__form");

triviaForm.addEventListener("submit",(event)=>{

  event.preventDefault();

  const triviaFormInputAnswer = document.querySelector(".trivia__answer");
  const triviaSubmitBtn = document.querySelector(".trivia__submit-btn");

  triviaSubmitBtn.setAttribute("disabled", "disabled");

  const answer = event.target.elements.answer.value;

  socket.emit("sendAnswer", answer, (err)=>{
    triviaFormInputAnswer.value = "";
    triviaFormInputAnswer.focus();

    if(err) return alert(err)
  })
})

socket.on("answer",({playerName, text, createdAt, isRoundOver})=> {

  const triviaAnswers = document.querySelector(".trivia__answers");
  const triviaRevealAnswerButton = document.querySelector(".trivia__answer-btn");

  const messageTemplate = document.querySelector("#message-template").innerHTML;

  const template = Handlebars.compile(messageTemplate)

  const html = template({
    playerName,
    text,
    createdAt: moment(createdAt).format("h:mm a")
  })

  triviaAnswers.insertAdjacentHTML('afterBegin', html);

  if (isRoundOver) {
    triviaRevealAnswerButton.removeAttribute("disabled");
  }
})

const triviaRevealAnswerBtn = document.querySelector(".trivia__answer-btn")

triviaRevealAnswerBtn.addEventListener("click",()=> {
  socket.emit("getAnswer", null, (err)=> {
    if(err) return alert(err)
  })
});

socket.on("correctAnswer", ({text})=> {
  const triviaAnswers = document.querySelector(".trivia__answers");
  const triviaQuestionBtn = document.querySelector(".trivia__question-btn");
  const triviaRevealAnswerBtn = document.querySelector(".trivia__answer-btn");

  const triviaFormSubmitBtn = document.querySelector(".trivia__submit-btn");

  const answerTemplate = document.querySelector("#trivia-answer-template");

  const template = Handlebars.compile(answerTemplate);

  const html = template({
    text
  })

  triviaAnswers.insertAdjacentHTML("afterbegin",html);

  triviaQuestionBtn.removeAttribute("disabled");
  triviaRevealAnswerBtn.setAttribute("disabled", "disabled");
  triviaFormSubmitBtn.removeAttribute("disabled");
})