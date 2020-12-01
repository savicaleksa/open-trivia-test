// https://opentdb.com/api.php?amount=10&category=15&difficulty=easy&type=multiple

//start
const numSel = document.getElementById('numSel');
const difSel = document.getElementById('difSel');
const startBtn = document.getElementById('start');
//quiz
const questionEl = document.getElementById('question');
const radios = document.querySelectorAll('input[type=radio]');
const answerEls = document.querySelectorAll('.answer');
const nextBtn = document.getElementById('next');
const currentQuestionField = document.getElementById('currentQuestion');
const smallRes = document.getElementById('small-res');
//end
const scoreField = document.getElementById('scoreField');
const restartBtn = document.getElementById('restart');
//global
const screens = document.querySelectorAll('.screen');
var num;
var correctIndex;
var checkedIndex;
var result;
//var screen = 0;
var score = 0;
var qCounter = 0;

function decodeHtml(html) {
  let txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

async function startQuiz() {
  num = numSel.value;
  let dif = difSel.value;
  let apiURL = `https://opentdb.com/api.php?amount=${num}&category=15&difficulty=${dif}&type=multiple`;
  //api variables
  let response = await fetch(apiURL);
  let resp = await response.json();
  result = resp.results;
  //console.log(result);

  updateQuestion();
}

function updateQuestion() {
  let questionObj = result[qCounter];
  let correctAns = questionObj.correct_answer;
  //console.log(correctAns);
  correctIndex = Math.floor(Math.random() * 4);
  let incorrectAns = questionObj.incorrect_answers;

  //changes
  questionEl.innerText = `${qCounter + 1}. ${decodeHtml(questionObj.question)}`;

  answerEls[correctIndex].innerText = correctAns;
  for (let i = 0, j = 0; i < 4; ) {
    if (i === correctIndex) {
      i++;
    } else {
      answerEls[i].innerText = decodeHtml(incorrectAns[j]);
      i++;
      j++;
    }
  }

  currentQuestionField.innerText = `${qCounter + 1} / ${num}`;
  //selects and check

  //check(checkedIndex, correctIndex);
}
function check() {
  for (let i = 0; i < 4; i++) {
    if (radios[i].checked) {
      checkedIndex = i;
      break;
    }
  }
  if (checkedIndex === correctIndex) {
    score++;
  }

  for (let i = 0; i < 4; i++) {
    radios[i].checked = false;
  }

  scoreField.innerText = `${score} / ${num}`;
}

function restart() {
  screen = 0;
  score = 0;
  qCounter = 0;
}

function changeScreen(k) {
  screens.forEach((div) => {
    div.classList.add('disabled');
  });
  screens[k].classList.remove('disabled');
}

startBtn.addEventListener('click', () => {
  screen = 1;
  startQuiz();
  changeScreen(1);
});

nextBtn.addEventListener('click', () => {
  let ifCheck;
  for (let i = 0; i < 4; i++) {
    if (radios[i].checked) {
      ifCheck = i;
      break;
    }
  }
  if (ifCheck == null) {
    return;
  } else {
    if (qCounter < num - 1) {
      qCounter++;
      check();
      updateQuestion();
      //console.log(qCounter);
    } else {
      check();
      changeScreen(2);
    }
  }
});
restartBtn.addEventListener('click', () => {
  restart();
  changeScreen(0);
});
smallRes.addEventListener('click', () => {
  restart();
  changeScreen(0);
});
