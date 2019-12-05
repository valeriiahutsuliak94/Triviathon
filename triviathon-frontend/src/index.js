const USERS_URL = "http://localhost:3000/users"
const ANSWERS_URL = "http://localhost:3000/answers"
const form = document.getElementById('login-form')

// main function
function main() {
  document.addEventListener('DOMContentLoaded', function(){ 
    // render all users & scores in left sidebar
    renderCarousel()
    welcomeMessage()
    getAllUsers()
    
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      let user = grabUserData(e)
      e.target.reset()
      loginUser(user)
    })
  })
}

// user login functions
function loginUser(user) {
    const name = user.username
    const configObj = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
      body: JSON.stringify({
        username: name
      })
    }

    fetch(USERS_URL, configObj)
    .then(resp => resp.json())
    .then(user =>  {renderUserInfo(user)
                  renderCorrectAnswers(user)
    })
    hideForm()
    clearWelcome()
    startGame()
}

function grabUserData(e) {
    return {username: e.target.children[1].value} 
}

function renderUserInfo(user) {
    const infosec = document.querySelector('.user-info')
    infosec.innerHTML = `<span data-id= ${user.id}>
                        <p>Name: ${user.username}</p>
                        <label>Total Score:<p id="current-score">${user.score}</p></label><br>
                        <label>Total Attempts:<p>${user.answers.length}</p></label>`
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
  users.sort(function(a,b){
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

function renderQuestion(questionObj) {
  console.log('-------------')
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
  question_info.innerText= `${questionObj.category}     Difficulty: ${questionObj.difficulty}`

  const status = document.createElement('div')
  
  slide.append(question_info, question_content)
  slide.insertAdjacentHTML('beforeend',
    `<div id="answer-form">
    <br>
    <input class="answer-btn" type="radio" name="answer" value=${answerChoices[0]}> <label>${answerChoices[0]}</label><br>
    <input class="answer-btn" type="radio" name="answer" value=${answerChoices[1]}> <label>${answerChoices[1]}</label><br>
    <input class="answer-btn" type="radio" name="answer" value=${answerChoices[2]}> <label>${answerChoices[2]}</label><br>
    <input class="answer-btn" type="radio" name="answer" value=${answerChoices[3]}> <label>${answerChoices[3]}</label><br>
    </div>`
  )
  slide.appendChild(status)
  inner.appendChild(slide)

  
  slide.addEventListener('click',() => handelSelection(questionObj))
  
  function handelSelection(questionObj){
    const score = document.querySelector('#round-score')
    const clickEl = event.target
    const inputs = slide.getElementsByClassName('answer-btn')
    let pointValue
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
      const userChoice = clickEl.nextElementSibling.innerText
      for(let input of inputs) {
        input.disabled = true
      }
      if(userChoice === questionObj.correct_answer){
       status.innerHTML = '<br><h4 class= "correct">CORRECT!</h4>'
       score.innerText = parseInt(score.innerText) + pointValue
       createAnswer(question= questionObj.question, correct= true, content= userChoice)
          }else{
        status.innerHTML = '<br><h4 class= "wrong">WRONG!</h4>'
        createAnswer(question= questionObj.question, correct= false, content= userChoice)
        
 
      }
    }
  }

  function createAnswer(question, correct, content) {
    const span = document.querySelector('span')
    const userId = span.dataset.id
    const configObj = {
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
    
    fetch(ANSWERS_URL, configObj)
    .then(resp => resp.json())
    .then(answer => renderCorrectAnswer(answer))
    .catch(err => console.log(err.message))
  }

}

function renderCorrectAnswer(answer) {
  const answerDiv = document.querySelector('.answer-div')
  const answerHead = document.getElementById('answer-head')
  answerHead.innerText = 'Previous Questions Answered'
  const answerList = document.createElement('ul')
  const singleAnswer = document.createElement('li')
  singleAnswer.innerHTML = `${answer.question} ${answer.content}`
  answerList.appendChild(singleAnswer)
  answerDiv.append(answerList)
}
  


function addQuestions(allQuestions) {

  allQuestions.results.forEach(questionObj => renderQuestion(questionObj))
  finishMessage()
}
  

function getQuestions(categoryID) {
  fetch(`https://opentdb.com/api.php?amount=10&category=${categoryID}&type=multiple`)
  .then(resp => resp.json())
  .then(allQuestions => addQuestions(allQuestions))
  .catch(err => console.log(err.message))
}

// message functions
function welcomeMessage() {
  let carouselMsg = document.getElementById('carousel-msg')
  let welcomeMsg = document.createElement('h3')
  welcomeMsg.setAttribute('id', 'mid-header')
  welcomeMsg.innerText = 'Welcome! Please Login to Continue'
  carouselMsg.append(welcomeMsg)
}

function readyMessage() {
  let carouselActive = document.querySelector('.active')
  carouselActive.innerHTML = ''
  startMsg = document.createElement('h3')
  startMsg.innerText = `You have 10 seconds to answer each question
                        GET READY...GET SET...`
  carouselActive.append(startMsg)
}

function finishMessage() {
  const inner = document.querySelector('#question-slides')
  const slide = document.createElement('div')
  slide.className = 'carousel-item'
  slide.innerHTML = `<h3>Congratulations!!!</h3> <br> <button id= "submit-score"> Submit Your Score </button>`
  inner.appendChild(slide)

  slide.addEventListener('click', () => {
    const score = document.querySelector('#round-score')
    const currentScore = document.getElementById('current-score')
    const newScore = parseInt(score.innerText) + parseInt(currentScore.innerText)
    const span = document.querySelector('span')
    const userId = span.dataset.id

    reqObj = {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({score: newScore})
    }

    if (event.target.id === 'submit-score') {
      updateScore(userId)
      // clearCarousel()
      // renderCarousel()
      startGame()
    }
    
  })
}

function updateScore(userId) {
  fetch(`${USERS_URL}/${userId}`, reqObj)
  .then(resp => resp.json())
  .then(user => renderUserInfo(user))

}

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
  categoryBar.innerHTML = `
    <button class="category-btn" data-id= 9>General</button>
    <button class="category-btn" data-id= 10>Books</button>
    <button class="category-btn" data-id= 11>Movies</button>
    <button class="category-btn" data-id= 22>Geography</button>
    <button class="category-btn" data-id= 23>History</button>
    <button class="category-btn" data-id= 13>Theatre</button>

  `
  categoryBar.addEventListener('click', () => {
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

function renderCarousel() {
  const middleColumn = document.querySelector('#game')
  middleColumn.innerHTML =`
  <div id="questions-carousel" class="carousel-slide" data-ride="carousel" data-wrap="false" data-pause="false" data-interval="10000">
  <div class="carousel-inner">
    <div id="carousel-msg" class="carousel-item active" data-interval="200">
    </div>
    <div id="question-slides"></div>
  </div>
  <div id="carousel-footer">
  <h2>Round Score:</h2>
  <h2 id="round-score">0</h2>
  </div>
  </div>
`
}

function clearCarousel() {
  // console.log('clearCaro')
  // debugger;
  const middleColumn = document.querySelector('#game')
  middleColumn.innerHTML = ''
}


main()
