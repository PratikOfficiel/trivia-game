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