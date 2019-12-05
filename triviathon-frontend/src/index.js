const USERS_URL = "http://localhost:3000/users"
const ANSWERS_URL = "http://localhost:3000/answers"

const form = document.getElementById('login-form')

// main function
function main() {
  document.addEventListener('DOMContentLoaded', function(){ 
    // render all users & scores in left sidebar
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
    .then(user =>  { renderUserInfo(user)
                  renderCorrectAnswers(user)
    })

    startMessage()
    getQuestions()
  }

function grabUserData(e) {
    return {username: e.target.children[1].value} 
}

function renderUserInfo(user) {
    const infosec = document.querySelector('.user-info')
    infosec.innerHTML = `<span data-id= ${user.id}>
                        <p>Name: ${user.username}</p>
                        <p id="current-score">${user.score}</p>`
  }

// user ranking functions
function getAllUsers() {
  fetch(USERS_URL)
  .then(resp => resp.json())
  .then(users => renderUsers(users))
}

function renderUsers(users) {
  users.forEach(user => listUser(user))
}

function listUser(user) {
  const userList = document.querySelector('ul')
  const userItem = document.createElement('li')
  userItem.innerText = `${user.username}   ${user.score}`
  userList.appendChild(userItem)
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
  question_info.innerText= `${questionObj.category}     Difficulty: ${questionObj.difficulty}`

  const status = document.createElement('div')
  
  slide.append(question_info, question_content)
  slide.insertAdjacentHTML('beforeend',
    `<div id="answer-form">
    <br>
    <input type="radio" name="answer" value=${answerChoices[0]}> <label>${answerChoices[0]}</label><br>
    <input type="radio" name="answer" value=${answerChoices[1]}> <label>${answerChoices[1]}</label><br>
    <input type="radio" name="answer" value=${answerChoices[2]}> <label>${answerChoices[2]}</label><br>
    <input type="radio" name="answer" value=${answerChoices[3]}> <label>${answerChoices[3]}</label><br>
    </div>`
  )
  slide.appendChild(status)
  inner.appendChild(slide)

  
  slide.addEventListener('click',() => handleSelection(questionObj))
  
      
  function handleSelection(questionObj){
    const score = document.querySelector('#round-score')
    const clickEl = event.target
    if (clickEl.tagName === 'INPUT') {
      const userChoice = clickEl.nextElementSibling.innerText
      if (userChoice === questionObj.correct_answer) {
       status.innerHTML = '<br><h4 class= "correct">CORRECT!</h4>'
       score.innerText = parseInt(score.innerText) + 1
          } else {
        status.innerHTML = '<br><h4 class= "wrong">WRONG!</h4>'
        createAnswer(question= questionObj.question, correct= false)
      }
    }
  }

  function createAnswer(question, correct) {
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
        user_id: userId
      })
    }

    fetch(ANSWERS_URL, configObj)
    .then(resp => resp.json())
    .then(answer => console.log(answer))
    .catch(err => console.log(err.message))
  }

}

function renderCorrectAnswers(user) {
  user.answers.forEach(answer => renderCorrectAnswer(answer))
}

function renderCorrectAnswer(answer) {
  const answerDiv = document.getElementsByClassName('answer-div')
  const answerHead = document.getElementById('answer-head')
  answerHead.innerText = 'Previous Correct Answers'
  const answerList = document.createElement('ul')
  const singleAnswer = document.createElement('li')
  singleAnswer.innerHTML = `${answer.question}`
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

function startMessage() {
  let startMsg = document.getElementById('mid-header')
  startMsg.innerText = `You have 30 seconds to answer each question
                        GET READY...GET SET...`
}

function finishMessage() {
  const inner = document.querySelector('#question-slides')
  const slide = document.createElement('div')
  slide.className = 'carousel-item'
  slide.innerHTML = `<h3>Congratulations! You have reached the finish line!</h3><br>
                    <button id= "submit-score"> Submit </button>`
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
      fetch(`${USERS_URL}/${userId}`, reqObj)
      .then(resp => resp.json())
      .then(user => renderUserInfo(user))
    }


   
  })
}
function startGame() {
  let carouselMsg = document.getElementById('carousel-msg')
  carouselMsg.removeChild(carouselMsg.lastElementChild)

  const startSlide = document.createElement('div')
  // startSlide.className = 'carousel-item'
  startSlide.id = 'start-game'

  const categoryBar = document.createElement('div')
  categoryBar.className="navbar"
  categoryBar.innerHTML = `
    <button class="category-btn" data-id= 9>General</button>
    <button class="category-btn" data-id= 10>Books</button>
    <button class="category-btn" data-id= 11>Movies</button>
    <button class="category-btn" data-id= 22>Geography</button>
    <button class="category-btn" data-id= 23>History</button>
  `
  categoryBar.addEventListener('click', () => {
    if (event.target.className === 'category-btn') {
      console.log(event.target)
      let categoryId = event.target.dataset.id
      startMessage()
      getQuestions(categoryId)
    }
  })

  const gameStart = document.createElement('h2')
  gameStart.className='game-inst'
  gameStart.innerText = 'Choose a category to start'

  startSlide.append(categoryBar, gameStart)
  carouselMsg.appendChild(startSlide)
}

function addCategoryListener() {
  
}



main()




   

    


