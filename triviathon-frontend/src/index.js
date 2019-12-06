const USERS_URL = "http://localhost:3000/users"
const ANSWERS_URL = "http://localhost:3000/answers"
const form = document.getElementById('login-form')

// main function
function main() {
  document.addEventListener('DOMContentLoaded', () => { 
    // render all users & scores in left sidebar
    renderCarousel()
    welcomeMessage()
    getAllUsers()
    loginHandler()
  })
}

// user login functions
function loginHandler() {
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    let user = grabUserData(e)
    e.target.reset()
    loginUser(user)
  })
}

function loginUser(user) {
  const configObj = postUser(user)
  fetch(USERS_URL, configObj)
  .then(resp => resp.json())
  .then(user =>  {renderUserInfo(user)
    })
  hideForm()
  clearWelcome()
  startGame()
}

function postUser(user) {
  const name = user.username
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      username: name
    })
  }
}

function grabUserData(e) {
  return {username: e.target.children[1].value} 
}

function renderUserInfo(user) {
  const infosec = document.querySelector('.user-info')
  infosec.innerHTML = `<span data-id= ${user.id}>
                        <p>Name: ${user.username}</p>
                        <label>Total Score:<p id="current-score">${user.score}</p></label><br>
                        <label>Total Attempts:<p>${user.answers.length}</p></label>
                        <br>
                        <button id="exit-bttn"> Log Out </button>
                        </span>
                        `

                        let exitForm = document.getElementById('exit-bttn')
                        exitForm.addEventListener('click', () => logOut());
}

function logOut(){
return window.location.reload();//welcomeMessage()
}

// user ranking functions
function getAllUsers() {
  fetch(USERS_URL)
  .then(resp => resp.json())
  .then(users => renderUsers(users))
}

function renderUsers(users) {
  const userList = document.querySelector('ul')
  userList.innerHTML = " "
  users.sort(function(a,b) {
    return b.score - a.score
  })

  const topUsers = users.slice(0, 10) 
  topUsers.forEach(user => listUser(user))
}

function listUser(user) {
  const userList = document.querySelector('ul')
  const userItem = document.createElement('li')
  userItem.innerText =`${user.username}   ${user.score}`
  userList.appendChild(userItem) 
}

function hideForm() {
  const loginForm = document.querySelector('#login-form')
  loginForm.style.visibility = "hidden"
}

// q&a functions
function renderQuestion(questionObj) {
  const inner = document.querySelector('#question-slides')
  const slide = document.createElement('div')
  slide.className = 'carousel-item'
  const answerChoices = [...questionObj.incorrect_answers];
  questionObj.answerIndex = Math.floor(Math.random() * 3);
  answerChoices.splice(
        questionObj.answerIndex,
        0,
        questionObj.correct_answer
      )
    
  const question_content = document.createElement('h3')
  question_content.innerHTML = questionObj.question

  const question_info = document.createElement('p')
  question_info.className = 'question-stats'
  question_info.innerHTML= `${questionObj.category}     Difficulty: ${questionObj.difficulty}`

  const status = document.createElement('div')
  
  slide.append(question_info, question_content)
  slide.insertAdjacentHTML('beforeend', answerFormContent(answerChoices))
  slide.appendChild(status)
  inner.appendChild(slide)

  
  slide.addEventListener('click',() => handelSelection(questionObj))

  
  function handelSelection(questionObj){
    const score = document.querySelector('#round-score')
    const clickEl = event.target
    const inputs = slide.getElementsByClassName('answer-btn')
    let pointValue
    let cleanAns = questionObj.correct_answer.replace(/&#039;/, "'")
    cleanAns = cleanAns.replace(/&euml;/, 'ë')
    cleanAns = cleanAns.replace(/&eacute;/, 'é')
    cleanAns = cleanAns.replace(/&quot;/, '"')
    cleanAns = cleanAns.replace(/&quot;/, '"')


    switch(questionObj.difficulty) {
      case "easy":
        pointValue = 1;
        break;
      case "medium":
        pointValue = 3;
        break;
      case "hard":
        pointValue = 5;
    }
    if(clickEl.tagName === 'INPUT'){
      const userChoice = clickEl.nextElementSibling.innerHTML
      for(let input of inputs) {
        input.disabled = true
      }
      if(userChoice == cleanAns){
       status.innerHTML = '<br><h4 class= "correct">CORRECT!</h4>'
       score.innerText = parseInt(score.innerText) + pointValue
       createAnswer(question= questionObj.question, correct= true, content= userChoice)
          }else{
            console.log(userChoice, cleanAns)
        status.innerHTML = '<br><h4 class= "wrong">WRONG!</h4>'
        createAnswer(question= questionObj.question, correct= false, content= userChoice)
      }
    }
  }

  function createAnswer(question, correct, content) {
    const configObj = postAnswer(question, correct, content)
    fetch(ANSWERS_URL, configObj)
    .then(resp => resp.json())
    .then(answer => renderCorrectAnswer(answer))
    .catch(err => console.log(err.message))
  }
}

function answerFormContent(answerChoices) {
  return `
    <div id="answer-form"><br>
    <input class="answer-btn" type="radio" name="answer" value=${answerChoices[0]}> <label>${answerChoices[0]}</label><br>
    <input class="answer-btn" type="radio" name="answer" value=${answerChoices[1]}> <label>${answerChoices[1]}</label><br>
    <input class="answer-btn" type="radio" name="answer" value=${answerChoices[2]}> <label>${answerChoices[2]}</label><br>
    <input class="answer-btn" type="radio" name="answer" value=${answerChoices[3]}> <label>${answerChoices[3]}</label><br>
    </div>`
}

function postAnswer(question, correct, content) {
  const span = document.querySelector('span')
  const userId = span.dataset.id
  return {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      question: question,
      correct: correct,
      user_id: userId,
      content: content
    })
  }
}

function renderCorrectAnswers(user) {
  user.answers.forEach(answer => renderCorrectAnswer(answer))
}

function renderCorrectAnswer(answer) {
  const answerDiv = document.querySelector('.answer-div')
  const answerHead = document.getElementById('answer-head')
  answerHead.innerText = 'Questions Answered'
  answerHead.style.color= '#ffd800'
  const answerList = document.createElement('ul')
  const singleAnswer = document.createElement('li')
  singleAnswer.innerHTML = `${answer.question} ${answer.content}`
  if(answer.correct) { singleAnswer.style.color= 'cyan' }
  else { singleAnswer.style.color= '#f00030'}
  answerList.appendChild(singleAnswer)
  answerDiv.append(answerList)
}

function addQuestions(allQuestions) {
  allQuestions.results.forEach(questionObj => renderQuestion(questionObj))
  finishMessage()
}
  
function getQuestions(categoryID) {
  fetch(`https://opentdb.com/api.php?amount=13&category=${categoryID}&type=multiple`)
  .then(resp => resp.json())
  .then(allQuestions => addQuestions(allQuestions))
  .catch(err => console.log(err.message))
}

// message functions
function welcomeMessage() {
  let carouselMsg = document.getElementById('carousel-msg')
  let welcomeMsg = document.createElement('h3')
  welcomeMsg.setAttribute('id', 'mid-header')
  welcomeMsg.innerHTML = 'Welcome! <br>Please Login to Play'
  carouselMsg.append(welcomeMsg)
}

function readyMessage() {
  let carouselActive = document.querySelector('.active')
  carouselActive.innerHTML = ''
  startMsg = document.createElement('h3')
  startMsg.innerHTML = `<br><br>You have 10 seconds to answer each question
                        GET READY...<br>GET SET...<br>GO!!!`
  carouselActive.append(startMsg)
}



function finishMessage() {
  const inner = document.querySelector('#question-slides')
  const slide = document.createElement('div')
  slide.className = 'carousel-item'
  slide.innerHTML = `<h3>Congratulations, You Have Reached The Finish Line!!!</h3> <br> <button id= "submit-score"> Submit Your Score </button>`
  inner.appendChild(slide)

  slide.addEventListener('click', () => {
    const span = document.querySelector('span')
    const userId = span.dataset.id
    if (event.target.id === 'submit-score') {
      updateScore(userId)
      startGame()
    }
  })
}

function patchScore() {
  const score = document.querySelector('#round-score')
  const currentScore = document.getElementById('current-score')
  const newScore = parseInt(score.innerText) + parseInt(currentScore.innerText)
  return {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({score: newScore})
  }
}

function updateScore(userId) {
  reqObj = patchScore()
  fetch(`${USERS_URL}/${userId}`, reqObj)
  .then(resp => resp.json())
  .then(user => renderUserInfo(user))
}

// restart game functions
function clearWelcome() {
  let carouselMsg = document.getElementById('carousel-msg')
  carouselMsg.removeChild(carouselMsg.lastElementChild)
}

function startGame() {
  let carouselActive = document.querySelector('.active')
  carouselActive.innerHTML = ''
  const categorySlide = document.createElement('div')
  categorySlide.id = 'first-slide'

  const categoryBar = document.createElement('div')
  categoryBar.className="navbar"
  categoryBar.innerHTML = categoryBarContent()

  categoryBar.addEventListener('click', () => {
    let carouselActive = document.querySelector('.active')
    if (event.target.className === 'category-btn') {
      let categoryId = event.target.dataset.id
      categorySlide.innerHTML = ''
      readyMessage()
      getQuestions(categoryId)
    }
  })

  const gameStart = document.createElement('h2')
  gameStart.className='game-inst'
  gameStart.innerText = 'Choose a category to start'

  categorySlide.append(categoryBar, gameStart)
  carouselActive.appendChild(categorySlide)
}

function categoryBarContent() {
  return `
  <button class="category-btn" data-id= 9>General</button>
  <button class="category-btn" data-id= 10>Books</button>
  <button class="category-btn" data-id= 11>Movies</button>
  <button class="category-btn" data-id= 22>Geography</button>
  <button class="category-btn" data-id= 23>History</button>
  <button class="category-btn" data-id= 13>Theatre</button>`
}

function renderCarousel() {
  const middleColumn = document.querySelector('#game')
  middleColumn.innerHTML = middleColumnContent()
}

function middleColumnContent() {
  return `
    <div id="questions-carousel" class="carousel-slide" data-ride="carousel" data-wrap="false" data-pause="false" data-interval="5000">
    <div class="carousel-inner">
    <div id="carousel-msg" class="carousel-item active" data-interval="200">
    </div>
    <div id="question-slides"></div>
    </div>
    <div id="carousel-footer">
    <h2>Round Score:</h2>
    <h2 id="round-score">0</h2>
    </div>
    </div>`
}

function clearCarousel() {
  const middleColumn = document.querySelector('#game')
  middleColumn.innerHTML = ''
}

main()
