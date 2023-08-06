let points = parseInt(localStorage.getItem("points")) || 0;
let streak = parseInt(localStorage.getItem("streak")) || 1;
let currentDate = new Date();
let lastPlayedDate = new Date(localStorage.getItem("lastPlayedDate"));
let currentQuestion = currentDate.getDate() * 5;
const answers = [
  1, 1, 4, 0, 2, 3, 3, 1, 2, 4, 0, 2, 0, 4, 3, 0, 0, 1, 2, 1, 2, 1, 0, 1, 2, 3,
  2, 2, 1, 3, 2, 1, 2, 4, 3, 2, 3, 2, 1, 0, 0, 3, 2, 1, 2, 2, 0, 4, 2, 3, 3, 2,
  0, 3, 2, 2, 2, 0, 4, 2, 1, 4, 4, 1, 0, 0, 0, 3, 2, 2, 2, 3, 3, 4, 0, 2, 2, 4,
  0, 0, 4, 4, 2, 0, 2, 1, 4, 0, 0, 4, 2, 0, 2, 2, 1, 4, 3, 4, 1, 2, 1, 1, 2, 1,
  3, 4,
];

const dialog = document.getElementById("answer-dialog");
const pointsElement = document.getElementById("points");
const streakElement = document.getElementById("streak");
const questionImage = document.getElementById("question-image");
const questionNumber = document.getElementById("question-number");
const currentDateElement = document.getElementById("date");

pointsElement.textContent = points;
streakElement.textContent = streak;
currentDateElement.textContent = currentDate.toLocaleDateString(
  navigator.language,
  {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
);

if (lastPlayedDate && currentDate - lastPlayedDate > 48 * 60 * 60 * 1000) {
  streak = 1;
} else if (lastPlayedDate?.getDate() !== currentDate.getDate()) {
  streak += 1;
  localStorage.setItem("streak", streak);
  localStorage.setItem("lastPlayedDate", currentDate.toISOString());
  streakElement.textContent = streak;
}

questionImage.src = `images/${currentQuestion}.png`;
questionNumber.textContent = (currentQuestion % 5) + 1;

let firstTime = true;

function submitAnswer(answer) {
  const correctAnswer = answers[currentQuestion];
  const messageElement = dialog.querySelector(".message");
  const correctAnswerChar = "ABCDE".charAt(correctAnswer);

  document.getElementById("correct-answer").innerText = correctAnswerChar;

  if (answer === correctAnswer) {
    dialog.classList.remove("incorrect");
    dialog.classList.add("correct");
    messageElement.textContent = "Correct!";

    if (firstTime) {
      points += 2;
      firstTime = false;
      localStorage.setItem("points", points);
      pointsElement.textContent = points;
    }
  } else {
    dialog.classList.remove("correct");
    dialog.classList.add("incorrect");
    messageElement.textContent = "Incorrect!";

    firstTime = false;
    points -= 1;
    localStorage.setItem("points", points);
    pointsElement.textContent = points;
  }
  dialog.showModal();
}

function nextQuestion() {
  if (currentQuestion === currentDate.getDate() * 5 + 4) return;
  dialog.close();

  firstTime = true;
  currentQuestion += 1;
  questionImage.src = `images/${currentQuestion}.png`;
  questionNumber.textContent = (currentQuestion % 5) + 1;
  document.getElementById("clear-button").click();
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then((res) => console.log("service worker registered"))
      .catch((err) => console.log("service worker not registered", err));
  });
}
